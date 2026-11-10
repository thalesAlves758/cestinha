# Deploy do Cestinha (GitHub Pages)

O app é servido como arquivos estáticos pelo GitHub Pages (branch `main`, pasta raiz), em `https://<usuario>.github.io/cestinha/`. O Pages não roda build: o `styles/output.css` é gerado localmente e **commitado**.

## Checklist a cada deploy

1. **Subir a versão** em `version.js` (`self.APP_VERSION`). Sem isso, os celulares instalados não detectam a atualização.
2. **Gerar o CSS** minificado:
   ```sh
   ./tailwindcss.exe -i styles/input.css -o styles/output.css --minify
   ```
3. **Conferir o `APP_SHELL` do `sw.js`**: todo arquivo novo do app (módulo JS, ícone, etc.) precisa estar na lista, e todo caminho listado precisa existir. Um caminho errado faz a instalação do Service Worker falhar; um arquivo fora da lista quebra o app offline.
4. **Commit e push** na `main`.
5. **Conferir a publicação**: abrir o site e, num celular/aba com a versão anterior já instalada, ver o banner **"Nova versão do Cestinha disponível."**. Tocar em "Atualizar" e confirmar a nova versão em Configurações.

## Observações

- O GitHub Pages guarda arquivos por cerca de 10 minutos (`max-age=600`). O Service Worker já contorna isso (instalação com `cache: 'reload'` e registro com `updateViaCache: 'none'`), mas o site pode levar alguns minutos para refletir o push.
- O `.nojekyll` na raiz faz o Pages servir os arquivos como estão, sem processamento do Jekyll.
- Durante o desenvolvimento local, deixe marcado **"Update on reload"** em DevTools › Application › Service Workers; senão o navegador serve arquivos em cache.
