---
id: CARD-026
titulo: Arrastar para excluir — cards de lista e de template
contexto: exclusao
tipo: feature
camadas: [front]
complexidade: P
prioridade: mvp
incerteza: baixa
status: descartado
requisitos: [RF22, RF03, RF08]
depende_de: [CARD-025]
modelo_sugerido: sonnet
---

# CARD-026 — Arrastar para excluir: cards de lista e de template

> **Descartado em 13/11/2026.** A funcionalidade "excluir arrastando com Desfazer" (RF22, RF23, RN19) foi descontinuada depois de não funcionar no teste no celular. O CARD-024 chegou a ser implementado e publicado na versão 0.4.0 e foi revertido (o app voltou à 0.3.0). Este card fica só como registro e não deve ser implementado.

## Contexto
Excluir no Cestinha é lento: abrir o menu ou o editor, achar o botão. A revisão de 12/11/2026 do refinamento trouxe um gesto de arrastar para a esquerda como **atalho** de exclusão (RF22), além do menu e do editor, que continuam. Toda exclusão já é imediata, com "Desfazer" ([CARD-024](CARD-024-exclusao-com-desfazer.md)), e o componente do gesto já existe nos itens ([CARD-025](CARD-025-arrastar-para-excluir-itens.md)).

## Objetivo
Aplicar o mesmo gesto aos cards de lista na tela inicial (T01) e aos cards de template na aba Templates (T05).

## Detalhamento técnico
- **`src/views/lists.js`:**
  - `renderCard` segue o contrato de marcação do CARD-025: `<li data-swipe="${list.id}" class="relative overflow-hidden rounded-lg">`, com o card atual (o link e o botão ⋮) dentro de `[data-swipe-content]` com `touch-pan-y`;
  - no `draw()`, `enableSwipeToDelete(ul, { onDelete })` e guardar a cleanup, chamada no próximo `draw()` e na cleanup da view;
  - `onDelete(id)`: achar a lista em `lists`, `await deleteListWithUndo(list)` e `load()`. É o mesmo caminho do ⋮ › Excluir;
  - o seletor de ordenação não muda.
- **`src/views/templates.js`:**
  - o mesmo contrato em `renderCard`; `onDelete(id)` → `await deleteTemplateWithUndo(template)` e recarregar;
  - essa tela hoje não tem exclusão, então este é o primeiro caminho de exclusão nela; a confirmação some, como em todo o app (RN19).
- **Clique depois do arraste:** já suprimido pelo componente, então o link do card não abre depois de arrastar.
- **Tratamento de erro:** se a exclusão falhar, mostrar `showToast({ message: 'Não foi possível excluir.' })` e recarregar, como o `remove` atual de `lists.js`.
- Se surgir classe nova, regerar o `styles/output.css` com `--minify`.
- Sem testes automatizados (CLAUDE.md).

## Critérios de aceite
- [ ] Na tela inicial, arrastar um card de lista para a esquerda mostra o fundo vermelho "Excluir" e, depois de 40%, "Solte para excluir" (com vibração no Android) (RF22).
- [ ] Soltando depois do ponto, o card sai, os de baixo sobem e aparece "Lista \"10/11/2026\" excluída" com "Desfazer"; desfazer traz o card de volta na mesma posição da ordenação.
- [ ] Soltando antes do ponto, o card volta ao lugar e a lista não abre.
- [ ] Na aba Templates, o mesmo gesto exclui o template com "Template \"Compra do mês\" excluído" e "Desfazer"; as listas geradas dele não são afetadas (RF03).
- [ ] Tocar no card continua abrindo a lista ou o template, e o ⋮ do card de lista continua abrindo o menu.
- [ ] Rolar a tela inicial ou a aba Templates na vertical não arrasta cards.
- [ ] Funciona no Android e no iPhone, nos temas claro e escuro.

## Como testar
**Validação manual (usuário)**
1. Com 3 ou mais listas, arraste uma do meio devagar para a esquerda (critério 1).
2. Solte depois do ponto e toque em "Desfazer" (critério 2).
3. Arraste um pouco e solte antes do ponto (critério 3).
4. Na aba Templates, exclua um template arrastando; abra uma lista gerada dele; desfaça (critério 4).
5. Toque num card e no ⋮ sem arrastar (critério 5).
6. Role as duas telas com muitos cards (critério 6).
7. Repita no Android e no iPhone, nos dois temas (critério 7).

**Testes automatizados (quem implementa)**
Nenhum: o projeto não usa testes automatizados (CLAUDE.md).

## Observações
- A aba Templates não tem menu por card; o caminho visível para excluir um template continua sendo o menu dentro dele (T06).

## Pendências
- [CARD-025 — Arrastar para excluir: componente e itens](CARD-025-arrastar-para-excluir-itens.md)

## Fora do escopo
- Menu ⋮ nos cards de template.
- Arrastar para revelar um botão, arrastar para a direita, desfazer várias exclusões.
- Aumentar o `APP_VERSION` (fica para o deploy).

## Referências
Refinamento: RF22, RF03, RF08, RN19, fluxo F7, telas T01 e T05, risco 15.

## Justificativa da complexidade
P: reaproveita o componente e as funções de exclusão prontas; só muda a marcação de dois cards.
