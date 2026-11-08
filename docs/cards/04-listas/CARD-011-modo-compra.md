---
id: CARD-011
titulo: Modo compra — marcar itens, progresso e totais (T03, parte 2)
contexto: listas
tipo: feature
camadas: [front, banco]
complexidade: M
prioridade: mvp
incerteza: baixa
status: todo
requisitos: [RF10, RF12, RF13, RN04, RN05, RN06, RN07, RN14, RNF05, RNF06, RNF08]
depende_de: [CARD-003, CARD-010]
---

# CARD-011 — Modo compra: marcar itens, progresso e totais (T03, parte 2)

## Contexto
A tela da lista é onde o usuário ajusta a lista do dia antes de sair e onde a usa dentro do mercado. A tela T03 foi dividida em dois cards:
- **CARD-010:** itens e edição;
- **este:** o fluxo central do mercado. O usuário pega o produto, marca como "no carrinho" e acompanha quanto já gastou e quanto falta.

## Objetivo
Adicionar à tela da lista:
- o checkbox de "no carrinho";
- a ordenação, com os marcados no fim e riscados;
- o resumo fixo no topo, com barra de progresso, **total no carrinho** e **total previsto**.

Tudo com resposta imediata.

## Detalhamento técnico
- **`src/calc.js`:** acrescentar `sortItemsForDisplay(items)`. Primeiro vêm os desmarcados por `order` asc, depois os marcados por `order` asc (RN14). Adicionar os testes correspondentes em `tests/calc.test.js`.
- **Checkbox:** `<input type="checkbox">` nativo com `accent-color` primária, dentro de um `<label>` com área de toque ≥ 44 px e `aria-label="No carrinho: <nome>"`.
- **Ao alternar o checkbox:**
  1. inverte `item.checked`;
  2. re-renderiza a lista e o resumo imediatamente;
  3. chama `putList` (otimista, com o mesmo tratamento de erro do CARD-010).
- **Item marcado:** `line-through` e cor `text-muted`. O estado não depende só da cor (RNF08).
- **Resumo fixo** (`sticky top-0`, fundo `bg-surface`):
  - barra de progresso com `role="progressbar"` e texto "3 de 10 itens";
  - **"No carrinho"** em destaque, com `text-2xl` e `tabular-nums`;
  - **"Previsto"** menor ao lado.
  - Valores via `listTotals` e `listProgress`.
- **Estado "tudo marcado"** (`checked === total > 0`): barra cheia e destaque visual de conclusão, por exemplo a mensagem "Tudo no carrinho!" em cor primária.

## Critérios de aceite
- [ ] Dado 10 itens desmarcados, quando marcar 3, então eles ficam riscados e vão para o fim, a barra mostra 30%, o texto mostra "3 de 10" e o total no carrinho soma os subtotais desses 3 (os que têm valor) (RF10).
- [ ] Ao desmarcar um deles, o item volta à sua posição original entre os desmarcados, e progresso e total refletem só os marcados.
- [ ] Dado Arroz (1 un × R$ 25,00, marcado), Carne (1,5 kg × R$ 40,00, não marcado) e Sabão (2 un, sem valor, marcado), o resumo mostra no carrinho R$ 25,00, previsto R$ 85,00 e "2 de 3 itens" (RF13, RN05 a RN07).
- [ ] Os desmarcados mantêm a ordem de inserção (RN14).
- [ ] Editar o valor de um item marcado atualiza o subtotal e os dois totais na hora (RF12).
- [ ] Marcar ou desmarcar responde sem atraso perceptível, porque a UI atualiza antes da gravação (RNF05).
- [ ] O estado "tudo marcado" aparece quando todos os itens estão marcados e some ao desmarcar um.
- [ ] Lista vazia mostra progresso 0% e totais R$ 0,00 (RN07).
- [ ] Os valores não "pulam" de largura ao atualizar (`tabular-nums`).
- [ ] Os testes de `sortItemsForDisplay` passam em `tests/calc.test.html`.

## Observações
- Mover o item para o fim pode desorientar. Uma transição curta é desejável, mas não obrigatória.
- O resumo fixo não pode cobrir o campo de adição rápida quando o teclado estiver aberto. Testar no celular (CARD-016).

## Pendências
- [ ] [CARD-003 — Cálculos, formatação e entrada numérica pt-BR](../01-fundacao/CARD-003-calculos-e-formatacao.md)
- [ ] [CARD-010 — Detalhe da lista](../04-listas/CARD-010-detalhe-da-lista.md)

## Fora do escopo
- Estado ou botão de "finalizar compra" (não-objetivo, RN09).
- Preço sugerido (CARD-018).

## Referências
Refinamento: tela T03, fluxo F3, critérios de aceite do RF10 e do RF13, RN04 a RN07, RN14, RNF05, RNF06 e RNF08. Seção 9 (barra de progresso como elemento marcante).

## Justificativa da complexidade
M: interação central com estado otimista, ordenação e resumo fixo, com várias regras de cálculo envolvidas.
