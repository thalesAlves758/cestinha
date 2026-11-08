---
id: CARD-005
titulo: Editor de item (T04)
contexto: componentes
tipo: feature
camadas: [front]
complexidade: M
prioridade: mvp
incerteza: baixa
status: todo
requisitos: [RF02, RF07, RF11, RF12, RN01, RN02, RN03, RN04, RNF06]
depende_de: [CARD-003, CARD-004]
---

# CARD-005 — Editor de item (T04)

## Contexto
Itens de template e de lista têm o mesmo formato:
- nome;
- quantidade (aceita decimais);
- unidade (`un` ou `kg`);
- valor opcional, por unidade ou por kg.

Eles são criados e editados num painel inferior, inclusive no mercado, digitando com o polegar.

## Objetivo
Criar o editor de item reutilizável. Ele valida os campos, mostra o subtotal ao vivo e devolve os dados limpos para quem chamou (tela de lista ou de template), sem acessar o banco.

## Detalhamento técnico
- **`src/ui/itemEditor.js`:**
  ```js
  export function openItemEditor({
    item = null,            // null = novo item
    title,                  // 'Novo item' | 'Editar item'
    focus = 'name',         // 'name' | 'price' (atalho para informar valor no mercado)
    onSave,                 // (data: { name, quantity, unit, priceCents }) => void | Promise
    onDelete,               // opcional; só exibe "Excluir" se informado
  })
  ```
- Construído sobre `openSheet` (CARD-004), com `<form novalidate>`. Enter no último campo envia o formulário.
- **Campos:**
  - **Nome:** `type="text"`, `autocapitalize="sentences"`, obrigatório.
  - **Quantidade:** `inputmode="decimal"`, padrão `1`, até 3 casas (RN02).
  - **Unidade:** grupo de rádio segmentado `un` / `kg`, padrão `un` (RN01).
  - **Valor:** `inputmode="decimal"` com prefixo `R$`. O rótulo muda entre "Valor por un" e "Valor por kg", é opcional e aceita até 2 casas (RN03).
  - **Subtotal ao vivo:** "Subtotal: R$ 11,97" quando quantidade e valor são válidos, usando `itemSubtotalCents` e `formatMoney`.
- Parsing via `parseDecimal` e `parsePriceToCents` (CARD-003). Edição preenche o valor com `centsToInput`.
- **Mensagens por campo** (`aria-invalid` + `aria-describedby`):
  - nome vazio: "Informe o nome";
  - quantidade vazia, ≤ 0 ou inválida: "Informe uma quantidade maior que zero";
  - mais de 3 casas: "Use até 3 casas decimais";
  - valor inválido: "Valor inválido";
  - mais de 2 casas no valor: "Use até 2 casas decimais".
- Devolve `{ name: name.trim(), quantity, unit, priceCents }`. Quem chama define `id`, `order` e `checked` e persiste.

## Critérios de aceite
- [ ] Novo item abre com quantidade `1`, unidade `un` e valor vazio, com o foco no nome.
- [ ] Com `focus: 'price'`, o foco vai direto para o campo de valor.
- [ ] Nome vazio ou quantidade ≤ 0 bloqueiam o salvar, com mensagem no próprio campo (estado de validação da T04).
- [ ] Ao trocar a unidade para `kg`, o rótulo do valor muda para "Valor por kg".
- [ ] Dado quantidade `0,3`, unidade `kg` e valor `39,90`, o subtotal exibido é `R$ 11,97`. Com `1,5` × `40` é `R$ 60,00` (RN04).
- [ ] Valor vazio é aceito: salva `priceCents: null` e não mostra subtotal.
- [ ] Quantidade e valor aceitam vírgula ou ponto, e o teclado aberto é o numérico decimal (RNF06).
- [ ] "Excluir" só aparece ao editar item existente com `onDelete` informado.
- [ ] Editar um item existente preenche todos os campos com os valores atuais (valor como `12,90`).

## Observações
- O editor não conhece templates nem listas, só dados de item. Isso garante o reuso na T03 e na T06.
- Excluir pelo editor não pede confirmação: a ação já é explícita e fica dentro de um painel.

## Pendências
- [ ] [CARD-003 — Cálculos, formatação e entrada numérica pt-BR](../01-fundacao/CARD-003-calculos-e-formatacao.md)
- [ ] [CARD-004 — Componentes base](../02-componentes/CARD-004-paineis-dialogos-e-avisos.md)

## Fora do escopo
- Campo de adição rápida na lista (CARD-010).
- Sugestão de adicionar ao template (CARD-012).

## Como testar
Pelo console:
```js
(await import('./src/ui/itemEditor.js')).openItemEditor({ title: 'Novo item', onSave: console.log })
```
Testar as validações e os exemplos dos critérios no modo dispositivo.

## Referências
Refinamento: tela T04, RN01 a RN04, RF11 e RF12, RNF06.

## Justificativa da complexidade
M: formulário com validação, parsing pt-BR e cálculo ao vivo.
