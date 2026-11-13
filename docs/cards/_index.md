# 🧺 Cestinha — Quadro de cards

> **Fonte:** [docs/refinamento.md](../refinamento.md), refinamento de 08/11/2026 (versão com RNF10, código em inglês), com as revisões de 10/11/2026 (nome sugerido com a data, ordenação das listas, descarte do RF14 e do RF19, backup manual no MVP) e a de 12/11/2026 (excluir arrastando com desfazer)
> **Gerado em:** 08/11/2026 · **Atualizado em:** 12/11/2026 (CARD-024 a CARD-026: excluir arrastando com desfazer) · **Total:** 26 cards (22 MVP + 2 depois + 2 descartados)

## Cards

| ID | Título | Contexto | Tipo | Compl. | Prioridade | Status | Depende de | Modelo |
|---|---|---|---|---|---|---|---|---|
| [CARD-001](01-fundacao/CARD-001-setup-projeto-app-shell.md) | Setup do projeto e app shell | fundacao | setup | M | mvp | done | — | — |
| [CARD-002](01-fundacao/CARD-002-camada-de-dados-indexeddb.md) | Camada de dados com IndexedDB | fundacao | dados | M | mvp | done | 001 | — |
| [CARD-003](01-fundacao/CARD-003-calculos-e-formatacao.md) | Cálculos, formatação e entrada numérica pt-BR | fundacao | feature | M | mvp | done | 001 | — |
| [CARD-004](02-componentes/CARD-004-paineis-dialogos-e-avisos.md) | Componentes base: painel, diálogos e avisos | componentes | feature | M | mvp | done | 001 | — |
| [CARD-005](02-componentes/CARD-005-editor-de-item.md) | Editor de item (T04) | componentes | feature | M | mvp | done | 003, 004 | — |
| [CARD-006](03-templates/CARD-006-aba-templates.md) | Aba Templates: listar e criar (T05) | templates | feature | P | mvp | done | 002, 004 | — |
| [CARD-007](03-templates/CARD-007-detalhe-do-template.md) | Detalhe do template (T06) | templates | feature | M | mvp | done | 005, 006 | — |
| [CARD-008](04-listas/CARD-008-tela-inicial-listas.md) | Tela inicial: Listas (T01) | listas | feature | M | mvp | done | 002, 003, 004 | — |
| [CARD-009](04-listas/CARD-009-nova-lista.md) | Nova lista: template ou em branco (T02) | listas | feature | M | mvp | done | 007, 008 | — |
| [CARD-010](04-listas/CARD-010-detalhe-da-lista.md) | Detalhe da lista: itens, renomear, excluir (T03.1) | listas | feature | M | mvp | done | 005, 009 | — |
| [CARD-011](04-listas/CARD-011-modo-compra.md) | Modo compra: marcar, progresso e totais (T03.2) | listas | feature | M | mvp | done | 003, 010 | — |
| [CARD-013](05-configuracoes/CARD-013-tema-e-configuracoes.md) | Tema claro/escuro e Configurações (T07) | configuracoes | feature | P | mvp | done | 001 | — |
| [CARD-014](06-pwa/CARD-014-manifest-e-icones.md) | Manifest e ícones | pwa | infra | P | mvp | done | 001 | — |
| [CARD-015](06-pwa/CARD-015-service-worker-offline.md) | Service Worker e funcionamento offline | pwa | infra | M | mvp | done | 004, 014 | — |
| [CARD-016](06-pwa/CARD-016-deploy-github-pages.md) | Deploy no GitHub Pages e validação no Android | pwa | infra | M | mvp | done | 007, 011, 013, 015 | — |
| [CARD-021](04-listas/CARD-021-nome-sugerido-com-data.md) | Nome sugerido da lista com a data de hoje | listas | feature | P | mvp | done | 009 | haiku |
| [CARD-022](04-listas/CARD-022-ordenacao-das-listas.md) | Ordenação das listas na tela inicial | listas | feature | M | mvp | done | 008 | sonnet |
| [CARD-017](05-configuracoes/CARD-017-exportar-backup.md) | Backup: exportar dados | configuracoes | feature | M | mvp | done | 002, 013, 022 | sonnet |
| [CARD-023](05-configuracoes/CARD-023-importar-backup.md) | Backup: importar dados | configuracoes | feature | M | mvp | done | 017 | sonnet |
| [CARD-024](08-exclusao/CARD-024-exclusao-com-desfazer.md) | Exclusão imediata com "Desfazer" | exclusao | feature | M | mvp | done | 004, 005, 007, 008, 010 | sonnet |
| [CARD-025](08-exclusao/CARD-025-arrastar-para-excluir-itens.md) | Arrastar para excluir: componente e itens | exclusao | feature | M | mvp | todo | 024 | opus |
| [CARD-026](08-exclusao/CARD-026-arrastar-para-excluir-cards.md) | Arrastar para excluir: cards de lista e de template | exclusao | feature | P | mvp | todo | 025 | sonnet |
| [CARD-018](07-pos-mvp/CARD-018-preco-sugerido.md) | ~~Preço sugerido com base na última compra~~ (descartado) | pos-mvp | feature | M | depois | descartado | 011 | — |
| [CARD-019](07-pos-mvp/CARD-019-categorias-do-mercado.md) | Categorias/setores do mercado | pos-mvp | feature | M | depois | todo | 011 | — |
| [CARD-020](07-pos-mvp/CARD-020-spike-compartilhamento.md) | Spike: compartilhamento e sincronização | pos-mvp | spike | M | depois | todo | 002 | — |
| [CARD-012](07-pos-mvp/CARD-012-sugestao-adicionar-ao-template.md) | ~~Sugestão "adicionar ao template" (RF14)~~ (descartado) | pos-mvp | feature | P | depois | descartado | 010 | — |

