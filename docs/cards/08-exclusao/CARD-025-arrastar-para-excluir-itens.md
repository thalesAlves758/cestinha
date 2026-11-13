---
id: CARD-025
titulo: Arrastar para excluir — componente e itens da lista e do template
contexto: exclusao
tipo: feature
camadas: [front]
complexidade: M
prioridade: mvp
incerteza: alta
status: descartado
requisitos: [RF22, RNF06, RNF08]
depende_de: [CARD-024]
modelo_sugerido: opus
---

# CARD-025 — Arrastar para excluir: componente e itens da lista e do template

> **Descartado em 13/11/2026.** A funcionalidade "excluir arrastando com Desfazer" (RF22, RF23, RN19) foi descontinuada depois de não funcionar no teste no celular. O CARD-024 chegou a ser implementado e publicado na versão 0.4.0 e foi revertido (o app voltou à 0.3.0). Este card fica só como registro e não deve ser implementado.

## Contexto
Excluir no Cestinha é lento: abrir o editor, achar o botão. A revisão de 12/11/2026 do refinamento trouxe um gesto de arrastar para a esquerda como **atalho** de exclusão (RF22), além do menu e do editor, que continuam. Toda exclusão já é imediata e tem "Desfazer" no aviso ([CARD-024](CARD-024-exclusao-com-desfazer.md)). Este card cria o componente do gesto e o aplica aos itens. Os cards de lista e de template vêm no [CARD-026](CARD-026-arrastar-para-excluir-cards.md).

## Objetivo
Criar um componente reutilizável de "arrastar para a esquerda e soltar para excluir" e aplicá-lo aos itens da lista (T03) e do template (T06), excluindo com o mesmo "Desfazer" do CARD-024.

## Detalhamento técnico
- **`src/ui/swipeToDelete.js` (novo, entra no `APP_SHELL` do `sw.js`):** `enableSwipeToDelete(root, { onDelete })` → devolve a função de cleanup.
  - **Delegação:** os listeners ficam no `root`, que é o contêiner que a view redesenha com `innerHTML`, e valem para os elementos com `[data-swipe="<id>"]`.
  - **Contrato de marcação:** cada elemento arrastável é um `<li data-swipe="${id}" class="relative overflow-hidden rounded-lg">` que contém um `<div data-swipe-content class="… bg-surface …">` com o conteúdo atual. O componente move só o `[data-swipe-content]` e insere, atrás dele, o fundo `aria-hidden`.
  - **Pointer Events:** usar `pointerdown`, `pointermove`, `pointerup` e `pointercancel`, só com o ponteiro primário. Aplicar `touch-action: pan-y` ao `[data-swipe-content]` (classe Tailwind `touch-pan-y`) para o navegador continuar rolando na vertical.
  - **Decisão do gesto:** só entra em modo arraste depois de `|dx| > 10 px` e `|dx| > |dy|`, com `dx < 0`. Se o movimento for vertical primeiro, abandona e deixa a rolagem acontecer. Ao entrar em modo arraste, chamar `setPointerCapture`.
  - **Um elemento por vez:** ignorar um novo `pointerdown` enquanto outro elemento estiver sendo arrastado ou animando.
  - **Durante o arraste:** `transform: translateX(dx)`, limitado a `≤ 0`, porque arrastar para a direita não faz nada. O fundo mostra "Excluir 🗑" alinhado à direita.
  - **Ponto de exclusão:** `|dx| ≥ 40%` da largura do elemento. Ao cruzá-lo, o texto vira "Solte para excluir" e vibra uma vez (`navigator.vibrate?.(10)`, em `try`; o iPhone não tem). Se o dedo voltar para antes do ponto, o texto volta a "Excluir".
  - **Ao soltar depois do ponto:** animar a saída (`translateX(-100%)`, cerca de 200 ms) e o recolhimento da altura (fixar `height` atual, depois `height: 0` e `margin` 0, cerca de 200 ms). Em seguida, chamar `onDelete(id)`.
  - **Ao soltar antes do ponto, ou no `pointercancel`:** animar de volta a `translateX(0)` e não chamar nada.
  - **Movimento reduzido:** com `matchMedia('(prefers-reduced-motion: reduce)')`, sem animações; a exclusão é direta.
  - **Clique depois do arraste:** se houve arraste, suprimir o `click` seguinte com um listener em fase de captura no `root` (`preventDefault` e `stopPropagation`, uma vez). Assim, não abre o editor, não muda o checkbox e não segue o link.
  - **Classes:** sempre strings completas (scanner do Tailwind), nunca montadas dinamicamente.
- **Tokens de cor (`styles/input.css`):** o fundo usa `bg-danger`, que já é utilitário porque `--color-danger` existe. Para o texto sobre ele, criar `--on-danger` e `--color-on-danger` (utilitário `text-on-danger`) com contraste AA:
  - claro: `--danger: #B3261E` com texto `#FFFFFF`;
  - escuro: `--danger: #F2B8B5` com texto escuro, por exemplo `#601410`.
  Conferir o contraste e regerar o `styles/output.css` com `--minify`.
