---
id: CARD-022
titulo: Ordenação das listas na tela inicial
contexto: listas
tipo: feature
camadas: [front]
complexidade: M
prioridade: mvp
incerteza: baixa
status: todo
requisitos: [RF09, RF21, RN16, RNF02, RNF06, RNF08]
depende_de: [CARD-008]
modelo_sugerido: sonnet
---

# CARD-022 — Ordenação das listas na tela inicial

## Contexto
A tela inicial (T01) mostra todas as listas, que também formam o histórico de compras. Hoje elas aparecem sempre da mais recente para a mais antiga. O usuário quer escolher a ordem, por exemplo para trazer ao topo a lista que está usando. A escolha deve ser lembrada entre aberturas do app. O RF21 e a RN16 foram criados na revisão de 10/11/2026 do refinamento.

## Objetivo
Adicionar à linha do título da tela Listas um botão "⇅ <critério> ▾", que abre um painel com quatro critérios: Mais recentes, Mais antigas, Alteradas por último e Nome A–Z. As listas são reordenadas na hora e a escolha fica salva no `localStorage`.

## Detalhamento técnico
- **Novo módulo `src/listSort.js`** (preferência e ordenação; segue o padrão de `src/theme.js`):
  ```js
  const KEY = 'cestinha.listSort';
  export const LIST_SORTS = [
    { id: 'newest',  label: 'Mais recentes' },        // default
    { id: 'oldest',  label: 'Mais antigas' },
    { id: 'updated', label: 'Alteradas por último' },
    { id: 'name',    label: 'Nome A–Z' },
  ];
  export function getListSort() { /* localStorage em try/catch; ausente ou inválido -> 'newest' */ }
  export function setListSort(id) { /* id inválido -> 'newest'; setItem em try/catch */ }
  /** Returns a new sorted array; never mutates `lists`. */
  export function sortLists(lists, sortId) { /* ... */ }
  ```
  - Regras de `sortLists` (RN16):
    - `newest`: `createdAt` decrescente;
    - `oldest`: `createdAt` crescente;
    - `updated`: `updatedAt` decrescente;
    - `name`: `new Intl.Collator('pt-BR', { sensitivity: 'base', numeric: true }).compare` (ignora maiúsculas/minúsculas e acentos; "Feira 2" antes de "Feira 10"). Crie o collator uma vez, no topo do módulo.
    - **Desempate em todos os critérios:** `createdAt` decrescente.
    - Compare datas com `Date.parse(...)`, não como string.
  - A ordem é calculada na exibição e nunca armazenada. Sem mudança no IndexedDB: nada de índice novo nem de versão nova do banco. `getAllLists()` continua como está.
  - O `updatedAt` já é atualizado por `putList` (`src/db.js`) sempre que a lista é salva, então marcar/editar itens e renomear contam como alteração.
- **`src/ui/actionSheet.js`:** aceitar a propriedade opcional `selected` (boolean) em cada ação.
  - Quando alguma ação tiver `selected` definido, cada botão ganha à esquerda uma coluna de largura fixa com `✓` (`aria-hidden="true"`), visível só na ação selecionada, para os rótulos ficarem alinhados.
  - A ação selecionada recebe `aria-current="true"`. A seleção não pode ser indicada só por cor (RNF08).
  - Os chamadores atuais, que não passam `selected`, ficam exatamente como estão.
- **`src/views/lists.js`:**
  - Manter na view `let sort = getListSort();`.
  - Na linha do título, com **2 ou mais listas**: `<h2>Listas</h2>` à esquerda e, à direita, um botão `data-sort` com o texto `⇅ ${label} ▾`.
    - O botão segue o estilo secundário do projeto (`bg-surface`, `border-line`, `text-ink`), com `min-h-11` (alvo de toque ≥ 44 px) e texto `text-sm`.
    - O texto visível já informa o critério atual. Os símbolos `⇅` e `▾` ficam em `<span aria-hidden="true">`.
  - Com 0 ou 1 lista, e nos estados carregando e erro, o título fica como hoje, sem botão.
  - A lista renderiza `sortLists(lists, sort).map(renderCard)`.
  - No handler de clique já existente, tratar `[data-sort]` com `openActionSheet`:
    - `title: 'Ordenar por'`;
    - `actions: LIST_SORTS.map((o) => ({ label: o.label, selected: o.id === sort, onSelect: () => { sort = o.id; setListSort(o.id); draw(); window.scrollTo({ top: 0 }); } }))`.
    - A rolagem é da janela: `main#view` não tem overflow próprio.
  - Renomear e excluir já chamam `load()`, que redesenha: a ordem escolhida é mantida.
- **`sw.js`:** adicionar `'src/listSort.js'` ao `APP_SHELL`. Sem isso o app quebra offline, e um caminho errado faz a instalação do service worker falhar inteira.
- **Tailwind:** se usar classes novas, rode `./tailwindcss.exe -i styles/input.css -o styles/output.css --minify` e commite o `styles/output.css`. Use só os tokens semânticos (`bg-surface`, `text-muted`, `border-line`…) e nunca monte nomes de classe dinamicamente.
- Código em inglês e textos de interface em pt-BR (RNF10).

