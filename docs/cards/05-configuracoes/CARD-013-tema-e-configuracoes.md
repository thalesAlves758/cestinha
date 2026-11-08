---
id: CARD-013
titulo: Tema claro/escuro e tela de Configurações (T07)
contexto: configuracoes
tipo: feature
camadas: [front]
complexidade: P
prioridade: mvp
incerteza: baixa
status: done
requisitos: [RF15, RNF08, RNF09]
depende_de: [CARD-001]
---

# CARD-013 — Tema claro/escuro e tela de Configurações (T07)

## Contexto
O app tem tema claro e escuro, segue o sistema por padrão e permite fixar um tema manualmente. A troca fica na tela de Configurações, aberta pela engrenagem do cabeçalho.

## Objetivo
Implementar a troca de tema (Automático, Claro, Escuro):
- aplicada na hora;
- salva no `localStorage`;
- sem "piscar" o tema errado ao abrir.

Implementar também a tela `#/settings`, com o seletor de tema e a versão do app.

## Detalhamento técnico
- **Script inline no `<head>` do `index.html`**, antes do CSS, para evitar o "piscar":
  ```html
  <script>
    (function () {
      try {
        var mode = localStorage.getItem('cestinha.theme') || 'auto';
        var dark = mode === 'dark' || (mode === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', dark);
      } catch (e) {}
    })();
  </script>
  ```
- **`src/theme.js`:**
  ```js
  export function getThemeMode()       // 'auto' | 'light' | 'dark' (padrão 'auto')
  export function setThemeMode(mode)   // grava em localStorage 'cestinha.theme' e aplica
  export function applyTheme()         // alterna .dark no <html> e atualiza <meta name="theme-color">
  export function watchSystemTheme()   // listener em matchMedia('(prefers-color-scheme: dark)'), ativo só no modo 'auto'
  ```
  - `app.js` chama `watchSystemTheme()` na inicialização.
  - Acesso ao `localStorage` com `try/catch`.
- **`styles/input.css`:** `:root { color-scheme: light } .dark { color-scheme: dark }`, para que checkbox, scrollbars e campos nativos acompanhem o tema.
- **`src/views/settings.js`:** `render(container)`.
  - Cabeçalho com voltar: `history.back()` se houver histórico, senão `#/lists`.
  - Grupo de rádio segmentado: Automático / Claro / Escuro.
  - Rodapé "Versão {self.APP_VERSION}" (de `version.js`, CARD-001).

## Critérios de aceite
- [x] Escolher Claro, Escuro ou Automático muda a interface na hora (RF15).
- [x] A escolha persiste ao recarregar e ao reabrir o app.
- [x] No modo Automático, trocar o tema do sistema muda o app sem recarregar (RNF09).
- [x] Ao abrir o app com o tema escuro salvo, não aparece um "flash" claro antes da renderização.
- [x] Componentes nativos (checkbox, campos) acompanham o tema.
- [x] Textos, bordas, botões e a barra de progresso têm contraste AA nos dois temas (RNF08).
- [x] A versão exibida é a de `version.js`.

## Observações
- A chave `cestinha.theme` aparece em dois lugares (script inline e `theme.js`). Deixar um comentário nos dois.
- A cor da `<meta name="theme-color">` acompanha o tema, para que a barra do Android combine.

## Pendências
- [ ] [CARD-001 — Setup do projeto e app shell](../01-fundacao/CARD-001-setup-projeto-app-shell.md)

## Fora do escopo
Exportar e importar dados nas configurações (CARD-017).

## Referências
Refinamento: tela T07, seção 9 (temas e cores), seção 11 (preferência no `localStorage`), seção 12 (variante `dark` por classe), RF15, RNF08 e RNF09.

## Justificativa da complexidade
P: pequeno, já que os tokens dos dois temas existem desde o CARD-001.
