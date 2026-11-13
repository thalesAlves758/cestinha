---
id: CARD-024
titulo: Exclusão imediata com "Desfazer"
contexto: exclusao
tipo: feature
camadas: [front, banco]
complexidade: M
prioridade: mvp
incerteza: baixa
status: todo
requisitos: [RF23, RN19, RF02, RF03, RF07, RF08]
depende_de: [CARD-004, CARD-005, CARD-007, CARD-008, CARD-010]
modelo_sugerido: sonnet
---

# CARD-024 — Exclusão imediata com "Desfazer"

## Contexto
Excluir no Cestinha é lento: abrir o menu ou o editor, achar o botão e, em listas e templates, ainda confirmar. A revisão de 12/11/2026 do refinamento trouxe duas mudanças: um gesto de arrastar para a esquerda como atalho de exclusão (RF22) e, para todas as exclusões, a troca da confirmação por um "Desfazer" no aviso (RF23, RN19). Este card faz a parte do "Desfazer", nos caminhos de exclusão que já existem; o gesto vem nos [CARD-025](CARD-025-arrastar-para-excluir-itens.md) e [CARD-026](CARD-026-arrastar-para-excluir-cards.md).

## Objetivo
Fazer toda exclusão existente (item pelo editor, lista pelo menu do card e pela tela da lista, template pela tela do template) ser imediata, sem confirmação, com o aviso "… excluído" e o botão "Desfazer" por 6 segundos, e deixar pronto o módulo que o gesto vai reutilizar.

## Detalhamento técnico
- **`src/db.js`:** `restoreList(record)` e `restoreTemplate(record)`: gravam o registro **como veio** (`store.put(record)` via `withStore`), sem passar pelo `put()` interno, que sobrescreve `updatedAt`. Sem mudança de schema.
- **`src/ui/toast.js`:** nada muda na API; `showToast({ message, actions: [{ label: 'Desfazer', onSelect }], timeout: 6000 })` já cobre o aviso. O botão do aviso usa `BTN_SECONDARY` (`min-h-11`, 44 px). O aviso vive em `document.body`, fora da view, então sobrevive à troca de tela.
- **`src/undo.js` (novo, entra no `APP_SHELL` do `sw.js`):**
  - `RESTORED_EVENT = 'cestinha:restored'`; `notifyRestored()` faz `window.dispatchEvent(new CustomEvent(RESTORED_EVENT))`; `onRestored(fn)` registra o listener e devolve a função que o remove.
  - `deleteListWithUndo(list)`: guarda `structuredClone(list)`, `await deleteList(list.id)` e mostra o aviso `Lista "${list.name}" excluída`. "Desfazer": `await restoreList(copy)` e `notifyRestored()`.
  - `deleteTemplateWithUndo(template)`: o mesmo, com `Template "${template.name}" excluído`, `deleteTemplate` e `restoreTemplate`. As listas que guardam o `templateId` voltam a apontar para ele, porque o `id` é o mesmo.
  - `offerItemUndo({ owner, ownerId, item })`, com `owner` sendo `'list'` ou `'template'`: chamado **depois** que a view já removeu o item e salvou. Guarda `structuredClone(item)` e mostra `"${item.name}" excluído`. "Desfazer":
    - carrega o dono atual (`getList`/`getTemplate`); se não existir mais, ou se já tiver um item com esse `id`, não faz nada;
    - caso contrário, faz `items.push(copy)` e grava com `putList`/`putTemplate`. Conta como alteração: `updatedAt` atualizado, como manda a RN19. A posição volta sozinha, porque as telas ordenam por `order` (`sortItemsForDisplay` na lista; `sort` por `order` no template). `checked`, quantidade, unidade e valor vêm na cópia;
    - depois chama `notifyRestored()`.
  - Falha ao excluir: as funções propagam o erro para a view tratar como hoje.
  - Falha ao desfazer: `showToast({ message: 'Não foi possível desfazer.' })`.
  - Os nomes vão no aviso via `textContent` (o `showToast` já faz isso), sem risco de injeção.
- **`src/views/lists.js`:** em `remove(list)`, remover o `confirmDialog` e chamar `deleteListWithUndo(list)` seguido de `load()`. Registrar `onRestored(load)` e remover o listener na cleanup.
- **`src/views/list.js`:**
  - `remove()`: sem confirmação; `await deleteListWithUndo(list)` e `location.hash = '#/lists'`. A tela inicial recarrega sozinha pelo `onRestored` se o usuário desfizer.
  - `onDelete` do editor: remover do array, `await save()` e depois `offerItemUndo({ owner: 'list', ownerId: list.id, item })`.
  - **Importante:** a view guarda `list` em memória e salva esse objeto a cada mudança. Registrar `onRestored(...)` para **recarregar `list` do banco** (`getList(id)`) e redesenhar; senão, a próxima marcação sobrescreveria o item restaurado. Remover o listener na cleanup.
- **`src/views/template.js`:** o mesmo padrão:
  - `remove()` → `deleteTemplateWithUndo(template)` e `location.hash = '#/templates'`;
  - `onDelete` → remover, `save()` e `offerItemUndo({ owner: 'template', ... })`;
  - `onRestored` recarrega `template` do banco.
- **`src/views/templates.js`:** registrar `onRestored` para recarregar a lista de templates, porque o desfazer pode acontecer com essa tela aberta. Extrair o carregamento atual numa função `load()`.
- **`src/ui/itemEditor.js`:** "Excluir" continua fechando o painel. Conferir que o aviso aparece depois do fechamento e que não sobra nenhuma confirmação.
- Retirar os imports de `confirmDialog` que ficarem sem uso. O `src/ui/confirm.js` continua sendo usado pela importação do backup.
- Sem testes automatizados (CLAUDE.md).