- **`src/views/list.js`:**
  - `renderItem` segue o contrato de marcação: o `<li>` atual vira o `[data-swipe-content]` dentro do novo `<li data-swipe>`, mantendo o visual e os `data-check`, `data-item` e `data-price`;
  - no `draw()`, chamar `enableSwipeToDelete` no `<ul>` dos itens e guardar a cleanup;
  - `onDelete(id)`: remover o item de `list.items`, `await save()` e `offerItemUndo({ owner: 'list', ownerId: list.id, item })` do CARD-024. Itens marcados também podem ser excluídos.
- **`src/views/template.js`:** o mesmo para os itens do template (`owner: 'template'`).
- O botão e o editor continuam como caminho visível de exclusão (RNF08). Não mudar a navegação por teclado nem os rótulos de acessibilidade existentes.
- Sem testes automatizados (CLAUDE.md).

## Critérios de aceite
- [ ] Dado uma lista com "Arroz", "Feijão" e "Café", quando arrasto "Feijão" para a esquerda, então surge atrás dele um fundo vermelho com "Excluir" (RF22).
- [ ] Ao passar de cerca de 40% da largura, o texto muda para "Solte para excluir" e, no Android, o celular vibra de leve.
- [ ] Soltando depois desse ponto, "Feijão" sai pela esquerda, "Café" sobe para o lugar dele e aparece "\"Feijão\" excluído" com "Desfazer". O "Desfazer" funciona como no CARD-024.
- [ ] Soltando antes do ponto, o item volta ao lugar, nada é excluído e o editor não abre.
- [ ] Arrastar para a direita não faz nada.
- [ ] Rolar a lista na vertical, inclusive com um pouco de diagonal, não arrasta nem exclui itens.
- [ ] Arrastar começando em cima da caixa de marcar ou do valor não muda a marcação nem abre o editor de valor.
- [ ] Itens marcados também podem ser excluídos arrastando.
- [ ] O mesmo gesto funciona nos itens do template.
- [ ] Funciona no Android (Chrome) e no iPhone (Safari e app instalado).
- [ ] Com "reduzir movimento" ativado no celular, a exclusão acontece sem animação.
- [ ] O fundo vermelho e o texto têm boa leitura nos temas claro e escuro.
- [ ] Tocar no item continua abrindo o editor, e excluir pelo editor continua funcionando.

## Como testar
**Validação manual (usuário)**
1. Abra uma lista com pelo menos três itens e arraste o do meio devagar para a esquerda (critérios 1 e 2).
2. Solte depois do ponto; confira o aviso e toque em "Desfazer" (critério 3).
3. Arraste um pouco e solte antes do ponto (critério 4); arraste para a direita (critério 5).
4. Numa lista longa, role para cima e para baixo várias vezes, inclusive meio na diagonal (critério 6).
5. Comece o arraste em cima da caixa de marcar e em cima do valor (critério 7).
6. Marque um item e exclua-o arrastando (critério 8).
7. Repita os passos 1 e 2 num template (critério 9).
8. Faça os passos 1 a 6 no Android e no iPhone, no Safari e no app instalado (critério 10).
9. Ative "reduzir movimento" (Android: Acessibilidade › Remover animações; iPhone: Acessibilidade › Movimento › Reduzir Movimento) e exclua um item (critério 11).
10. Troque entre os temas claro e escuro arrastando um item até a metade (critério 12).
11. Toque num item sem arrastar e exclua pelo editor (critério 13).

**Testes automatizados (quem implementa)**
Nenhum: o projeto não usa testes automatizados (CLAUDE.md).

## Observações
- Começar o arraste na borda direita da tela pode disparar o "voltar" do Android ou o "avançar" do Safari fora do app instalado; o app não consegue bloquear (risco 15 do refinamento). O gesto natural começa no meio do item.
- `opus` pela incerteza: diferenças de Pointer Events e rolagem entre Chrome Android e WebKit no iPhone, supressão do clique e animação de altura. Validar no aparelho após o deploy.
- Se `touch-action: pan-y` não for suficiente no iPhone para impedir a rolagem durante o arraste, registrar aqui a solução adotada.

## Pendências
- [CARD-024 — Exclusão imediata com "Desfazer"](CARD-024-exclusao-com-desfazer.md) (`offerItemUndo`)

## Fora do escopo
- Cards de lista (T01) e de template (T05): CARD-026.
- Arrastar para revelar um botão, arrastar para a direita para marcar, desfazer várias exclusões (não-objetivos ou "Depois").
- Mudar o editor de item ou o menu.
- Aumentar o `APP_VERSION` (fica para o deploy).

## Referências
Refinamento: RF22 (critérios "Excluir arrastando"), RN19, RNF06, RNF08, fluxo F7, tela T03 (wireframe do gesto) e T06, seção 12 ("Arrastar para excluir", "Vibração", "Animação", "Fundo vermelho"), riscos 15 e 16.

## Justificativa da complexidade
M: um componente de gesto com animação e dois pontos de uso. Incerteza alta pelo comportamento de toque em cada sistema.
