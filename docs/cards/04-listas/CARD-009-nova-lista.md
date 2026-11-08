---
id: CARD-009
titulo: Nova lista — a partir de template ou em branco (T02)
contexto: listas
tipo: feature
camadas: [front, banco]
complexidade: M
prioridade: mvp
incerteza: baixa
status: done
requisitos: [RF05, RF06, RN08, RN11]
depende_de: [CARD-007, CARD-008]
---

# CARD-009 — Nova lista: a partir de template ou em branco (T02)

## Contexto
O principal ganho do Cestinha é montar a lista do dia em 1 a 2 minutos a partir de um template confiável, em vez de duplicar uma lista antiga cheia de "itens fantasma". Também deve ser possível começar uma lista em branco.

## Objetivo
Implementar o painel "Nova lista", aberto pelo botão "+" da tela inicial. Nele o usuário escolhe um template ou "Lista em branco", confirma o nome e cria a lista.

## Detalhamento técnico
- **`src/ui/newListSheet.js`:** `openNewListSheet()`, construído sobre `openSheet`.
  - Carrega `getAllTemplates()`.
  - Grupo de rádio com cada template (nome + "N itens") e a opção "Lista em branco".
  - Seleção inicial: o primeiro template da lista (o editado mais recentemente). Sem templates, "Lista em branco".
  - O campo "Nome da lista" vem pré-preenchido com o nome do template ou "Nova lista" (RN11). Ao trocar a seleção, o nome só é atualizado se o usuário ainda não o editou.
  - Botão "Criar":
    - com template: `listFromTemplate(template, name)`;
    - em branco: `createList({ name })`.
    - Depois: `putList`, fechar o painel e navegar para `#/list/:id`.
  - **Sem templates:** só "Lista em branco", com o atalho "Criar um template", que fecha o painel e vai para `#/templates`.
- **`src/views/lists.js`:** trocar o stub do botão "+" (CARD-008) por `openNewListSheet()`. O botão "Nova lista" do estado vazio também chama essa função.

## Critérios de aceite
- [x] Dado o template "Compra do mês" com 20 itens, quando o usuário toca em "+", escolhe esse template e confirma o nome, então é criada uma lista com os 20 itens (nome, quantidade, unidade e valor, quando houver), todos desmarcados (RF05).
- [x] A nova lista aparece no topo da tela inicial.
- [x] Alterar a lista gerada não altera o template, e alterar o template depois não altera a lista (RN08).
- [x] "Lista em branco" cria uma lista vazia com `templateId: null` (RF06).
- [x] O nome vem pré-preenchido e é editável. Nome vazio bloqueia "Criar" (RN11).
- [x] Sem templates, o painel mostra só "Lista em branco" e o atalho para criar template.
- [x] A lista guarda o `templateId` de origem, usado pela sugestão do RF14 (CARD-012).

## Observações
- Após criar, o app abre direto a lista (fluxo F2, passo 4: ajustar a lista). Ao voltar, ela está no topo da tela inicial, como pede o RF05.
- Combinar vários templates numa lista é não-objetivo do MVP.

## Pendências
- [x] [CARD-007 — Detalhe do template](../03-templates/CARD-007-detalhe-do-template.md) (necessário para ter templates com itens)
- [x] [CARD-008 — Tela inicial: Listas](../04-listas/CARD-008-tela-inicial-listas.md)

## Fora do escopo
A tela da lista em si (CARD-010).

## Referências
Refinamento: tela T02, fluxo F2, critério de aceite do RF05, RF06, RN08 e RN11.

## Justificativa da complexidade
M: painel com estado (seleção, pré-preenchimento inteligente do nome) e cópia de template.