## Ordem sugerida de execução (ondas)

Os cards de uma mesma onda podem ser feitos em qualquer ordem, ou em paralelo.

| Onda | Cards | Marco |
|---|---|---|
| 1 | 001 | Projeto navegável com shell e tokens de tema |
| 2 | 002 · 003 · 004 · 013 · 014 | Dados, cálculos, componentes, tema e manifest |
| 3 | 005 · 006 · 008 | Editor de item, aba Templates, tela inicial |
| 4 | 007 | Templates completos (F1) |
| 5 | 009 | Gerar lista do dia (F2) |
| 6 | 010 | Ajustar a lista |
| 7 | 011 | Compra no mercado (F3) |
| 8 | 015 · 016 | Offline (015, antes do 016) e **MVP publicado e validado no Android** |
| 9 | 021 · 022 | Revisão de 10/11: nome sugerido com a data e ordenação das listas (independentes entre si); depois, deploy com `APP_VERSION` aumentado |
| 10 | 017 → 023 | Revisão de 10/11 (backup): exportar e depois importar; os dois vão no mesmo deploy, com `APP_VERSION` aumentado |
| 11 | 024 → 025 → 026 | Revisão de 12/11 (excluir arrastando): primeiro o "Desfazer" em todas as exclusões (o 024 já pode ir para o deploy sozinho), depois o gesto nos itens e nos cards; deploy com `APP_VERSION` aumentado |
| Pós-MVP | 019 · 020 | Conforme prioridade após o uso real (012 e 018 foram descartados) |

> **Nota (CARD-015 movido para a onda 8):** o CARD-015 saiu da onda 3 e deve ser feito imediatamente antes do CARD-016. A lista de arquivos do app shell que o Service Worker coloca em cache só fica estável quando todos os arquivos do app estão prontos; fazê-lo antes obrigaria a revisar a lista a cada card novo. As dependências (004, 014) já estão done.

## Grafo de dependências

