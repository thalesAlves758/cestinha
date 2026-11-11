---
id: CARD-023
titulo: Backup — importar dados
contexto: configuracoes
tipo: feature
camadas: [front, banco]
complexidade: M
prioridade: mvp
incerteza: media
status: done
requisitos: [RF20, RN17]
depende_de: [CARD-017]
modelo_sugerido: sonnet
---

# CARD-023 — Backup: importar dados

## Contexto
Todos os dados do Cestinha ficam só no navegador do celular. O uso principal do backup é levar os dados para outro aparelho (por exemplo, do Android para o iPhone); a proteção contra perda vem em segundo plano. O backup é manual: um arquivo JSON exportado em Configurações ([CARD-017](CARD-017-exportar-backup.md)) e importado no outro aparelho. A revisão de 10/11/2026 do refinamento trouxe o RF20 para o MVP.

## Objetivo
Em Configurações, importar um arquivo de backup do Cestinha **substituindo** todos os templates, listas e preferências do aparelho, depois de uma confirmação com o resumo, recusando arquivos inválidos sem alterar nada.

## Detalhamento técnico
- **`src/db.js`:** `replaceAllData({ templates, lists })`.
  - Uma única transação `db.transaction(['templates', 'lists'], 'readwrite')`: `clear()` nos dois stores e `put()` de cada registro **como veio** (sem passar por `put()`/`putTemplate`/`putList`, que sobrescrevem `updatedAt`).
  - Resolve no `oncomplete`; rejeita no `onerror`/`onabort`. Se falhar, o IndexedDB desfaz tudo.
  - Sem mudança de schema (nenhuma versão nova do banco).
- **`src/backup.js` (criado no CARD-017):**
  - `parseBackup(text)` → `{ ok: true, backup }` ou `{ ok: false, error }`, com `error` em:
    - `'not-cestinha'`: JSON inválido, não é objeto, ou `app !== 'cestinha'`;
    - `'too-new'`: `backupVersion` maior que `BACKUP_VERSION`;
    - `'invalid'`: `backupVersion` ausente ou não inteiro ≥ 1, `templates`/`lists` não são arrays, ou algum registro inválido.
  - Validação estrita de cada registro (RN17; tratar o arquivo como dado não confiável):
    - template: `id` string não vazia, `name` string com conteúdo depois do `trim` (RN11), `createdAt` e `updatedAt` strings com `Date.parse` válido, `items` array;
    - lista: o mesmo, mais `templateId` string ou `null`;
    - item: `id` string não vazia, `name` com conteúdo, `quantity` número finito > 0 (RN02), `unit` `'un'` ou `'kg'` (RN01), `priceCents` `null` ou inteiro ≥ 0 (RN03), `order` número finito; item de lista também `checked` booleano;
    - `id` repetido dentro de `templates` ou dentro de `lists` → `'invalid'`.
  - `migrateBackup(backup)`: converte formatos antigos para o atual, versão a versão. Hoje só existe a versão 1, então devolve o próprio objeto; deixar o ponto preparado (ex.: `if (backup.backupVersion < 2) { … }` comentado), no padrão das migrações de `db.js`.
  - Preferências: valores desconhecidos ou ausentes **não** recusam o arquivo; `setThemeMode` e `setListSort` já normalizam valores inválidos para o padrão.
  - `importBackup(backup)`: `await replaceAllData(...)` e só depois `setThemeMode(backup.preferences?.theme)` (aplica o tema na hora) e `setListSort(backup.preferences?.listSort)`. Não altera `cestinha.lastBackup`.
- **`src/views/settings.js`:** ligar o botão "Importar dados" (`data-import`, renderizado no CARD-017).
  - `<input type="file" accept=".json,application/json" hidden>` na seção Backup; o clique no botão chama `input.click()` direto (gesto do usuário). O `accept` com extensão é necessário no iPhone, que às vezes desativa arquivos `.json` quando o filtro é só o tipo.
  - No `change`: `await file.text()` → `parseBackup`. Em erro, mostrar na seção Backup um texto `role="alert"` `text-danger` (o mesmo elemento de erro do CARD-017, se houver) e não mudar nada:
    - `'not-cestinha'` → "Este arquivo não é um backup do Cestinha."
    - `'invalid'` → "O backup está com problema e não foi importado."
    - `'too-new'` → "Este backup é de uma versão mais nova do Cestinha. Atualize o app e tente de novo."
  - Arquivo válido: contar os dados atuais (`getAllTemplates()`, `getAllLists()`) e abrir `confirmDialog({ title: 'Substituir os dados?', message, confirmLabel: 'Substituir', danger: true })`.
    - `message`: "Backup de {formatShortDate(exportedAt)}, com {3 templates} e {12 listas}. {Os 1 template e 2 listas deste aparelho serão apagados.} Isso não pode ser desfeito."
    - Plural: "1 template" / "N templates", "1 lista" / "N listas" (inclusive "0 templates").
    - Aparelho sem nenhum dado: trocar a frase do meio por "Este aparelho não tem dados.".
    - `exportedAt` ilegível: "Backup de data desconhecida, com …".
  - "Cancelar": nada muda. "Substituir": `await migrateBackup` → `importBackup`; sucesso → `location.hash = '#/lists'` e `showToast({ message: 'Backup importado' })`; falha na gravação → "Não foi possível importar. Tente de novo." (os dados continuam como estavam, pela transação).
  - Sempre zerar `input.value` depois de tratar o arquivo, para permitir escolher o mesmo arquivo de novo.
  - "Importar dados" continua disponível mesmo sem dados no aparelho (é o caso do celular novo).
