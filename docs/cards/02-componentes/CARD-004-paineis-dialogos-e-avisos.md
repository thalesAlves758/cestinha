---
id: CARD-004
titulo: Componentes base — painel inferior, diálogos e avisos
contexto: componentes
tipo: feature
camadas: [front]
complexidade: M
prioridade: mvp
incerteza: baixa
status: todo
requisitos: [RNF06, RNF08]
depende_de: [CARD-001]
---

# CARD-004 — Componentes base: painel inferior, diálogos e avisos

## Contexto
O Cestinha é usado no celular, com uma mão, dentro do mercado. Várias telas usam os mesmos padrões de interface:
- painéis inferiores (nova lista, editor de item);
- confirmação de exclusão;
- pedido de nome (criar ou renomear);
- menu de ações;
- aviso não bloqueante (sugestão do RF14, erro ao salvar).

## Objetivo
Entregar esses componentes reutilizáveis em `src/ui/`, acessíveis e confortáveis ao toque, para que as telas só os chamem.

## Detalhamento técnico
- **`src/ui/sheet.js`:** `openSheet({ title, render(bodyEl, close) , onClose }) → { close }`.
  - Usa `<dialog>` + `showModal()`, estilizado como painel inferior: fixo embaixo, cantos superiores arredondados, `max-height: 90dvh`, rolagem interna.
  - Fecha por toque no fundo, pela tecla Esc ou pelo botão "Fechar".
  - **Voltar do Android fecha o painel:** ao abrir, chamar `history.pushState({ sheet: true }, '')`, que não muda o hash e não aciona o roteador. No `popstate`, fechar o painel. Ao fechar por outro meio, chamar `history.back()` para consumir a entrada.
  - Ao abrir, foca o primeiro campo.
- **`src/ui/prompt.js`:** `promptText({ title, label, value = '', confirmLabel = 'Salvar' }) → Promise<string | null>`.
  - Valida nome obrigatório (RN11), devolve o texto com `trim()` e `null` se cancelado.
- **`src/ui/confirm.js`:** `confirmDialog({ title, message, confirmLabel = 'Excluir', danger = true }) → Promise<boolean>`.
- **`src/ui/actionSheet.js`:** `openActionSheet({ title, actions: [{ label, danger, onSelect }] })`.
  - Substitui o menu "⋮" dos cards e cabeçalhos (renomear, excluir).
- **`src/ui/toast.js`:** `showToast({ message, actions = [], timeout = 6000 }) → { dismiss }`.
  - Fica acima das abas e do botão "+", com `role="status"` e `aria-live="polite"`.
  - Só um aviso por vez: um novo substitui o anterior.
  - Ações como botões (ex.: "Adicionar" / "Agora não", "Tentar de novo").
- **`src/ui/fab.js`:** `renderFab({ label, onClick })`, botão "+" flutuante no canto inferior direito, com `aria-label`.
- Tudo usa os tokens de cor do CARD-001. Nenhum `confirm()` ou `prompt()` nativo.

## Critérios de aceite
- [ ] Painel aberto: Esc, toque no fundo, botão "Fechar" e **voltar do Android** fecham o painel sem sair da tela atual.
- [ ] Com o painel aberto, o foco fica preso nele (`showModal`) e volta ao elemento de origem ao fechar.
- [ ] Com o teclado virtual aberto, o campo focado no painel continua visível.
- [ ] `promptText` não confirma com nome vazio ou só com espaços: mostra mensagem no campo (RN11).
- [ ] `confirmDialog` resolve `true` só no botão de confirmação. O botão perigoso usa a cor `danger`.
- [ ] O aviso não bloqueia a interação com a tela, some sozinho após o timeout e é anunciado por leitores de tela.
- [ ] Todos os botões têm alvo de toque ≥ 44 px (RNF06), e os campos têm `<label>` associado (RNF08).
- [ ] Os componentes ficam legíveis, com contraste AA, nos temas claro e escuro.

## Observações
- O `history.pushState` para o voltar do Android é o ponto mais delicado. Testar no celular junto com o roteador por hash (CARD-016).
- O menu de ações usa painel em vez de menu suspenso porque é mais fácil de tocar com o polegar.

## Pendências
- [ ] [CARD-001 — Setup do projeto e app shell](../01-fundacao/CARD-001-setup-projeto-app-shell.md)

## Fora do escopo
- Editor de item (CARD-005).
- Gestos de deslizar.

## Como testar
Pelo console, por exemplo: `(await import('./src/ui/confirm.js')).confirmDialog({ title: 'Teste', message: 'Ok?' })`. Repetir para cada componente, no modo dispositivo e nos dois temas.

## Referências
Refinamento: seção 9 (design), seção 10 (T02, T03, T04 usam painel e aviso). RNF06 e RNF08.

## Justificativa da complexidade
M: seis componentes pequenos. O tratamento de foco e do voltar do Android pede cuidado.
