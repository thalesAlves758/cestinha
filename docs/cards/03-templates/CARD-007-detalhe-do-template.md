---
id: CARD-007
titulo: Detalhe do template — itens, renomear e excluir (T06)
contexto: templates
tipo: feature
camadas: [front, banco]
complexidade: M
prioridade: mvp
incerteza: baixa
status: done
requisitos: [RF02, RF03, RN11, RN13]
depende_de: [CARD-005, CARD-006]
---

# CARD-007 — Detalhe do template: itens, renomear e excluir (T06)

## Contexto
Templates são as "listas padrão" do usuário, mantidas separadas das compras do dia. A partir deles, a lista do dia nasce pronta. Para isso, o template precisa ser fácil de manter: adicionar, ajustar e remover itens, renomear ou excluir.

## Objetivo
Implementar a tela `#/template/:id`, com:
- edição dos itens via editor de item;
- renomear o template;
- excluir o template com confirmação, sem afetar as listas já geradas.

Toda alteração é salva na hora.

## Detalhamento técnico
- **`src/views/template.js`:** `render(container, { id })`. Carrega com `getTemplate(id)`.
- **Cabeçalho:**
  - voltar (link `#/templates`);
  - nome do template (tocar abre `promptText` para renomear);
  - botão "⋮" que abre `openActionSheet` com "Renomear" e "Excluir template".
- **Itens:**
  - ordenados por `order`;
  - cada linha mostra o nome, `formatQuantity(quantity, unit)` e, se houver valor, `formatMoney(priceCents)` + "/un" ou "/kg";
  - tocar no item abre `openItemEditor({ item, title: 'Editar item', onSave, onDelete })`.
- **Adicionar:** o botão "+" abre `openItemEditor({ title: 'Novo item' })`. No `onSave`: `createItem(data, nextOrder(items))`, `push`, `putTemplate`.
- **Salvar:** toda alteração chama `putTemplate(template)` imediatamente (RF02) e re-renderiza.
- **Excluir template:** `confirmDialog({ title: 'Excluir template?', message: "O template 'X' será excluído. Listas já criadas a partir dele não serão afetadas." })`. Depois: `deleteTemplate(id)` e navegar para `#/templates` (RF03, RN13).
- **Estados:**
  - **Vazio:** "Adicione os itens que você compra sempre."
  - **Não encontrado** (id inválido ou excluído): mensagem com link para Templates.

## Critérios de aceite
- [x] Adicionar, editar e remover itens persiste na hora: recarregar a página mostra o estado atualizado (RF02).
- [x] Renomear com nome vazio é recusado (RN11). Renomear com nome válido atualiza o cabeçalho e a aba Templates.
- [x] Excluir pede confirmação. Ao confirmar, o template some da aba Templates (RF03).
- [x] Dado uma lista gerada a partir do template, quando o template é excluído, então a lista continua existindo com todos os itens (RN13).
- [x] Itens aparecem na ordem de inserção. Valor ausente não mostra "R$".
- [x] Abrir `#/template/id-inexistente` mostra "Template não encontrado", sem erro no console.
- [x] Alterar o template não altera listas já geradas a partir dele (RN08).

## Observações
- Item com nome repetido no mesmo template é permitido: é o padrão da pergunta 4 do refinamento.
- Templates não têm itens marcados nem totais.

## Pendências
- [ ] [CARD-005 — Editor de item](../02-componentes/CARD-005-editor-de-item.md)
- [ ] [CARD-006 — Aba Templates](../03-templates/CARD-006-aba-templates.md)

## Fora do escopo
Inclusão de itens no template via sugestão durante a compra (CARD-012).

## Referências
Refinamento: tela T06, fluxo F1, RF02, RF03, RN08, RN11 e RN13.

## Justificativa da complexidade
M: CRUD completo de itens, renomear e excluir, com estados de vazio e não encontrado.
