<p align="center">
  <img src="icons/icon.svg" alt="" width="96" height="96">
</p>

<h1 align="center">Cestinha</h1>

<p align="center">
  Lista de compras offline, feita para usar no mercado.<br>
  <a href="https://thalesalves758.github.io/cestinha/"><strong>thalesalves758.github.io/cestinha</strong></a>
</p>

---

O Cestinha é um PWA (app da web instalável) de lista de compras para uso pessoal. A ideia central é separar os **templates** (a lista de sempre, com os itens que você costuma comprar) das **listas do dia**: a partir de um template você gera a lista da compra em segundos, ajusta o que precisar e usa no mercado, marcando o que vai para o carrinho e acompanhando quanto está gastando.

Funciona 100% offline, não tem login nem servidor, e nenhum dado sai do aparelho.

## Funcionalidades

- **Templates:** crie listas-base com nome, quantidade, unidade (`un` ou `kg`) e valor opcional de cada item.
- **Lista do dia:** gere uma lista a partir de um template (cópia independente) ou comece em branco. O nome sugerido é a data de hoje.
- **Modo compra:** marque os itens que foram para o carrinho (eles ficam riscados e descem para o fim), adicione itens na hora e informe ou ajuste valores.
- **Totais:** subtotal por item, **total previsto** (todos os itens com valor) e **total no carrinho** (só os marcados), além de uma barra de progresso.
- **Histórico:** todas as listas ficam na tela inicial, com ordenação por mais recentes, mais antigas, alteradas por último ou nome.
- **Tema** claro, escuro ou automático (segue o sistema).
- **Offline e instalável** no Android e no iPhone.

## Como instalar no celular

1. Abra [thalesalves758.github.io/cestinha](https://thalesalves758.github.io/cestinha/).
2. Adicione à tela inicial:
   - **Android (Chrome):** menu ⋮ › "Instalar app" (ou "Adicionar à tela inicial").
   - **iPhone (Safari):** botão Compartilhar › "Adicionar à Tela de Início".
3. Abra pelo ícone. Depois do primeiro acesso, o app funciona sem internet.

Quando sai uma versão nova, aparece um aviso no topo com o botão **"Atualizar"**. O app nunca se atualiza sozinho no meio de uma compra.

> [!IMPORTANT]
> **Seus dados ficam só no aparelho**, no armazenamento do navegador. Limpar os dados do navegador, desinstalar o app ou trocar de celular apaga as listas e os templates. No iPhone, use o app **instalado na tela de início**: usado direto no navegador, o iOS pode apagar os dados de sites que ficam 7 dias sem acesso. Exportar e importar backup está planejado ([CARD-017](docs/cards/05-configuracoes/CARD-017-exportar-backup.md) e [CARD-023](docs/cards/05-configuracoes/CARD-023-importar-backup.md)).

## Stack

| Camada | Escolha |
|---|---|
| Front-end | JavaScript puro (ES modules), sem framework e sem dependências npm |
| Estilo | [Tailwind CSS v4](https://tailwindcss.com/) via CLI standalone |
| Dados | IndexedDB com a API nativa (sem bibliotecas) |
| Offline | Service Worker com cache do app shell |
| Hospedagem | GitHub Pages |

Não há build além do Tailwind: os arquivos são servidos como estão.

## Desenvolvimento

### Pré-requisitos

- [Tailwind CSS standalone v4](https://github.com/tailwindlabs/tailwindcss/releases) salvo na raiz do repositório como `tailwindcss.exe` (ignorado pelo Git).
- Um servidor local. O projeto usa a extensão **Live Server** do VS Code. O Service Worker exige `localhost` ou HTTPS, então abrir o `index.html` direto do disco não funciona.

### Rodando

```sh
# CSS em modo watch durante o desenvolvimento
./tailwindcss.exe -i styles/input.css -o styles/output.css --watch
```

Abra a pasta no VS Code e use **Go Live**. Com o Service Worker ativo, o navegador serve os arquivos do cache: deixe marcado **DevTools › Application › Service Workers › "Update on reload"**, senão as mudanças não aparecem.

### Regras do projeto

- **Código em inglês, interface em pt-BR:** nomes, arquivos, rotas e comentários em inglês; só os textos exibidos ficam em português.
- **Caminhos sempre relativos** (sem `/` no início): o app roda no subcaminho `/cestinha/` do GitHub Pages.
- **Todo arquivo novo do app entra no `APP_SHELL` do [`sw.js`](sw.js)**. O cache é atômico: um caminho errado quebra a instalação inteira, e um arquivo fora da lista quebra o uso offline.
- **`styles/output.css` é gerado, mas é commitado**, porque o GitHub Pages não roda build. Nunca edite à mão; regere depois de usar classes novas.
- **Android e iPhone:** toda mudança de interface precisa funcionar nos dois sistemas.
- Sem testes automatizados: a validação é manual, no navegador e no celular.

As regras completas e a arquitetura estão no [CLAUDE.md](CLAUDE.md).

### Estrutura

```
index.html            shell estático (cabeçalho, <main id="view">, abas inferiores)
manifest.webmanifest  manifesto do PWA
sw.js                 Service Worker (cache do app shell)
version.js            APP_VERSION: fonte única da versão
src/
  app.js              tabela de rotas e inicialização
  router.js           roteador por hash (#/lists, #/list/:id, #/templates…)
  db.js               único módulo que acessa o IndexedDB
  model.js            fábricas de registros (template, lista, item)
  calc.js             totais, progresso e formatação pt-BR
  listSort.js         ordenação das listas e preferência salva
  theme.js            tema claro/escuro/automático
  pwa.js              registro do Service Worker e aviso de atualização
  views/              telas (lists, list, templates, template, settings)
  ui/                 componentes (painel, diálogos, editor de item, avisos…)
styles/
  input.css           tokens de cor e configuração do Tailwind
  output.css          CSS gerado (commitado)
docs/
  refinamento.md      especificação: requisitos, regras, telas e modelo de dados
  cards/              tarefas de implementação e quadro (_index.md)
```

## Deploy

O GitHub Pages publica direto da branch `main`.

1. Regere o CSS minificado: `./tailwindcss.exe -i styles/input.css -o styles/output.css --minify`.
2. **Aumente o `APP_VERSION`** em [`version.js`](version.js). Sem isso, os celulares com o app instalado não recebem a versão nova.
3. Faça o commit e o push para a `main`.

## Documentação

- [docs/refinamento.md](docs/refinamento.md): especificação do produto (requisitos RF, regras RN, requisitos não funcionais RNF, telas e modelo de dados).
- [docs/cards/_index.md](docs/cards/_index.md): quadro de tarefas, com ordem de execução, dependências e rastreabilidade. Cada card é implementado e commitado com o seu ID como prefixo (ex.: `CARD-022: …`).
