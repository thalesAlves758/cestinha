---
id: CARD-003
titulo: Cálculos, formatação e entrada numérica pt-BR
contexto: fundacao
tipo: feature
camadas: [front]
complexidade: M
prioridade: mvp
incerteza: baixa
status: done
requisitos: [RF12, RF13, RN02, RN03, RN04, RN05, RN06, RN07, RN10, RN15]
depende_de: [CARD-001]
---

# CARD-003 — Cálculos, formatação e entrada numérica pt-BR

## Contexto
No mercado, o usuário acompanha:
- o subtotal de cada item;
- o **total previsto** (todos os itens com valor);
- o **total no carrinho** (só os marcados);
- a barra de progresso.

Os valores são digitados com vírgula e exibidos no padrão brasileiro. Erros de centavos ou de parsing quebram a confiança no app.

## Objetivo
Criar `src/calc.js` com funções puras de cálculo, formatação, parsing e normalização de nomes, cobertas por uma página de testes que roda no navegador sem dependências.

## Detalhamento técnico
- **`src/calc.js`:**
  ```js
  export function itemSubtotalCents(item)        // null se priceCents == null; senão Math.round(quantity * priceCents)
  export function listTotals(items)               // { plannedCents, inCartCents }
  export function listProgress(items)             // { checked, total, percent }  — percent = 0 se total = 0
  export function formatMoney(cents)              // Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
  export function formatQuantity(quantity, unit)  // '1,5 kg', '2 un', '0,375 kg' (até 3 casas, sem zeros à direita)
  export function parseDecimal(text, { maxDecimals }) // { ok: true, value } | { ok: false, reason: 'empty'|'invalid'|'too_many_decimals' }
  export function parsePriceToCents(text)         // '' → { ok: true, value: null }; '12,9' → { ok: true, value: 1290 }
  export function centsToInput(cents)             // 1290 → '12,90' (para preencher campo); null → ''
  export function normalizeName(name)             // NFD + remove acentos + minúsculas + trim + colapsa espaços
  ```
  - `parseDecimal` aceita `,` **e** `.` como separador decimal (alguns teclados Android mostram ponto mesmo em pt-BR) e não aceita separador de milhar.
  - Recusa negativo e texto não numérico.
  - `percent` = `Math.round(checked / total * 100)`.
  - Instanciar os `Intl.NumberFormat` uma vez, em escopo de módulo.
- **Testes sem dependências** (não há Node nem Python na máquina):
  - `tests/calc.test.html` carrega `tests/calc.test.js` (módulo), que importa `../src/calc.js`.
  - Um mini-harness `test(name, fn)` / `assertEqual(a, b)` lista PASS/FAIL na página e no console.
  - Abrir pelo Live Server.

## Critérios de aceite
- [ ] Exemplo do RF13: Arroz (1 un × 2500, marcado), Carne (1,5 kg × 4000, não marcado) e Sabão (2 un, `priceCents: null`, marcado) dão `plannedCents = 8500`, `inCartCents = 2500` e progresso `{ checked: 2, total: 3, percent: 67 }`. Item sem valor fica fora dos totais e conta no progresso (RN04 a RN07).
- [ ] Exemplo do RF10: 10 itens com 3 marcados dão `percent = 30`. Lista vazia dá `percent = 0`.
- [ ] `itemSubtotalCents({ quantity: 0.3, priceCents: 3990 })` → `1197`. `({ quantity: 1.5, priceCents: 4000 })` → `6000` (arredondamento em centavos).
- [ ] `formatMoney(123456)` exibe `R$ 1.234,56` (RN15). O teste compara normalizando o espaço não separável que o `Intl` insere após `R$`.
- [ ] `formatQuantity(1.5, 'kg')` → `1,5 kg`. `formatQuantity(2, 'un')` → `2 un`.
- [ ] `parseDecimal`:
  - `'1,5'` e `'1.5'` → `1.5`;
  - `''` → `empty`;
  - `'abc'` e `'-1'` → `invalid`;
  - `'0,1234'` com `maxDecimals: 3` → `too_many_decimals` (RN02).
- [ ] `parsePriceToCents('12,9')` → `1290`, `('0')` → `0` e `('12,345')` → erro de casas decimais (RN03).
- [ ] `normalizeName('  Pão   de Açúcar ')` === `normalizeName('pao de acucar')` (RN10).
- [ ] Todos os testes da página passam.

## Observações
- A validação de "quantidade > 0" e as mensagens de erro ficam no editor de item (CARD-005). Aqui só se faz o parsing.
- Totais e progresso são sempre calculados, nunca armazenados.
- A ordenação de exibição (marcados no fim) é adicionada a este módulo no CARD-011.

## Pendências
- [ ] [CARD-001 — Setup do projeto e app shell](../01-fundacao/CARD-001-setup-projeto-app-shell.md)

## Como testar
Abrir `tests/calc.test.html` pelo Live Server e conferir que tudo está PASS.

## Referências
Refinamento: seção 5 (RN02 a RN07, RN10 e RN15), critérios de aceite do RF10 e do RF13, seção 12 (entrada numérica e arredondamento).

## Justificativa da complexidade
M: funções pequenas, mas com vários casos de borda (arredondamento, separadores, Intl) e harness de testes próprio.
