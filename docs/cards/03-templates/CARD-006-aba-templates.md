---
id: CARD-006
titulo: Aba Templates — listar e criar (T05)
contexto: templates
tipo: feature
camadas: [front, banco]
complexidade: P
prioridade: mvp
incerteza: baixa
status: todo
requisitos: [RF01, RF04, RN11]
depende_de: [CARD-002, CARD-004]
---

# CARD-006 — Aba Templates: listar e criar (T05)

## Contexto
Templates são as "listas padrão" do usuário, mantidas separadas das compras do dia. A partir deles, a lista do dia nasce pronta, sem os "itens fantasma" de compras anteriores. A aba Templates é onde eles ficam.

## Objetivo
Implementar a tela `#/templates`: listar os templates com nome e quantidade de itens e criar um template novo a partir do nome.

## Detalhamento técnico
- **`src/views/templates.js`:** `render(container)`.
  - Carrega `getAllTemplates()` (ordem `updatedAt` desc) e renderiza um card por template com o nome e a contagem de itens: "Nenhum item", "1 item" ou "N itens".
  - Tocar no card leva a `#/template/:id`.
  - O botão "+" (`renderFab`) chama `promptText({ title: 'Novo template', label: 'Nome' })`. Em seguida: `createTemplate(name)`, `putTemplate`, navegar para `#/template/:id` (F1, passo 3: adicionar itens).
- **Estados:**
  - **Vazio:** explicação curta, por exemplo "Templates são suas listas padrão: os itens de sempre, prontos para virar a lista do dia.", e o botão "Criar template".
  - **Carregando:** placeholder simples enquanto lê o IndexedDB.
  - **Erro:** "Não foi possível acessar o armazenamento do aparelho."
- Nomes renderizados via helper `html` (escapados).

## Critérios de aceite
- [ ] Dado que não há templates, quando abrir a aba, então aparece o estado vazio com o botão "Criar template".
- [ ] Dado o nome "Compra do mês", quando confirmar a criação, então o template é salvo vazio e o app abre o detalhe dele (RF01).
- [ ] Nome vazio não cria template (RN11).
- [ ] A aba lista todos os templates com nome e quantidade de itens, com o plural correto (RF04).
- [ ] Ao voltar do detalhe de um template editado, ele aparece no topo (ordem `updatedAt` desc).
- [ ] Nome com caracteres como `<b>` aparece como texto literal.

## Observações
Nomes de template repetidos são permitidos: o refinamento não proíbe.

## Pendências
- [ ] [CARD-002 — Camada de dados com IndexedDB](../01-fundacao/CARD-002-camada-de-dados-indexeddb.md)
- [ ] [CARD-004 — Componentes base](../02-componentes/CARD-004-paineis-dialogos-e-avisos.md)

## Fora do escopo
Editar itens, renomear e excluir o template (CARD-007).

## Referências
Refinamento: tela T05, fluxo F1, RF01, RF04 e RN11.

## Justificativa da complexidade
P: listagem simples com criação via componente pronto.
