---
id: CARD-017
titulo: Backup — exportar dados
contexto: configuracoes
tipo: feature
camadas: [front, banco]
complexidade: M
prioridade: mvp
incerteza: media
status: todo
requisitos: [RF20, RN18, RNF04, RNF07]
depende_de: [CARD-002, CARD-013, CARD-022]
modelo_sugerido: sonnet
---

# CARD-017 — Backup: exportar dados

## Contexto
Todos os dados do Cestinha ficam só no navegador do celular. O uso principal do backup é levar os dados para outro aparelho (por exemplo, do Android para o iPhone); a proteção contra perda vem em segundo plano. O backup é manual: um arquivo JSON exportado em Configurações e importado no outro aparelho. A revisão de 10/11/2026 do refinamento trouxe o RF20 para o MVP. A importação é o [CARD-023](CARD-023-importar-backup.md).

## Objetivo
Em Configurações, exportar todos os templates, listas e preferências para um arquivo `cestinha-backup-AAAA-MM-DD.json`, enviado pelo menu de compartilhar do celular (ou baixado), e mostrar há quanto tempo foi o último backup.

## Detalhamento técnico
- **`src/backup.js` (novo, entra no `APP_SHELL` do `sw.js`):**
  - `export const BACKUP_VERSION = 1;`
  - `buildBackup({ templates, lists })` → objeto no formato da seção 11 do refinamento (`app: 'cestinha'`, `backupVersion`, `appVersion: self.APP_VERSION`, `exportedAt: new Date().toISOString()`, `preferences: { theme: getThemeMode(), listSort: getListSort() }`, `templates`, `lists`). Os registros vão exatamente como vêm de `getAllTemplates()`/`getAllLists()`.
  - `backupFileName(date)` → `cestinha-backup-2026-11-10.json`, com a data **local** (`getFullYear`, `getMonth() + 1`, `getDate()` com zero à esquerda); nunca `toISOString()`, que usa UTC.
  - `createBackupFile(backup, date)` → `new File([JSON.stringify(backup, null, 2)], backupFileName(date), { type: 'application/json' })`.
  - `shareOrDownload(file)` → resolve `'shared' | 'downloaded' | 'cancelled'`:
    - se `navigator.canShare?.({ files: [file] })`: `await navigator.share({ files: [file], title: 'Backup do Cestinha' })` → `'shared'`; `AbortError` → `'cancelled'`; qualquer outro erro → cai para o download;
    - download: `<a download>` com `URL.createObjectURL(file)`, `click()`, e `URL.revokeObjectURL` depois (ex.: `setTimeout` de alguns segundos) → `'downloaded'`.
  - Último backup, chave `cestinha.lastBackup` no `localStorage` (data ISO), leitura e escrita em `try/catch`, no padrão de `src/theme.js` e `src/listSort.js`:
    - `getLastBackup()` → `Date` ou `null` (ausente ou ilegível → `null`);
    - `setLastBackup(date)`.
  - `formatLastBackup(date, now = new Date())` → `'hoje (10/11/2026)'`, `'há 1 dia (09/11/2026)'`, `'há 12 dias (29/10/2026)'` ou `'nunca'` (`null`). Conta **dias de calendário** locais (compara as datas à meia-noite local, não 24 h corridas). A data entre parênteses usa `formatShortDate` de `src/calc.js`.
- **`src/views/settings.js`:** seção **"Backup"** entre o Tema e a versão, conforme o wireframe validado de T07:
  - `<h3>`/legend "Backup"; texto "Último backup: {formatLastBackup(...)}";
  - botão principal "Exportar dados" (`BTN_PRIMARY`, largura total, `data-export`) e botão secundário "Importar dados" (`BTN_SECONDARY`, largura total, `data-import`) **ainda sem ação**: o CARD-023 liga o comportamento. Os dois cards vão juntos no mesmo deploy;
  - nota `text-sm text-muted`: "Importar substitui todos os dados deste aparelho.";
  - ao renderizar, carrega `getAllTemplates()` e `getAllLists()`. Sem nenhum template nem lista: "Exportar dados" fica `disabled` e aparece o texto "Nada para exportar ainda" (RN18). Respeitar o padrão de `disposed` das outras views para ignorar resultados depois da cleanup.
  - **Gesto do usuário (iPhone):** o WebKit exige que `navigator.share` seja chamado logo após o toque. Montar o `File` **antes** do toque (ao carregar os dados na renderização) e, no clique, chamar `shareOrDownload` sem nenhum `await` antes dele. Não ler o IndexedDB dentro do clique.
  - Depois de `'shared'` ou `'downloaded'`: `setLastBackup(new Date())` e atualizar o texto para "hoje (…)". Depois de `'cancelled'`: nada muda.
  - Falha inesperada (leitura do banco, criação do arquivo): texto `role="alert"` `text-danger` "Não foi possível exportar. Tente de novo." na seção Backup.
- **`sw.js`:** adicionar `'src/backup.js'` ao `APP_SHELL`.
- **Tailwind:** se usar classes novas, regerar `styles/output.css` com `--minify`.
- Sem testes automatizados (CLAUDE.md, "No unit tests").

