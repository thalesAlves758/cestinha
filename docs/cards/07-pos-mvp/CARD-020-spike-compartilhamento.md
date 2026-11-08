---
id: CARD-020
titulo: "Spike: compartilhamento e sincronização de listas"
contexto: pos-mvp
tipo: spike
camadas: [back, front, banco]
complexidade: M
prioridade: depois
incerteza: alta
status: todo
requisitos: [RF17]
depende_de: [CARD-002]
---

# CARD-020 — Spike: compartilhamento e sincronização de listas

## Contexto
Compartilhar uma lista com outra pessoa, editando em tempo real (RF17), muda a natureza do app. Hoje ele não tem servidor, login nem saída de dados do aparelho, e isso é não-objetivo do MVP. Antes de quebrar em cards de implementação, é preciso escolher a abordagem.

## Objetivo
Investigar as opções de back-end, autenticação e sincronização offline-first e produzir uma recomendação com a proposta de cards. Timebox: 1 dia.

## Detalhamento técnico
- **Opções a avaliar:**
  - Firebase (Firestore com persistência offline + Auth);
  - Supabase (Postgres + Realtime + Auth);
  - PocketBase auto-hospedado;
  - CRDT (Yjs ou Automerge) com servidor de sincronização simples.
- **Critérios de comparação:**
  - funcionamento offline e resolução de conflitos (dois celulares marcando itens sem sinal);
  - custo na escala de uso pessoal;
  - esforço de integração em JS vanilla, sem bundler;
  - impacto no tamanho do app e no cache do Service Worker;
  - privacidade e LGPD (RNF04 hoje garante que nenhum dado sai do aparelho);
  - migração dos dados locais (o modelo já usa UUID e datas ISO, o que facilita).
- **Entrega:**
  - `docs/spikes/compartilhamento.md` com a comparação, a recomendação e o modelo de dados ajustado (ex.: `ownerId`, `members`, controle de versão por item);
  - lista de cards propostos.
- Uma prova de conceito mínima é opcional, se o tempo permitir: duas abas sincronizando o `checked` de um item.

## Critérios de aceite
- [ ] O documento compara pelo menos 3 opções nos critérios acima.
- [ ] A recomendação explica a estratégia de conflito para edição offline simultânea.
- [ ] O documento explicita o impacto em RNF04 e nos não-objetivos (login, servidor) para decisão do usuário.
- [ ] Os cards de implementação propostos têm complexidade P ou M.

## Observações
- Nenhum código de produção sai deste card.

## Pendências
- [ ] Decisão do usuário de abrir mão do "sem servidor/sem login" para esta funcionalidade
- [ ] [CARD-002 — Camada de dados com IndexedDB](../01-fundacao/CARD-002-camada-de-dados-indexeddb.md)

## Referências
Refinamento: RF17, seção 2 (não-objetivos), RNF04, item 6 da seção 13 (futuro).

## Justificativa da complexidade
M com timebox de 1 dia. A incerteza é alta por definição.
