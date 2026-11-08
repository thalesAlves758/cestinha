---
id: CARD-015
titulo: Service Worker e funcionamento offline
contexto: pwa
tipo: infra
camadas: [front]
complexidade: M
prioridade: mvp
incerteza: media
status: done
requisitos: [RF16, RNF02, RNF04, RNF05]
depende_de: [CARD-004, CARD-014]
---

# CARD-015 — Service Worker e funcionamento offline

## Contexto
Dentro do mercado o sinal costuma ser ruim, então o Cestinha precisa funcionar 100% offline depois do primeiro acesso. Ao mesmo tempo, o celular não pode ficar preso numa versão velha quando houver deploy novo.

## Objetivo
Criar o Service Worker com:
- cache versionado do app shell;
- estratégia cache-first;
- limpeza de caches antigos;
- fluxo de atualização confirmado pelo usuário.

## Detalhamento técnico
- **`sw.js`** na raiz, com escopo igual à pasta do app:
  ```js
  importScripts('version.js');
  const CACHE_NAME = `cestinha-${self.APP_VERSION}`;
  const APP_SHELL = [
    './', 'index.html', 'manifest.webmanifest', 'version.js', 'styles/output.css',
    'src/app.js', 'src/router.js', 'src/db.js', 'src/model.js', 'src/calc.js', 'src/theme.js',
    'src/ui/dom.js', 'src/ui/sheet.js', 'src/ui/prompt.js', 'src/ui/confirm.js',
    'src/ui/actionSheet.js', 'src/ui/toast.js', 'src/ui/fab.js', 'src/ui/itemEditor.js',
    'src/ui/newListSheet.js',
    'src/views/lists.js', 'src/views/list.js', 'src/views/templates.js',
    'src/views/template.js', 'src/views/settings.js',
    'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
  ];
  ```
  - **`install`:** `caches.open(CACHE_NAME).then(c => c.addAll(APP_SHELL))`, **sem** `skipWaiting` automático.
  - **`activate`:** apaga todo cache que comece com `cestinha-` e seja diferente de `CACHE_NAME`, depois chama `clients.claim()`.
  - **`fetch`:**
    - só `GET` da mesma origem;
    - navegação: responde com o `index.html` do cache;
    - demais requisições: cache-first com fallback para a rede.
  - **`message`:** `{ type: 'SKIP_WAITING' }` chama `self.skipWaiting()`.
- **Registro em `src/app.js`:** `navigator.serviceWorker.register('sw.js')`, com caminho relativo, se `'serviceWorker' in navigator`.
- **Atualização:**
  - Quando existe um SW em `waiting` (no registro ou via `updatefound`), mostrar `showToast({ message: 'Nova versão disponível', actions: [{ label: 'Atualizar' }] })`.
  - "Atualizar" envia `SKIP_WAITING`. No `controllerchange`, recarregar a página uma vez.
  - Sem ação, a nova versão entra quando o app for totalmente fechado e reaberto.
- **Desenvolvimento:** com o SW ativo, marcar "Update on reload" em DevTools › Application › Service Workers. Sem isso, o cache esconde as mudanças.

## Critérios de aceite
- [ ] Após o primeiro acesso, com o DevTools em Offline, o app abre, navega e cria, edita e marca itens normalmente (RNF02, RF16).
- [ ] Recarregar offline em qualquer rota (ex.: `#/list/<id>`) funciona.
- [ ] Ao mudar `APP_VERSION` em `version.js`, o navegador detecta a nova versão, aparece o aviso "Nova versão disponível", "Atualizar" carrega a versão nova e o cache antigo é apagado.
- [ ] Sem tocar em "Atualizar", a página atual não recarrega sozinha (não interrompe uma compra em andamento).
- [x] Se um arquivo do `APP_SHELL` não existir, a instalação falha de forma visível no console (o `addAll` é atômico). Toda a lista é revisada e existe.
- [x] Nenhuma requisição para outra origem é feita ou cacheada (RNF04).
- [ ] O app abre rápido offline, servido do cache (RNF05).

## Observações
- **Atenção a cada deploy:**
  - incrementar `APP_VERSION`;
  - incluir todo arquivo novo no `APP_SHELL`, senão o app quebra offline.
  - Vale registrar essa regra no `CLAUDE.md` quando o card for feito.
- A detecção de mudança depende de o navegador comparar o `version.js` importado. Os navegadores atuais comparam os scripts importados na checagem de atualização, mas confirmar no teste do critério de versão. Se falhar, mover a constante de versão para dentro do `sw.js`.
- `tests/` e `tools/` ficam fora do cache.
- Atualização automática com `skipWaiting` imediato foi descartada: poderia recarregar o app no meio da compra.

### Implementação (desvios e decisões)
- A lista `APP_SHELL` do detalhamento acima ficou desatualizada. A lista real, em `sw.js`, foi montada a partir dos arquivos existentes: inclui `src/ui/buttons.js` e o novo `src/pwa.js`. Foi conferida por script nos dois sentidos (todo caminho existe e todo arquivo do app está na lista).
- O registro e o fluxo de atualização ficaram em `src/pwa.js` (`registerServiceWorker()`), chamado por `src/app.js`, em vez de direto no `app.js`.
- Ajustes para o cache HTTP do GitHub Pages (`max-age=600`):
  - a instalação busca os arquivos com `cache: 'reload'`, para não montar o cache novo com arquivos da versão anterior;
  - o registro usa `updateViaCache: 'none'`, para que a checagem de atualização leia o `version.js` novo.
- `controllerchange` só recarrega a página se o usuário tocou em "Atualizar". Na primeira instalação, o `clients.claim()` também dispara esse evento, e isso não pode recarregar.
- O aviso de nova versão virou um **banner** fixo logo abaixo do cabeçalho (`src/ui/updateBanner.js`), no lugar do toast: fica visível ao trocar de tela e não é substituído por outros avisos. Tem "Atualizar" e "✕" (dispensar). Se for dispensado, volta a aparecer na próxima abertura, porque o SW continua em `waiting`. Se a troca de versão não acontecer em 4 s depois de "Atualizar", a página recarrega mesmo assim (rede de segurança).
- O app também checa atualização quando volta ao primeiro plano (`visibilitychange`). O PWA instalado pode ficar aberto por dias.
- Os critérios não marcados dependem de teste no navegador (offline, recarga em rota, fluxo de versão) e ficam para validação manual.

## Pendências
- [ ] [CARD-004 — Componentes base](../02-componentes/CARD-004-paineis-dialogos-e-avisos.md) (aviso de atualização)
- [ ] [CARD-014 — Manifest e ícones](../06-pwa/CARD-014-manifest-e-icones.md)

## Fora do escopo
Publicação no GitHub Pages e teste no aparelho (CARD-016).

## Como testar
DevTools › Application › Service Workers e Cache Storage. Alternar Offline na aba Network. Mudar a versão e recarregar para ver o fluxo de atualização.

## Referências
Refinamento: RNF02, RF16, seção 12 (atualização do SW, subcaminho do GitHub Pages).

## Justificativa da complexidade
M: estratégia de cache e ciclo de vida do SW (instalar, ativar, atualizar) costumam ter armadilhas. Por isso a incerteza é média.
