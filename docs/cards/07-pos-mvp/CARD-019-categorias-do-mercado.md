---
id: CARD-019
titulo: Categorias/setores do mercado na lista
contexto: pos-mvp
tipo: feature
camadas: [front, banco]
complexidade: M
prioridade: depois
incerteza: media
status: todo
requisitos: [RF18]
depende_de: [CARD-011]
---

# CARD-019 — Categorias/setores do mercado na lista

## Contexto
No MVP, a lista segue a ordem de inserção. Organizar os itens por setor do mercado (hortifruti, açougue, limpeza…) reduz idas e voltas entre corredores e deixa a compra mais rápida.

## Objetivo
Permitir atribuir uma categoria a cada item e agrupar os itens da lista por categoria.

## Detalhamento técnico
- **Modelo:**
  - campo opcional `category` (código em inglês, ex.: `produce`, `meat`, `bakery`, `dairy`, `pantry`, `cleaning`, `hygiene`, `drinks`, `frozen`, `other`) nos itens de template e de lista;
  - rótulos pt-BR mapeados em `src/categories.js`.
- **Banco:** o campo é opcional e embutido, então não exige índice. Subir `DB_VERSION` para 2 só se for preciso migrar dados (ex.: definir `other` nos itens existentes). Senão, tratar `undefined` como "Outros".
- **Cópias:** `listFromTemplate` passa a copiar `category`.
- **Editor de item:** seletor de categoria.
- **Tela da lista:**
  - itens agrupados por categoria, na ordem fixa dos setores, com cabeçalho por grupo;
  - dentro do grupo, valem as regras atuais (desmarcados por `order`, marcados no fim, RN14).

## Critérios de aceite
- [ ] Itens com categoria aparecem agrupados sob o cabeçalho do setor, e itens sem categoria ficam em "Outros" (RF18).
- [ ] A lista gerada de template herda as categorias dos itens.
- [ ] Marcar um item mantém o agrupamento, e os totais e o progresso não mudam.
- [ ] Os dados antigos, sem categoria, continuam funcionando sem erro.

## Pendências
- [ ] Decidir: categorias **fixas** (lista acima) ou **personalizáveis/reordenáveis** pelo usuário. Personalizáveis provavelmente exigem quebrar em mais cards.
- [ ] Decidir: marcados descem para o fim **do grupo** ou **da lista inteira**.
- [ ] [CARD-011 — Modo compra](../04-listas/CARD-011-modo-compra.md)

## Referências
Refinamento: RF18, escopo "Depois".

## Justificativa da complexidade
M, considerando categorias fixas. Com categorias personalizáveis vira G e precisa ser quebrado.
