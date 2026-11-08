---
id: CARD-012
titulo: Sugestão "adicionar ao template" (RF14)
contexto: pos-mvp
tipo: feature
camadas: [front, banco]
complexidade: P
prioridade: depois
incerteza: baixa
status: todo
requisitos: [RF14, RN08, RN10, RN13]
depende_de: [CARD-010]
---

# CARD-012 — Sugestão "adicionar ao template" (RF14)

## Contexto
Os templates devem se manter atualizados sem que o usuário precise editá-los à parte. Quando ele adiciona à lista do dia um item que não está no template de origem, o app oferece incluí-lo no template. Assim a base melhora a cada compra.

## Objetivo
Ao adicionar um item novo numa lista gerada de template, mostrar um aviso não bloqueante oferecendo incluir o item no template. Se o usuário aceitar, o item é gravado no template.

## Detalhamento técnico
- **`src/model.js`:** `templateHasItem(template, name)`. Compara com `normalizeName` (CARD-003), que ignora maiúsculas, acentos e espaços extras (RN10).
- **`src/views/list.js`:** implementar `onItemAdded(list, item)`, o ponto de extensão criado no CARD-010.
  1. Se `list.templateId` for `null`, não faz nada.
  2. Carrega `getTemplate(list.templateId)`. Se o template não existir mais, não faz nada (RN13).
  3. Se `templateHasItem(template, item.name)`, não faz nada.
  4. Caso contrário: `showToast({ message: "Adicionar 'Iogurte' ao template Compra do mês?", actions: [{ label: 'Adicionar' }, { label: 'Agora não' }] })`.
  5. Em "Adicionar":
     - recarrega o template (pode ter mudado);
     - confere de novo `templateHasItem`;
     - insere `createItem({ name, quantity, unit }, nextOrder(template.items))`, **sem `priceCents`**;
     - chama `putTemplate`;
     - mostra o aviso curto "Adicionado ao template".
- Nomes no aviso via texto escapado.

## Critérios de aceite
- [ ] Dado uma lista gerada do template "Compra do mês", quando o usuário adiciona "Iogurte" (que não existe no template), então aparece "Adicionar 'Iogurte' ao template Compra do mês?" sem bloquear a tela (RF14).
- [ ] Aceitando, o template passa a ter "Iogurte" com o mesmo nome, quantidade e unidade, sem valor.
- [ ] Ignorando (timeout) ou tocando em "Agora não", o template não muda.
- [ ] Adicionar "iogurte " ou "IOGURTE" quando o template já tem "Iogurte" não mostra sugestão (RN10).
- [ ] Em lista criada em branco não aparece sugestão.
- [ ] Em lista cujo template foi excluído não aparece sugestão, e nada quebra (RN13).
- [ ] Vale tanto para a adição rápida quanto para a adição pelo editor.
- [ ] Aceitar a sugestão não altera outras listas já geradas desse template (RN08).

## Observações
- Levar o valor para o template ficou como "não" (padrão da pergunta 5 do refinamento). Rever junto com o preço sugerido (CARD-018).
- Se o usuário adicionar dois itens novos em seguida, o segundo aviso substitui o primeiro (só um aviso por vez, CARD-004). Aceito no MVP.
- A comparação por nome pode errar em casos como "Arroz 5kg" × "Arroz" (risco 3). O usuário sempre pode recusar.
- Editar o nome de um item existente não dispara sugestão, só a adição dispara.

## Pendências
- [ ] [CARD-010 — Detalhe da lista](../04-listas/CARD-010-detalhe-da-lista.md)

## Referências
Refinamento: critério de aceite do RF14, RN08, RN10 e RN13, fluxo F3, tela T03, riscos 3 e pergunta 5 da seção 13.

## Justificativa da complexidade
P: lógica curta sobre peças prontas (aviso, normalização, ponto de extensão).
