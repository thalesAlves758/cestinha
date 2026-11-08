---
id: CARD-001
titulo: Setup do projeto e app shell
contexto: fundacao
tipo: setup
camadas: [front]
complexidade: M
prioridade: mvp
incerteza: baixa
status: todo
requisitos: [RNF04, RNF06, RNF08, RNF10]
depende_de: []
---

# CARD-001 — Setup do projeto e app shell

## Contexto
O Cestinha é um PWA de lista de compras, offline e sem back-end, feito em JavaScript vanilla com Tailwind CSS e IndexedDB, hospedado no GitHub Pages. Por enquanto o repositório só tem o refinamento (`docs/refinamento.md`). Todos os outros cards partem da base criada aqui.

## Objetivo
Criar a estrutura do projeto, que inclui:
- pastas e o `index.html` com o app shell (cabeçalho, área de conteúdo e abas inferiores);
- o build do Tailwind via CLI standalone, já com os tokens de cor dos dois temas;
- o roteador por hash;
- os helpers de DOM.

Com isso, cada tela pode ser implementada como um módulo independente.

## Detalhamento técnico
- **Repositório:** já iniciado (branch `main`), com um `.gitignore` que ignora o binário do Tailwind e `.vscode/`. Revisar se for preciso.
- **Estrutura** (todo nome de código em inglês, conforme RNF10):
  ```
  index.html
  version.js
  src/app.js
  src/router.js
  src/ui/dom.js
  src/views/lists.js | list.js | templates.js | template.js | settings.js   (placeholders)
  styles/input.css
  styles/output.css   (gerado)
  ```
- **`index.html`:**
  - `<html lang="pt-BR">`, `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
  - Carrega `styles/output.css`, `version.js` e `<script type="module" src="src/app.js">`.
  - Shell:
    - `<header>` com o título "Cestinha" e o link da engrenagem para `#/settings` (com `aria-label="Configurações"`);
    - `<main id="view">`;
    - `<nav>` inferior com as abas `#/lists` (🛒 Listas) e `#/templates` (📋 Templates).
  - **Todos os caminhos relativos**, sem `/` inicial: o app roda em `/cestinha/` no GitHub Pages.
- **`version.js`:** `self.APP_VERSION = '0.1.0';`. É a fonte única da versão, usada na tela de Configurações (CARD-013) e no nome do cache do Service Worker (CARD-015).
- **Tailwind v4 standalone:**
  - Baixar `tailwindcss-windows-x64.exe` dos releases do GitHub e renomear para `tailwindcss.exe` na raiz. Fica fora do git.
  - Dev: `./tailwindcss.exe -i styles/input.css -o styles/output.css --watch`
  - Deploy: `./tailwindcss.exe -i styles/input.css -o styles/output.css --minify`
- **`styles/input.css`:** tokens semânticos trocados por variável CSS, assim os componentes não precisam de `dark:` em todo lugar.
  ```css
  @import "tailwindcss";
  @custom-variant dark (&:where(.dark, .dark *));

  :root {
    --page: #F7F8F6; --surface: #FFFFFF; --primary: #1F5A3D; --on-primary: #FFFFFF;
    --ink: #1A1F1C; --muted: #5B6660; --line: #DDE3DF; --danger: #B3261E;
  }
  .dark {
    --page: #0F1512; --surface: #18201C; --primary: #5FB98A; --on-primary: #0F1512;
    --ink: #E6ECE8; --muted: #9AA8A0; --line: #2A3530; --danger: #F2B8B5;
  }
  @theme inline {
    --color-page: var(--page); --color-surface: var(--surface);
    --color-primary: var(--primary); --color-on-primary: var(--on-primary);
    --color-ink: var(--ink); --color-muted: var(--muted);
    --color-line: var(--line); --color-danger: var(--danger);
  }
  ```
  - Uso: `bg-page text-ink border-line bg-primary text-on-primary`.
  - Fonte do sistema (padrão do Tailwind). `tabular-nums` para valores.
- **`src/router.js`:** tabela de rotas com parâmetros, escutando `hashchange`.
  ```js
  // app.js
  const routes = {
    '/lists':        () => import('./views/lists.js'),
    '/list/:id':     () => import('./views/list.js'),
    '/templates':    () => import('./views/templates.js'),
    '/template/:id': () => import('./views/template.js'),
    '/settings':     () => import('./views/settings.js'),
  };
  // cada view: export function render(container, params) { ...; return cleanup?; }
  ```
  - Hash vazio ou desconhecido redireciona para `#/lists`.
  - Antes de renderizar a próxima view, chama o `cleanup` da anterior.
  - Marca a aba ativa com `aria-current="page"`.
  - As abas aparecem só nas rotas de topo (`/lists`, `/templates`).
- **`src/ui/dom.js`:**
  - `escapeHtml(str)`;
  - tag `html\`...\`` que escapa as interpolações (nomes de itens e listas são texto do usuário);
  - `qs(sel, root)`.
- **Views placeholder:** cada uma renderiza o título da tela e "Em construção", para validar a navegação.
- **Servidor local:** extensão **Live Server** do VS Code. A máquina não tem Python nem Node, e o Service Worker exige `localhost` ou HTTPS.

## Critérios de aceite
- [ ] Servido pelo Live Server, o `index.html` abre sem erros no console.
- [ ] Tocar nas abas troca o hash e a view, a aba ativa fica marcada (`aria-current`) e o botão voltar do navegador funciona.
- [ ] Hash vazio ou inexistente leva a `#/lists`.
- [ ] Abrir direto uma URL com `#/template/abc` renderiza a view correspondente com `params.id === 'abc'`.
- [ ] O `styles/output.css` é gerado pela CLI, e nenhum CDN do Tailwind é usado.
- [ ] Nenhum caminho com `/` inicial em `index.html` e nos imports.
- [ ] Adicionar `class="dark"` manualmente no `<html>` troca as cores de fundo, superfície, texto e primária.
- [ ] A aba Network mostra só arquivos locais: nenhuma fonte, script ou chamada externa (RNF04).
- [ ] Abas e engrenagem têm alvo de toque ≥ 44 px, e o layout não rola na horizontal a 360 px de largura (RNF06).
- [ ] Identificadores, arquivos e rotas estão em inglês, e os textos da interface em pt-BR (RNF10).

## Observações
- No Tailwind v4 a configuração fica no CSS: não existe `tailwind.config.js`.
- Nunca montar nomes de classe dinamicamente (ex.: `` `bg-${cor}` ``): o scanner do Tailwind só encontra strings completas.
- A seção 12 do refinamento ainda mostra rotas em português (`#/listas`). Valem os nomes em inglês, conforme RNF10.
- As cores são as sugeridas na seção 9. Os tons de texto, borda e erro são propostas iniciais e precisam ter o contraste validado (ver CARD-016).

## Pendências
Nenhuma.

## Fora do escopo
- Troca de tema e o script anti-"piscar" (CARD-013).
- Manifest e ícones (CARD-014).
- Service Worker (CARD-015).

## Como testar
1. Rodar o Tailwind em `--watch` e abrir com o Live Server.
2. Navegar pelas abas e pela engrenagem, usar voltar/avançar e digitar hashes manualmente.
3. Usar o DevTools no modo dispositivo, a 360 px, e alternar `class="dark"` no `<html>`.

## Referências
Refinamento: seções 7 (stack), 9 (design) e 12 (arquitetura). RNF04, RNF06, RNF08 e RNF10.

## Justificativa da complexidade
M: várias peças de base (build de CSS, roteador, shell, tokens), sem regra de negócio.
