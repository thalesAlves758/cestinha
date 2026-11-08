---
id: CARD-008
titulo: Tela inicial — Listas (T01)
contexto: listas
tipo: feature
camadas: [front, banco]
complexidade: M
prioridade: mvp
incerteza: baixa
status: done
requisitos: [RF08, RF09, RN09, RN12, RNF08]
depende_de: [CARD-002, CARD-003, CARD-004]
---

# CARD-008 — Tela inicial: Listas (T01)

## Contexto
A tela inicial mostra todas as listas do dia, as em andamento e as antigas. Como não existe estado "finalizada", essa mesma lista funciona como histórico de compras. É por ela que o usuário entra nas listas e cria novas.

## Objetivo
Implementar `#/lists`, com:
- cards das listas da mais recente para a mais antiga, cada um com progresso e total previsto;
- renomear e excluir pelo menu do card;
- estados de vazio, carregando e erro.

## Detalhamento técnico
- **`src/views/lists.js`:** `render(container)` carrega `getAllLists()`, já em `createdAt` desc.
- **Card de lista:**
  - nome;
  - data de criação via `Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })`;
  - barra de progresso (`role="progressbar"` com `aria-valuenow`, `aria-valuemin` e `aria-valuemax`, preenchida em `bg-primary`);
  - contagem "marcados/total" em texto;
  - total previsto com `formatMoney(listTotals(items).plannedCents)`, ou "—" se nenhum item tiver valor.
  - Tudo vem de `listProgress` e `listTotals` (CARD-003).
- Tocar no card leva a `#/list/:id`.
- **Menu do card:** o botão "⋮" abre `openActionSheet` com:
  - "Renomear": `promptText` e depois `putList`;
  - "Excluir": `confirmDialog`, depois `deleteList` e re-render.
- **Botão "+":** abre o painel Nova lista. A função `openNewListSheet()` é criada no CARD-009. Até lá, o botão fica conectado a um stub.
- **Estados:**
  - **Vazio:** "Nenhuma lista ainda. Crie um template com seus itens de sempre ou comece uma lista em branco.", com os botões "Criar template" (`#/templates`) e "Nova lista".
  - **Carregando:** 2 ou 3 cards esqueleto (`animate-pulse`).
  - **Erro:** "Não foi possível acessar o armazenamento do aparelho."
- Valores com `tabular-nums`. O conteúdo tem padding inferior para não ficar atrás do botão "+" e das abas.

## Critérios de aceite
- [x] Dado 5 listas de datas diferentes, quando abrir o app, então elas aparecem da mais recente para a mais antiga, cada uma com nome, data, barra de progresso, "marcados/total" e total previsto (RF09).
- [x] O progresso é indicado também por texto, não só pela cor (RNF08).
- [x] Renomear pelo menu atualiza o card. Nome vazio é recusado.
- [x] Excluir pede confirmação e remove a lista da tela e do banco (RF08).
- [x] Sem listas, aparece o estado vazio com os dois atalhos.
- [x] Com o IndexedDB indisponível (ex.: simular erro em `openDb`), aparece o estado de erro em vez de tela em branco.
- [x] Não existe nenhum botão ou estado de "finalizar" lista (RN09).
- [x] Qualquer quantidade de listas é exibida (RN12).

## Observações
- A tela inicial cresce sem limite (risco 2 do refinamento). No MVP, renderizar tudo. Agrupar por mês ou buscar fica para depois do uso real.

## Pendências
- [ ] [CARD-002 — Camada de dados com IndexedDB](../01-fundacao/CARD-002-camada-de-dados-indexeddb.md)
- [ ] [CARD-003 — Cálculos, formatação e entrada numérica pt-BR](../01-fundacao/CARD-003-calculos-e-formatacao.md)
- [ ] [CARD-004 — Componentes base](../02-componentes/CARD-004-paineis-dialogos-e-avisos.md)

## Fora do escopo
Painel de criação de lista (CARD-009) e o conteúdo da lista (CARD-010 e CARD-011).

## Como testar
Criar listas pelo console (ver "Como testar" do CARD-002) com datas e itens marcados variados e conferir a ordem, o progresso e os totais.

## Referências
Refinamento: tela T01, fluxo F4, RF08, RF09, RN09, RN12 e RNF08.

## Justificativa da complexidade
M: listagem com cálculos, menu de ações e três estados de tela.
