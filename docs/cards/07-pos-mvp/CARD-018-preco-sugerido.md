---
id: CARD-018
titulo: Preço sugerido com base na última compra
contexto: pos-mvp
tipo: feature
camadas: [front, banco]
complexidade: M
prioridade: depois
incerteza: media
status: todo
requisitos: [RF19]
depende_de: [CARD-011]
---

# CARD-018 — Preço sugerido com base na última compra

## Contexto
No mercado, o usuário informa o valor de cada item. Muitos itens se repetem de uma compra para outra, então o valor da última compra é um bom ponto de partida e ajuda a estimar o total previsto antes de sair de casa.

## Objetivo
Sugerir para um item o valor pago na compra mais recente em que um item de mesmo nome teve valor.

## Detalhamento técnico
- **`src/model.js` ou novo `src/pricing.js`:** `findLastPrice(lists, name, { excludeListId })`.
  - Percorre as listas por `createdAt` desc e procura o primeiro item com `normalizeName` igual e `priceCents != null`.
  - Devolve `{ priceCents, unit, listName, date }` ou `null`.
  - Considerar só itens da mesma unidade (`un` × `kg`).
- **Editor de item (CARD-005):** quando o valor está vazio e existe sugestão, mostrar um chip "Última compra: R$ 12,90 (08/11)". Tocar no chip preenche o campo.
- **Desempenho:** a busca percorre o histórico inteiro. Para centenas de listas é aceitável. Se necessário, montar um mapa `nome normalizado → último preço` ao abrir a lista.

## Critérios de aceite
- [ ] Dado "Arroz" com R$ 25,00 numa lista anterior, quando abrir o editor de "Arroz" sem valor em outra lista, então aparece a sugestão de R$ 25,00, e tocar nela preenche o campo (RF19).
- [ ] O valor da própria lista atual e itens sem valor não entram na busca.
- [ ] Item sem histórico não mostra sugestão.
- [ ] A sugestão nunca é gravada sem ação do usuário.

## Observações
- Rever junto a pergunta 5 do refinamento: levar o valor para o template ao aceitar a sugestão do RF14.
- O histórico de preços por item continua sendo um não-objetivo: aqui só se usa o último valor.

## Pendências
- [ ] Decidir a UX: sugerir no editor (chip) **ou** pré-preencher os valores ao gerar a lista do template. Sugestão: chip no editor.
- [ ] [CARD-011 — Modo compra](../04-listas/CARD-011-modo-compra.md)

## Referências
Refinamento: RF19, pergunta 5 da seção 13, escopo "Depois".

## Justificativa da complexidade
M: busca no histórico com normalização e mudança no editor. Incerteza média pela definição de UX em aberto.