## Critérios de aceite
- [ ] Com 2 ou mais listas, a linha do título mostra "Listas" à esquerda e o botão "⇅ Mais recentes ▾" à direita. Com 0 ou 1 lista, o botão não aparece.
- [ ] Tocar no botão abre o painel "Ordenar por" com os quatro critérios, e o atual aparece marcado com ✓.
- [ ] Dado as listas "Feira 10" (criada em 01/11), "Feira 2" (criada em 05/11) e "Ávila" (criada em 08/11):
  - "Mais recentes" mostra Ávila, Feira 2, Feira 10;
  - "Mais antigas" mostra Feira 10, Feira 2, Ávila;
  - "Nome A–Z" mostra Ávila, Feira 2, Feira 10 (RF21, RN16).
- [ ] Em "Alteradas por último", marcar um item numa lista a leva para o topo ao voltar à tela inicial. Renomear uma lista também a leva para o topo.
- [ ] Ao escolher um critério, as listas são reordenadas na hora, a tela volta ao topo e o botão passa a mostrar o critério escolhido.
- [ ] Ao fechar e reabrir o app, a tela inicial abre no último critério escolhido (RF09).
- [ ] Com um valor inválido salvo para a preferência, a tela abre em "Mais recentes" sem erro.
- [ ] O botão e as opções do painel têm alvo de toque de pelo menos 44 px e são legíveis nos temas claro e escuro. A opção atual não é indicada só por cor (RNF06, RNF08).
- [ ] Os outros menus que usam o mesmo painel (⋮ do card de lista e menu da tela da lista) continuam iguais, sem ✓ nem recuo.
- [ ] A aba Templates continua na ordem atual, sem seletor.
- [ ] Depois de atualizar o app, a ordenação funciona offline (RNF02).

## Como testar
**Validação manual**
1. Abra o app pelo Live Server, com "Update on reload" marcado em DevTools › Application › Service Workers.
2. Com 0 listas e depois com 1 lista, confira que o botão de ordenação não aparece. Crie a segunda lista e confira que ele aparece (critério 1).
3. Crie as três listas de exemplo pelo console do DevTools:
   ```js
   const db = await import('./src/db.js'); const m = await import('./src/model.js');
   for (const [name, day] of [['Feira 10', '01'], ['Feira 2', '05'], ['Ávila', '08']]) {
     const l = m.createList({ name }); l.createdAt = `2026-11-${day}T12:00:00.000Z`; await db.putList(l);
   }
   ```
   Recarregue a tela inicial.
4. Toque no botão e confira o painel com ✓ em "Mais recentes" (critério 2). Escolha cada critério e confira as ordens (critério 3).
5. Escolha "Alteradas por último", abra "Feira 10", marque um item e volte: ela deve estar no topo. Renomeie "Feira 2" pelo ⋮: ela vai para o topo (critério 4).
6. Role a tela para baixo, troque o critério e confira que a tela volta ao topo e que o botão mudou de texto (critério 5).
7. Escolha "Nome A–Z", feche a aba e abra de novo: deve continuar em "Nome A–Z" (critério 6).
8. No console, rode `localStorage.setItem('cestinha.listSort', 'xyz')` e recarregue: deve abrir em "Mais recentes" (critério 7).
9. Confira o tamanho dos alvos no modo celular do DevTools e alterne entre os temas claro e escuro em Configurações (critério 8).
10. Abra o ⋮ de um card e o menu da tela de uma lista: devem estar iguais a antes (critério 9). Confira a aba Templates (critério 10).
11. Em DevTools › Network, ative "Offline", recarregue e troque o critério (critério 11).

**Testes automatizados**
Nenhum: o projeto não usa testes automatizados (ver CLAUDE.md, "No unit tests").

## Observações
- Com nomes no formato DD/MM/AAAA (CARD-021), "Nome A–Z" agrupa por dia e não segue a ordem cronológica ("01/12/2026" antes de "10/11/2026"). Isso é aceito (risco 10 do refinamento): para ordem cronológica existem "Mais recentes" e "Mais antigas".
- A preferência fica no `localStorage`, e não no IndexedDB, por ser uma preferência de interface, como o tema.
- No deploy, lembrar de aumentar o `APP_VERSION` em `version.js`; sem isso, os celulares instalados não recebem o arquivo novo.

## Pendências
- [CARD-008 — Tela inicial: Listas (T01)](CARD-008-tela-inicial-listas.md) (concluído)

## Fora do escopo
- Ordenação na aba Templates.
- Reordenar listas arrastando ou fixar listas no topo.
- Esconder ou trocar a data exibida no card de lista.
- Nome sugerido com a data (CARD-021).
- Qualquer mudança no IndexedDB (índices, versão, campos).

## Referências
Refinamento (revisão 10/11/2026): RF09, RF21 e o critério de aceite "RF21 — Ordenar listas", RN16, tela T01 (wireframe validado), fluxo F5, seção 11 (chave `cestinha.listSort`) e seção 12 (ponto de atenção "Ordenação por nome").

## Justificativa da complexidade e do modelo
- **M:** módulo novo com persistência, extensão de um componente compartilhado sem quebrar os chamadores, reorganização do cabeçalho da tela e inclusão no app shell.
- **sonnet:** card de funcionalidade típico, com incerteza baixa e sem área arriscada (não há migração de banco nem mudança de cache).
