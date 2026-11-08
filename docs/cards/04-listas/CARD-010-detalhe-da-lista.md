---
id: CARD-010
titulo: Detalhe da lista — itens, renomear e excluir (T03, parte 1)
contexto: listas
tipo: feature
camadas: [front, banco]
complexidade: M
prioridade: mvp
incerteza: baixa
status: todo
requisitos: [RF07, RF08, RF11, RF12]
depende_de: [CARD-005, CARD-009]
---

# CARD-010 — Detalhe da lista: itens, renomear e excluir (T03, parte 1)

## Contexto
A tela da lista é onde o usuário ajusta a lista do dia antes de sair e onde a usa dentro do mercado. A tela T03 foi dividida em dois cards:
- **este:** exibir e editar os itens, renomear e excluir a lista;
- **CARD-011:** marcar itens, progresso e totais.

## Objetivo
Implementar `#/list/:id`, com:
- a lista de itens (nome, quantidade, valor e subtotal);
- adição rápida e completa de itens, edição e remoção;
- renomear e excluir a lista.

Toda alteração é salva na hora.

## Detalhamento técnico
- **`src/views/list.js`:** `render(container, { id })`. Carrega com `getList(id)`.
- **Cabeçalho:**
  - voltar (`#/lists`);
  - nome da lista (tocar abre `promptText` para renomear);
  - botão "⋮" com "Renomear" e "Excluir lista". Excluir passa por `confirmDialog`, depois `deleteList` e navega para `#/lists`.
- **Linha de item:**
  - nome;
  - `formatQuantity`;
  - valor unitário (`formatMoney` + "/un" ou "/kg");
  - subtotal (`itemSubtotalCents`).
  - Item sem valor não mostra subtotal (RF12).
  - Tocar abre `openItemEditor({ item, onSave, onDelete })`. Tocar na área do valor abre o editor com `focus: 'price'` (RF11).
  - A linha já reserva espaço para o checkbox do CARD-011.
- **Adição rápida:** campo "Adicionar item" + botão no rodapé da lista. Cria `createItem({ name }, nextOrder(items))` com quantidade 1, `un`, sem valor e `checked: false`, e limpa o campo mantendo o foco, para adicionar vários em sequência.
- **Adição completa:** o botão "+" abre `openItemEditor({ title: 'Novo item' })`.
- **Ponto de extensão para o RF14:** toda adição (rápida ou completa) passa por uma função única `addItem(list, data)`, que depois chama `onItemAdded(list, item)`. O comportamento entra no CARD-012.
- **Salvar:** atualização otimista da UI, seguida de `putList(list)`. Em caso de falha, `showToast({ message: 'Não foi possível salvar.', actions: [{ label: 'Tentar de novo', ... }] })` (estado de erro da T03).
- **Estados:**
  - **Vazio:** "Lista vazia. Adicione o primeiro item."
  - **Não encontrada:** mensagem com link para Listas.

## Critérios de aceite
- [ ] Adicionar, editar e remover itens atualiza a tela e persiste após recarregar (RF07).
- [ ] A adição rápida cria o item com quantidade 1 e unidade `un`, sem valor, e mantém o foco no campo.
- [ ] Informar ou editar o valor salva `priceCents` e passa a mostrar o subtotal = quantidade × valor (RF11, RF12).
- [ ] Renomear e excluir funcionam pelo cabeçalho. Excluir pede confirmação (RF08).
- [ ] Editar itens da lista não altera o template de origem (RN08).
- [ ] Se `putList` falhar, aparece o aviso com "Tentar de novo", e tentar de novo salva o estado atual.
- [ ] Abrir `#/list/id-inexistente` mostra "Lista não encontrada", sem erro no console.

## Observações
- No fluxo F3, o item adicionado na hora "já é marcado". Aqui, a adição cria o item desmarcado, e o usuário marca com um toque no checkbox (CARD-011). Um atalho "adicionar já marcado" pode ser avaliado no uso real.
- Remover item é feito pelo editor, que atende ao "menu" da T03. Gesto de deslizar fica fora do MVP.
- Item com nome repetido é permitido (padrão da pergunta 4 do refinamento).

## Pendências
- [ ] [CARD-005 — Editor de item](../02-componentes/CARD-005-editor-de-item.md)
- [ ] [CARD-009 — Nova lista](../04-listas/CARD-009-nova-lista.md)

## Fora do escopo
- Checkbox, ordenação de marcados, resumo de totais e progresso (CARD-011).
- Sugestão de adicionar ao template (CARD-012).

## Referências
Refinamento: tela T03, fluxos F2 e F3, RF07, RF08, RF11 e RF12.

## Justificativa da complexidade
M: tela com CRUD de itens, dois modos de adição e tratamento de erro ao salvar.
