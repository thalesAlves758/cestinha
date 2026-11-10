---
id: CARD-021
titulo: Nome sugerido da lista com a data de hoje
contexto: listas
tipo: feature
camadas: [front]
complexidade: P
prioridade: mvp
incerteza: baixa
status: done
requisitos: [RN11, RF05, RF06]
depende_de: [CARD-009]
modelo_sugerido: haiku
---

# CARD-021 — Nome sugerido da lista com a data de hoje

## Contexto
Ao criar uma lista no painel "Nova lista" (T02), o campo de nome vem pré-preenchido. Hoje ele traz o nome do template selecionado ou "Nova lista". Na prática, as listas se diferenciam pelo dia da compra, então o usuário quer que a sugestão seja a data de hoje. A regra RN11 foi alterada na revisão de 10/11/2026 do refinamento.

## Objetivo
Pré-preencher o nome da lista nova com a data local do aparelho no formato DD/MM/AAAA (ex.: `10/11/2026`), igual para qualquer origem (template ou "Lista em branco").

## Detalhamento técnico
- **`src/calc.js`:** adicionar a função pura `formatShortDate(date)`, que devolve `'DD/MM/AAAA'`, usando a data **local**:
  ```js
  const shortDateFormat = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  /** new Date(2026, 2, 5) -> '05/03/2026' (local time zone). */
  export function formatShortDate(date) { return shortDateFormat.format(date); }
  ```
  Nunca derivar a data de `toISOString()`: ele usa UTC e daria o dia seguinte a partir das 21h no horário de Brasília.
- **`src/ui/newListSheet.js`:**
  - Remover a constante `DEFAULT_NAME` e a função `defaultName()`.
  - Dentro de `render(body, close)`, calcular a sugestão uma vez, ao abrir o painel: `const suggestedName = formatShortDate(new Date());` e fazer `nameInput.value = suggestedName`.
  - O listener `change` dos rádios continua atualizando `selected`, mas **não mexe mais no nome**. Como o nome sugerido não depende da origem, a variável `nameEdited` deixa de ser necessária: remova-a.
  - O listener `input` do campo continua limpando a mensagem de erro e o `aria-invalid`.
  - A validação de nome vazio ("Informe um nome.") e a criação (`listFromTemplate` / `createList` + `putList` + navegar para `#/list/:id`) não mudam.
  - **Não alterar** os textos "Nova lista" do título do painel, do botão "+" (`aria-label` em `src/views/lists.js`) nem do botão do estado vazio: são rótulos de ação, não o nome sugerido.
- Nenhum arquivo novo, então o `APP_SHELL` do `sw.js` não muda. Sem mudança no IndexedDB: a lista guarda `name` como qualquer outro texto.

## Critérios de aceite
- [x] Dado que hoje é 10/11/2026, quando o usuário toca em "+" com um template selecionado, então o campo "Nome da lista" vem com `10/11/2026` (RN11).
- [x] Ao selecionar "Lista em branco", o nome continua `10/11/2026`. Voltar para um template também não muda o nome.
- [x] Dado que o usuário editou o nome para "Feira", quando troca a origem no painel, então o nome continua "Feira".
- [x] Dia e mês de um dígito aparecem com zero à esquerda (ex.: `05/03/2026`).
- [x] A data é a do horário do aparelho: às 22h no horário de Brasília, a sugestão é o dia de hoje, não o de amanhã.
- [x] Apagar o nome e tocar em "Criar" mostra "Informe um nome." e não cria a lista (RN11).
- [x] A lista criada, de template ou em branco, aparece na tela inicial com o nome `10/11/2026` e com os itens esperados (RF05, RF06).
- [x] O título do painel e o botão "+" continuam dizendo "Nova lista".
- [x] Listas criadas antes desta mudança mantêm os nomes que tinham.

## Como testar
**Validação manual**
1. Abra o app pelo Live Server, com "Update on reload" marcado em DevTools › Application › Service Workers.
2. Na tela Listas, toque em "+" e confira o nome com a data de hoje com um template selecionado (critério 1).
3. Alterne entre templates e "Lista em branco" e confira que o nome não muda (critério 2).
4. Digite "Feira" no nome, troque a origem e confira que "Feira" permanece (critério 3).
5. No console do DevTools, rode `const { formatShortDate } = await import('./src/calc.js');` e depois:
   - `formatShortDate(new Date(2026, 2, 5))` → deve dar `'05/03/2026'` (critério 4);
   - `formatShortDate(new Date('2026-11-10T22:30:00-03:00'))` → deve dar `'10/11/2026'` com o aparelho no fuso de Brasília (critério 5). Para simular o fuso, use DevTools › Sensors › Location › Timezone ID `America/Sao_Paulo`.
6. Apague o nome e toque em "Criar": deve aparecer "Informe um nome." (critério 6).
7. Crie uma lista de template e outra em branco e confira o nome e os itens de cada uma na tela inicial (critério 7).
8. Confira o título do painel e o rótulo do botão "+" (critério 8) e os nomes das listas antigas (critério 9).

**Testes automatizados**
Nenhum: o projeto não usa testes automatizados (ver CLAUDE.md, "No unit tests").

## Observações
- Listas de templates diferentes criadas no mesmo dia ficam com o mesmo nome. Isso é aceito (risco 9 do refinamento): o usuário pode editar o nome na criação ou renomear depois.
- O card da tela inicial vai mostrar a data duas vezes (no nome e no canto). Isso é aceito por enquanto (pergunta 8 do refinamento).
- Se o painel ficar aberto na virada do dia, vale a data de quando ele foi aberto.

## Pendências
- [CARD-009 — Nova lista: a partir de template ou em branco](CARD-009-nova-lista.md) (concluído)

## Fora do escopo
- Esconder ou trocar a data exibida no card da tela inicial.
- Renomear listas já existentes.
- Ordenação das listas (CARD-022).

## Referências
Refinamento: RN11 (revisão 10/11/2026), critério de aceite "RN11 — Nome sugerido com a data", tela T02, fluxo F2 e seção 12 (ponto de atenção "Data do nome sugerido").

## Justificativa da complexidade e do modelo
- **P:** uma função pura nova e uma simplificação no painel existente, sem estado novo.
- **haiku:** mudança mecânica em dois arquivos, com incerteza baixa e decisões já fechadas.