## Critérios de aceite
- [ ] Dado a lista "10/11/2026" na tela inicial, quando escolho ⋮ › Excluir, então ela some na hora, sem confirmação, e aparece "Lista \"10/11/2026\" excluída" com "Desfazer" (RF23).
- [ ] Tocando em "Desfazer" em até 6 segundos, o card volta na mesma posição da ordenação (inclusive em "Alteradas por último"), com todos os itens, marcações e valores.
- [ ] Sem tocar em "Desfazer", o aviso some depois de cerca de 6 segundos e a lista continua excluída depois de reabrir o app.
- [ ] Dentro de uma lista, ⋮ › Excluir volta para a tela inicial com o mesmo aviso; "Desfazer" faz o card reaparecer lá, e o app continua na tela inicial.
- [ ] Dentro de um template, ⋮ › Excluir template volta para Templates com "Template \"Compra do mês\" excluído"; "Desfazer" o traz de volta, e as listas geradas dele continuam ligadas a ele.
- [ ] Excluir "Feijão" (marcado) pelo editor de item fecha o painel e mostra "\"Feijão\" excluído"; "Desfazer" o devolve na mesma posição, marcado, com quantidade e valor, e os totais e o progresso voltam a contá-lo.
- [ ] Se eu excluir "Feijão", marcar "Arroz" e depois tocar em "Desfazer", "Feijão" volta e "Arroz" continua marcado.
- [ ] O mesmo vale para itens do template.
- [ ] Excluir outra coisa antes de desfazer troca o aviso, e a primeira exclusão fica definitiva.
- [ ] Excluo um item, vou para outra tela antes de o aviso sumir e toco em "Desfazer": o item volta, e ao abrir a lista ele está lá.
- [ ] Nenhuma exclusão de item, lista ou template pede confirmação. A importação do backup continua pedindo.
- [ ] O botão "Desfazer" tem no mínimo 44 px, e o aviso funciona nos temas claro e escuro.

## Como testar
**Validação manual (usuário)**
1. Na tela inicial, ordene por "Alteradas por último", exclua uma lista do meio pelo ⋮ e toque em "Desfazer" → ela volta no mesmo lugar (critérios 1 e 2).
2. Exclua uma lista e espere o aviso sumir; feche e reabra o app (critério 3).
3. Abra uma lista e exclua pelo menu dela; toque em "Desfazer" na tela inicial (critério 4).
4. Abra um template usado por alguma lista, exclua pelo menu e desfaça; gere uma lista nova dele para conferir que existe (critério 5).
5. Numa lista, marque "Feijão", abra o editor e toque em "Excluir"; toque em "Desfazer" e confira posição, marcação e totais (critério 6).
6. Exclua um item, marque outro e desfaça (critério 7).
7. Repita os passos 5 e 6 num template (critério 8).
8. Exclua um item e logo depois outro; tente desfazer o primeiro (critério 9).
9. Exclua um item, toque em "Voltar" e, ainda com o aviso, toque em "Desfazer"; reabra a lista (critério 10).
10. Repasse todas as exclusões conferindo que nenhuma pede confirmação; abra "Importar dados" com um backup para ver que a confirmação continua lá (critério 11).
11. Confira o tamanho do botão e troque o tema (critério 12).

**Testes automatizados (quem implementa)**
Nenhum: o projeto não usa testes automatizados (CLAUDE.md). Conferir pelo raciocínio o caso do critério 7: a view recarrega do banco depois do desfazer, então a marcação de "Arroz", que já tinha sido salva, permanece.

## Observações
- Decisões do refinamento (RN19): gravar na hora, e não esconder até o aviso sumir; só a última exclusão pode ser desfeita; um item restaurado conta como alteração; lista e template voltam com as datas originais; excluir de dentro da tela volta para a tela anterior, e desfazer não a reabre.
- Este card substitui a premissa antiga "Excluir item pelo editor não pede confirmação" (agora há "Desfazer").

## Pendências
- [CARD-004 — Painéis, diálogos e avisos](../02-componentes/CARD-004-paineis-dialogos-e-avisos.md)
- [CARD-005 — Editor de item](../02-componentes/CARD-005-editor-de-item.md)
- [CARD-007 — Detalhe do template](../03-templates/CARD-007-detalhe-do-template.md)
- [CARD-008 — Tela inicial](../04-listas/CARD-008-tela-inicial-listas.md)
- [CARD-010 — Detalhe da lista](../04-listas/CARD-010-detalhe-da-lista.md)

## Fora do escopo
- O gesto de arrastar (CARD-025 e CARD-026).
- Desfazer várias exclusões, lixeira, arrastar para a direita para marcar (não-objetivos ou "Depois").
- Mudar a confirmação da importação do backup.
- Aumentar o `APP_VERSION` (fica para o deploy).

## Referências
Refinamento: RF23 (critérios "Desfazer exclusão"), RN19, RF02, RF03, RF07, RF08, fluxo F7 (passo 4), telas T01, T03, T04 e T06, seção 12 ("Desfazer (RF23)"), risco 17.

## Justificativa da complexidade
M: mexe nas exclusões de quatro telas e no editor, com um módulo novo, gravação "como veio" no banco e recarga das views ao desfazer.
