// Service worker: offline app shell with a versioned cache (CARD-015).
// APP_VERSION comes from version.js (single source). Bump it on every deploy.
importScripts('version.js');

// GitHub Pages serves every project of a user from the same origin, so cache
// names are prefixed and only our own old caches are deleted.
const CACHE_PREFIX = 'cestinha-';
const CACHE_NAME = `${CACHE_PREFIX}${self.APP_VERSION}`;

// Every file the app needs offline. Any new app file MUST be added here,
// otherwise the app breaks offline. addAll is atomic: a missing file fails the install.
const APP_SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'version.js',
  'styles/output.css',
  'src/app.js',
  'src/calc.js',
  'src/db.js',
  'src/model.js',
  'src/pwa.js',
  'src/router.js',
  'src/theme.js',
  'src/ui/actionSheet.js',
  'src/ui/buttons.js',
  'src/ui/confirm.js',
  'src/ui/dom.js',
  'src/ui/fab.js',
  'src/ui/itemEditor.js',
  'src/ui/newListSheet.js',
  'src/ui/prompt.js',
  'src/ui/sheet.js',
  'src/ui/toast.js',
  'src/views/list.js',
  'src/views/lists.js',
  'src/views/settings.js',
  'src/views/template.js',
  'src/views/templates.js',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  // cache: 'reload' bypasses the HTTP cache (GitHub Pages sends max-age=600),
  // so a new version is never filled with stale files from the previous deploy.
  // No skipWaiting here: the user confirms the update (see src/pwa.js).
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(APP_SHELL.map((url) => new Request(url, { cache: 'reload' }))),
    ),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Hash routing: every navigation is the same document.
      if (request.mode === 'navigate') {
        return (await cache.match('index.html')) ?? fetch(request);
      }
      return (await cache.match(request)) ?? fetch(request);
    }),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