```mermaid
flowchart TD
    C001[001 Setup + shell] --> C002[002 IndexedDB]
    C001 --> C003[003 Cálculos pt-BR]
    C001 --> C004[004 Componentes base]
    C001 --> C013[013 Tema + Config]
    C001 --> C014[014 Manifest + ícones]
    C003 --> C005[005 Editor de item]
    C004 --> C005
    C002 --> C006[006 Aba Templates]
    C004 --> C006
    C005 --> C007[007 Detalhe template]
    C006 --> C007
    C002 --> C008[008 Tela inicial]
    C003 --> C008
    C004 --> C008
    C007 --> C009[009 Nova lista]
    C008 --> C009
    C005 --> C010[010 Detalhe da lista]
    C009 --> C010
    C003 --> C011[011 Modo compra]
    C010 --> C011
    C004 --> C015[015 Service Worker]
    C014 --> C015
    C007 --> C016[016 Deploy + Android]
    C011 --> C016
    C013 --> C016
    C015 --> C016
    C009 --> C021[021 Nome com a data]
    C008 --> C022[022 Ordenação das listas]

    C002 --> C017[017 Exportar backup]
    C013 --> C017
    C022 --> C017
    C017 --> C023[023 Importar backup]
    C004 --> C024[024 Exclusão com desfazer]
    C005 --> C024
    C007 --> C024
    C008 --> C024
    C010 --> C024
    C024 --> C025[025 Arrastar: itens]
    C025 --> C026[026 Arrastar: cards]
    C011 -.-> C019[019 Categorias]
    C002 -.-> C020[020 Spike compartilhamento]

    classDef depois fill:#eee,stroke:#999,color:#555;
    class C019,C020 depois;
```

## Matriz de rastreabilidade

### Requisitos funcionais

| Requisito | Prioridade | Cards |
|---|---|---|
| RF01 Criar template | MVP | 006 |
| RF02 Editar template | MVP | 007, 005, 024 |
| RF03 Excluir template | MVP | 007, 024, 026 |
| RF04 Listar templates | MVP | 006 |
| RF05 Lista a partir de template | MVP | 009, 021 |
| RF06 Lista em branco | MVP | 009, 008, 021 |
| RF07 Editar itens da lista | MVP | 010, 005, 024 |
| RF08 Renomear/excluir lista | MVP | 008, 010, 024, 026 |
| RF09 Tela inicial | MVP | 008, 022 |
| RF10 Marcar item | MVP | 011 |
| RF11 Informar valor | MVP | 005, 010 |
| RF12 Subtotal | MVP | 003, 005, 010, 011 |
| RF13 Totais previsto/no carrinho | MVP | 003, 011 |
| RF14 Sugestão adicionar ao template | Descartado | 012 (descartado) |
| RF15 Tema | MVP | 013 |
| RF16 Instalável e offline | MVP | 014, 015, 016 |
| RF17 Lista compartilhada | Depois | 020 (spike) |
| RF18 Categorias | Depois | 019 |
| RF19 Preço sugerido | Descartado | 018 (descartado) |
| RF20 Exportar/importar (backup) | MVP | 017, 023 |
| RF21 Ordenar listas | MVP | 022 |
| RF22 Excluir arrastando | MVP | 025, 026 |
| RF23 Desfazer exclusão | MVP | 024 |

### Regras de negócio e requisitos não funcionais

| Requisito | Cards |
|---|---|
| RN01–RN03 Unidade, quantidade, valor | 003, 005 |
| RN04–RN07 Subtotal, totais, progresso | 003, 011 |
| RN08 Lista é cópia independente | 002, 009, 010 |
| RN09 Sem estado "finalizada" | 008, 011 |
| RN10 Comparação de nomes normalizada (descartada com o RF14) | 003 |
| RN11 Nome obrigatório e pré-preenchido (com a data de hoje desde a revisão 10/11) | 004, 006, 007, 009, 021 |
| RN12 Listas ilimitadas | 008 |
| RN13 Excluir template preserva listas | 002, 007 |
| RN14 Marcados riscados e no fim | 011 |
| RN15 Formato pt-BR | 003, 021 |
| RN16 Regras de ordenação das listas | 022 |
| RN17 Importação: substitui tudo, tudo ou nada, validação estrita | 023 |
| RN18 Exportação e "Último backup" | 017 |
| RN19 Exclusão imediata com desfazer | 024, 025, 026 |
| RNF01 PWA instalável | 014, 016 |
| RNF02 Offline total | 015, 016, 022 |
| RNF03 IndexedDB nativo | 002 |
| RNF04 Nenhum dado sai do aparelho (exceto o backup enviado pelo usuário) | 001, 015, 017 |
| RNF05 Resposta imediata | 011, 015, 016 |
| RNF06 Uso com uma mão, teclado decimal | 001, 004, 005, 011, 016, 022, 025 |
| RNF07 `storage.persist()` e backup manual | 002, 017, 023 |
| RNF08 Acessibilidade básica (gesto sempre com alternativa por toque) | 001, 004, 008, 011, 013, 016, 022, 025 |
| RNF09 Tema segue o sistema | 013 |
| RNF10 Código em inglês, UI em pt-BR | 001 (vale para todos) |

