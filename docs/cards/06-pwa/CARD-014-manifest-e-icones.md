---
id: CARD-014
titulo: Manifest e ícones (app instalável)
contexto: pwa
tipo: infra
camadas: [front]
complexidade: P
prioridade: mvp
incerteza: baixa
status: done
requisitos: [RNF01, RF16]
depende_de: [CARD-001]
---

# CARD-014 — Manifest e ícones (app instalável)

## Contexto
O Cestinha é um PWA instalado na tela inicial do Android, sem loja de aplicativos. Para isso precisa de um Web App Manifest e de ícones, servidos em subcaminho no GitHub Pages (`/cestinha/`).

## Objetivo
Criar o manifest e os ícones (incluindo maskable) e ligá-los ao `index.html`, deixando o app pronto para instalação junto com o Service Worker (CARD-015).

## Detalhamento técnico
- **`manifest.webmanifest`** com caminhos relativos ao próprio manifest (ver Observações):
  ```json
  {
    "name": "Cestinha",
    "short_name": "Cestinha",
    "lang": "pt-BR",
    "start_url": "./",
    "scope": "./",
    "display": "standalone",
    "background_color": "#F7F8F6",
    "theme_color": "#1F5A3D",
    "icons": [
      { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
      { "src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
    ]
  }
  ```
- **`index.html`:**
  - `<link rel="manifest" href="manifest.webmanifest">`
  - `<meta name="theme-color" content="#1F5A3D">`
  - `<link rel="icon" href="icons/icon.svg" type="image/svg+xml">`
  - `<link rel="apple-touch-icon" href="icons/icon-192.png">`
- **Ícones:**
  - fonte `icons/icon.svg`: cestinha simples sobre fundo verde `#1F5A3D`;
  - PNGs 192 e 512;
  - versão maskable com o desenho dentro da zona segura (80% central).
  - Sem Node nem Python na máquina, exportar os PNGs com uma página auxiliar `tools/export-icons.html`, que desenha o SVG num `<canvas>` e baixa os PNGs, ou com uma ferramenta de design (Figma, Inkscape).

## Critérios de aceite
- [x] DevTools › Application › Manifest mostra nome, ícones e `start_url` sem erros nem avisos.
- [x] `start_url` e `scope` resolvem para a pasta do app, tanto em `localhost` quanto em `/cestinha/` no GitHub Pages.
- [x] O ícone maskable aparece sem cortes no visualizador de máscaras do DevTools.
- [x] O favicon SVG aparece na aba do navegador.

## Observações
- Com caminhos relativos, o `start_url` é resolvido a partir da URL do manifest. Por isso funciona em `/cestinha/` sem fixar o subcaminho.
- A validação da instalação de fato no Android acontece no CARD-016, com o Service Worker já ativo.
- O `tools/` não entra no cache do Service Worker.

## Pendências
- [ ] [CARD-001 — Setup do projeto e app shell](../01-fundacao/CARD-001-setup-projeto-app-shell.md)
- [ ] Definir a arte do ícone (decisão de design). Um desenho provisório serve para o MVP.

## Fora do escopo
Service Worker (CARD-015) e deploy (CARD-016).

## Referências
Refinamento: RNF01, RF16, seção 12 (GitHub Pages em subcaminho), seção 9 (cor principal).

## Justificativa da complexidade
P: arquivos estáticos e exportação de imagens.