- **Tailwind:** se usar classes novas, regerar `styles/output.css` com `--minify`.
- Sem testes automatizados (CLAUDE.md, "No unit tests").

## Critérios de aceite
- [x] Dado um aparelho com 1 template e 2 listas e um backup com 3 templates e 12 listas, quando toco em "Importar dados" e escolho o arquivo, então aparece "Substituir os dados?" com "Backup de DD/MM/AAAA, com 3 templates e 12 listas. Os 1 template e 2 listas deste aparelho serão apagados. Isso não pode ser desfeito." e os botões "Cancelar" e "Substituir" (RF20, RN17).
- [x] Tocando em "Cancelar", nada muda.
- [x] Tocando em "Substituir", o app vai para a tela Listas com o aviso "Backup importado", e só existem os templates e listas do arquivo, com itens, marcações e valores iguais aos do aparelho de origem.
- [x] Depois de importar, as listas aparecem na mesma ordem do aparelho de origem, inclusive em "Alteradas por último" (as datas do arquivo são mantidas).
- [x] O tema e a ordenação passam a ser os do arquivo, e o tema muda na hora.
- [x] Num aparelho sem dados, a confirmação diz "Este aparelho não tem dados." e a importação funciona normalmente.
- [x] Um arquivo JSON de outro app (ou um arquivo que não é JSON) é recusado com "Este arquivo não é um backup do Cestinha.", sem alterar nada.
- [x] Um backup editado à mão com um item inválido (ex.: `quantity: 0` ou `unit: "g"`) é recusado com "O backup está com problema e não foi importado.", sem alterar nada.
- [x] Um backup com `backupVersion` maior que a do app é recusado com "Este backup é de uma versão mais nova do Cestinha. Atualize o app e tente de novo.", sem alterar nada.
- [x] Um backup com tema ou ordenação desconhecidos é importado, e essas preferências voltam ao padrão.
- [x] Importar não muda o "Último backup" (num aparelho novo, continua "nunca").
- [x] Escolher o mesmo arquivo duas vezes seguidas abre a confirmação nas duas vezes.
- [x] No iPhone, "Importar dados" abre o seletor do app Arquivos, e o `.json` salvo pelo CARD-017 pode ser escolhido.
- [x] Importar funciona em modo avião.

## Como testar
**Validação manual (usuário)**
1. No aparelho A, exporte um backup (CARD-017). No aparelho B (ou outro perfil do Chrome), crie 1 template e 2 listas.
2. No B: Configurações › "Importar dados" › escolha o arquivo → confira a confirmação (critério 1). Toque em "Cancelar" e confira que nada mudou (critério 2).
3. Importe de novo e toque em "Substituir" → tela Listas, aviso e dados iguais aos do A (critério 3).
4. Troque a ordenação para "Alteradas por último" e compare com o A (critério 4). Confira o tema e a ordenação (critério 5).
5. Limpe os dados do site no B (DevTools › Application › Storage) e importe de novo → "Este aparelho não tem dados." (critério 6).
6. Tente importar o `manifest.webmanifest` renomeado para `.json` e um `.txt` qualquer (critério 7).
7. Edite uma cópia do backup: troque a `quantity` de um item por `0` → recusado (critério 8). Em outra cópia, troque `backupVersion` por `99` → recusado (critério 9). Em outra, troque `theme` por `"roxo"` → importa com tema automático (critério 10).
8. Confira "Último backup" depois de importar (critério 11).
9. Escolha o mesmo arquivo duas vezes, cancelando na primeira (critério 12).
10. No iPhone, importe o arquivo salvo em Arquivos (critério 13).
11. Em modo avião, repita o passo 3 (critério 14).

**Testes automatizados (quem implementa)**
Nenhum: o projeto não usa testes automatizados (CLAUDE.md). Conferir `parseBackup` raciocinando sobre os casos do passo 7 e sobre um arquivo vazio (`{}` → `'not-cestinha'`).

## Observações
- Importar sempre substitui tudo; juntar dados é não-objetivo (decisão do refinamento: previsível e fácil de conferir na troca de celular).
- A importação é tudo ou nada: validar o arquivo inteiro **antes** de abrir a transação, e a transação única garante que uma falha na gravação não deixa dados pela metade.
- Nomes vindos do arquivo continuam escapados na exibição pelo `html` de `src/ui/dom.js`.
- `templateId` de uma lista pode apontar para um template inexistente, como no uso normal (RN13); não é motivo de recusa.

## Pendências
- [CARD-017 — Backup: exportar dados](CARD-017-exportar-backup.md) (formato do arquivo, `src/backup.js` e a seção Backup)

## Fora do escopo
- Exportar e o "Último backup" (CARD-017).
- Juntar dados, importar só parte, importar de outros apps ou planilhas, desfazer a importação, backup automático antes de substituir (não-objetivos ou decisões do refinamento).
- Nova versão do banco ou índice novo.
- Aumentar o `APP_VERSION` (fica para o deploy).

## Referências
Refinamento: RF20 (critérios "Importar backup"), RN17, RN01–RN03, RN11, RN13, fluxo F6, tela T07 (confirmação e estados de erro), seção 11 (arquivo de backup e "Importação"), seção 12 ("Importar no iPhone", "Validação do arquivo", "Importação atômica", "Tema após importar"), riscos 13 e 14.

## Justificativa da complexidade
M: validação estrita do arquivo, transação sobre dois stores sem tocar em `updatedAt`, confirmação com resumo e vários estados de erro. Incerteza média pelo seletor de arquivos no iPhone.