## Pendências que não são cards

- [ ] **Arte do ícone** do app (CARD-014). Um desenho provisório serve para o MVP.
- [ ] **Repositório no GitHub** criado, com Pages habilitado (CARD-016).
- [ ] Baixar o **Tailwind standalone v4** (`tailwindcss-windows-x64.exe`) e instalar a extensão **Live Server** no VS Code (CARD-001).
- [ ] Pós-MVP: categorias fixas ou personalizáveis, e onde ficam os marcados (CARD-019).
- [ ] Pós-MVP: decisão de abrir mão do "sem servidor/sem login" para o compartilhamento (CARD-020).

## Premissas assumidas

- Os cards ficam em `docs/cards/`, versionados com o código.
- Valem os nomes em inglês (RNF10), mesmo onde a seção 12 do refinamento ainda usa português:
  - rotas: `#/lists`, `#/list/:id`, `#/templates`, `#/template/:id`, `#/settings`;
  - views: `lists`, `list`, `templates`, `template`, `settings`.
- Além da estrutura sugerida no refinamento, foram adicionados:
  - `src/router.js`;
  - `src/model.js` (fábricas puras);
  - `src/ui/` (componentes reutilizáveis);
  - `version.js` (fonte única da versão);
  - `tests/` e `tools/`.
- A máquina não tem Node nem Python, então:
  - o servidor local é o Live Server do VS Code;
  - os testes automatizados ficam numa página no navegador, sem dependências, só para `calc.js`;
  - o resto é validado manualmente.
- O `styles/output.css` é gerado com `--minify` e commitado, porque o GitHub Pages não roda build. Há também um `.nojekyll` na raiz.
- A atualização do Service Worker é confirmada pelo usuário ("Nova versão disponível"), sem recarregar no meio da compra.
- Painéis via `<dialog>`, e o voltar do Android fecha o painel aberto (`history.pushState`).
- Os templates são ordenados por `updatedAt` desc na aba Templates.
- Após criar uma lista, o app abre a lista direto. Ao voltar, ela está no topo da tela inicial.
- As abas inferiores aparecem só nas telas de topo (Listas e Templates).
- Item adicionado na hora entra desmarcado, e o usuário marca com um toque.
- ~~Excluir item pelo editor não pede confirmação.~~ Substituída na revisão de 12/11: nenhuma exclusão pede confirmação, e todas têm "Desfazer" (CARD-024).
- A data do card de lista usa o formato `08 de nov. de 2026`.
- (Revisão 10/11) A formatação `DD/MM/AAAA` do nome sugerido fica em `calc.js` (`formatShortDate`), junto das outras formatações pt-BR (CARD-021).
- (Revisão 10/11) A preferência e as regras de ordenação ficam num módulo novo, `src/listSort.js`, no padrão de `src/theme.js`, e esse módulo entra no `APP_SHELL` (CARD-022).
- (Revisão 10/11) O painel de opções (`openActionSheet`) ganha a propriedade opcional `selected` para marcar a opção atual com ✓. Os chamadores atuais não mudam (CARD-022).
- (Revisão 10/11) Os cards 021 e 022 não têm testes automatizados (CLAUDE.md, "No unit tests"). A validação é manual, pelo roteiro de cada card.
- Os cards criados até o CARD-020 não têm `modelo_sugerido` e são implementados direto na sessão principal. Os cards a partir do CARD-021 têm o campo e seguem a delegação a subagente descrita no CLAUDE.md.
- (Revisão 10/11) CARD-012 (RF14) e CARD-018 (RF19) foram descartados: status `descartado`, arquivos mantidos só como registro. Não implementar.
- (Revisão backup) O backup foi dividido em dois cards: exportar (CARD-017, revisto e movido de `07-pos-mvp/` para `05-configuracoes/`) e importar (CARD-023). O CARD-017 renderiza o botão "Importar dados" sem ação; o CARD-023 o liga. Os dois vão juntos no mesmo deploy.
- (Revisão backup) A lógica de backup fica num módulo novo, `src/backup.js` (entra no `APP_SHELL`), e a gravação atômica da importação em `db.js` (`replaceAllData`), sem nova versão do banco.
- (Revisão backup) No iPhone, `navigator.share` exige o gesto do usuário: o arquivo é montado ao abrir Configurações, e o clique chama o compartilhamento sem `await` antes (CARD-017).
- (Revisão 12/11) A exclusão foi dividida em três cards: o "Desfazer" em todas as exclusões existentes (CARD-024, com o módulo novo `src/undo.js`), o componente do gesto aplicado aos itens (CARD-025, `src/ui/swipeToDelete.js`) e o gesto nos cards de lista e de template (CARD-026). Os dois módulos novos entram no `APP_SHELL`.
- (Revisão 12/11) Ao desfazer, as views que guardam o registro em memória (lista e template) recarregam do banco pelo evento `cestinha:restored`, para não sobrescrever o que foi restaurado (CARD-024).
- (Revisão 12/11) O texto sobre o fundo vermelho do gesto usa um token novo, `--on-danger`, com contraste AA nos dois temas (CARD-025).