## Critérios de aceite
- [ ] Em Configurações aparece a seção "Backup" com "Último backup", os botões "Exportar dados" e "Importar dados" e a nota "Importar substitui todos os dados deste aparelho.", como no wireframe de T07.
- [ ] Num aparelho que nunca exportou, aparece "Último backup: nunca".
- [ ] Dado que existem templates e listas, quando toco em "Exportar dados" no Android, então abre o menu de compartilhar do sistema com o arquivo `cestinha-backup-AAAA-MM-DD.json` (data de hoje) (RF20).
- [ ] O mesmo vale no iPhone (Safari e app instalado na tela de início): o menu de compartilhar abre com o arquivo, e "Salvar em Arquivos" grava o `.json`.
- [ ] No computador (Chrome sem menu de compartilhar com arquivos), o arquivo é baixado.
- [ ] O arquivo abre num editor de texto, está indentado e contém `app: "cestinha"`, `backupVersion: 1`, `appVersion`, `exportedAt`, as preferências de tema e de ordenação atuais e todos os templates e listas, com itens, marcações e valores.
- [ ] Depois de enviar (ou baixar) o arquivo, o texto passa a "Último backup: hoje (DD/MM/AAAA)" e continua assim ao sair e voltar para Configurações.
- [ ] Se eu abrir o menu de compartilhar e cancelar, o "Último backup" não muda.
- [ ] Com o relógio do aparelho num dia seguinte ao do último backup, aparece "há 1 dia (…)"; vários dias depois, "há N dias (…)" (RN18).
- [ ] Sem nenhum template nem lista, "Exportar dados" fica desativado e aparece "Nada para exportar ainda".
- [ ] Exportar funciona em modo avião, e nada é enviado para a rede além do destino que eu escolho no menu de compartilhar (RNF04).
- [ ] Os botões têm no mínimo 44 px de altura, e a tela funciona nos temas claro e escuro.

## Como testar
**Validação manual (usuário)**
1. Abra o app (Live Server ou o deploy) e entre em Configurações pela engrenagem → confira a seção Backup e "nunca" (critérios 1 e 2).
2. Com pelo menos um template e uma lista, toque em "Exportar dados" no Android → menu de compartilhar com o arquivo de nome correto (critério 3).
3. Repita no iPhone, no Safari e no app instalado; escolha "Salvar em Arquivos" (critério 4).
4. No Chrome do computador, toque em "Exportar dados" → o arquivo é baixado (critério 5).
5. Abra o arquivo num editor de texto e confira os campos e os dados (critério 6).
6. Volte a Configurações → "hoje (…)"; saia e volte (critério 7).
7. Toque em "Exportar dados" e cancele o menu → o texto não muda (critério 8). Para conferir sem esperar, apague a chave `cestinha.lastBackup` no DevTools antes.
8. No DevTools › Application › Local Storage, troque `cestinha.lastBackup` por uma data de ontem e depois de 12 dias atrás, recarregando → "há 1 dia", "há 12 dias" (critério 9).
9. Em DevTools › Application › Storage, limpe os dados do site e abra Configurações → botão desativado com "Nada para exportar ainda" (critério 10).
10. Em modo avião, repita o passo 2 escolhendo um destino local, com a aba Network do DevTools aberta no computador (critério 11).
11. Confira o tamanho dos botões e troque o tema (critério 12).

**Testes automatizados (quem implementa)**
Nenhum: o projeto não usa testes automatizados (CLAUDE.md). Conferir `backupFileName` e `formatLastBackup` raciocinando sobre os exemplos (ex.: exportar às 22h de 10/11 no horário de Brasília dá `2026-11-10`; backup às 23h de ontem, visto às 8h de hoje, dá "há 1 dia").

## Observações
- O formato do arquivo e as regras estão na seção 11 do refinamento (arquivo de backup) e na RN18.
- O "Último backup" não vai no arquivo, e importar não o altera: um aparelho recém-importado mostra "nunca" (decisão do refinamento).
- No iPhone, o download dentro do app instalado é pouco confiável; por isso o menu de compartilhar vem primeiro (risco 14 do refinamento).

## Pendências
- [CARD-002 — Camada de dados com IndexedDB](../01-fundacao/CARD-002-camada-de-dados-indexeddb.md)
- [CARD-013 — Tema e Configurações](CARD-013-tema-e-configuracoes.md)
- [CARD-022 — Ordenação das listas](../04-listas/CARD-022-ordenacao-das-listas.md) (preferência `listSort`)

## Fora do escopo
- Importar o backup, ler e validar o arquivo, a confirmação de substituição (CARD-023).
- Backup automático ou em nuvem, exportar só parte dos dados, lembrete ativo de backup atrasado (não-objetivos).
- Aumentar o `APP_VERSION` (fica para o deploy).

## Referências
Refinamento: RF20 (critérios "Exportar backup"), RN18, RNF04, RNF07, fluxo F6, tela T07, seção 11 (arquivo de backup e `cestinha.lastBackup`), seção 12 ("Exportar no celular"), riscos 12 e 14.

## Justificativa da complexidade
M: geração de arquivo com compartilhamento e alternativa de download, cuidado com o gesto do usuário no iPhone, preferência nova e mudança na tela. Incerteza média pelo comportamento do menu de compartilhar em cada sistema.