## Perguntas em aberto (herdadas do refinamento)

| # | Pergunta | Padrão adotado nos cards |
|---|---|---|
| 4 | Permitir item com nome repetido na mesma lista? | Permitir (CARD-007, CARD-010) |
| 5 | Levar o valor para o template ao aceitar a sugestão do RF14? | Encerrada: CARD-012 e CARD-018 descartados (10/11) |
| Risco 2 | A tela inicial cresce sem limite | Renderizar tudo no MVP e reavaliar após o uso real (CARD-008). A ordenação (CARD-022) ajuda a achar listas, mas não resolve o crescimento |
| 8 | Esconder a data repetida no card quando o nome já é a data? | Manter as duas por enquanto (CARD-021) |
| Riscos 9 e 10 | Nomes iguais no mesmo dia; "Nome A–Z" não é cronológico com nomes em data | Aceitos (CARD-021, CARD-022) |
| Riscos 12 a 14 | Esquecer de exportar; importar o arquivo errado; compartilhar e escolher arquivo funcionam diferente no Android e no iPhone | Aceito e mitigado: "Último backup" (CARD-017), confirmação com a data e o resumo (CARD-023), download como alternativa e validação nos dois aparelhos após o deploy |
| Riscos 15 a 17 | Gestos de borda do sistema; exclusão ao rolar; perder uma lista sem ver o aviso | Aceitos e mitigados: o gesto começa no meio do card, só arrasta com movimento horizontal e passando de 40%, e o backup reduz o impacto (CARD-025, CARD-026, CARD-024) |

## Resumo

| | P | M | G | Total |
|---|---|---|---|---|
| **MVP** | 5 | 17 | 0 | 22 |
| **Depois** | 0 | 2 | 0 | 2 |
| **Descartados** | 1 | 1 | 0 | 2 |
| **Total** | 6 | 20 | 0 | **26** |

Por tipo: 20 feature · 3 infra · 1 setup · 1 dados · 1 spike.

Por modelo sugerido: 1 haiku (021) · 5 sonnet (022, 017, 023, 024, 026) · 1 opus (025) · 19 sem campo (anteriores à regra; o CARD-017 ganhou o campo ao ser revisto).

## Instruções para quem implementar um card

Valem as regras do [CLAUDE.md](../../CLAUDE.md), que prevalecem sobre o card. Em resumo:
- Leia o card inteiro, as premissas deste índice e as seções do refinamento em "Referências". Confira se os cards de `depende_de` estão `done`.
- Siga o Detalhamento técnico e respeite o "Fora do escopo". Se precisar desviar, registre o motivo em Observações.
- Não crie testes automatizados nem páginas de teste.
- Todo arquivo novo do app entra no `APP_SHELL` do `sw.js`. Classes Tailwind novas exigem regerar o `styles/output.css`.
- **Card com `modelo_sugerido`:** a sessão principal delega a implementação a um subagente com esse modelo, revisa o diff contra os critérios de aceite e leva as dúvidas ao usuário. O subagente não commita nem muda o status.
- Ao concluir, marque `status: done` no card **e** nesta tabela, e commite com o prefixo do card (ex.: `CARD-021: nome sugerido com a data`).
