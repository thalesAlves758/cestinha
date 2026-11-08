import { showToast } from './ui/toast.js';

// Reload only when the user asked for the update. On the very first install,
// clients.claim() also fires 'controllerchange', and that must not reload the page.
let updateAccepted = false;

function promptUpdate(worker) {
  showToast({
    message: 'Nova versão disponível',
    timeout: 0,
    actions: [
      {
        label: 'Atualizar',
        onSelect: () => {
          updateAccepted = true;
          worker.postMessage({ type: 'SKIP_WAITING' });
        },
      },
      { label: 'Agora não' },
    ],
  });
}

async function register() {
  try {
    // updateViaCache 'none': update checks fetch sw.js and version.js from the
    // network, bypassing GitHub Pages' HTTP cache, so a new version is detected promptly.
    const registration = await navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' });

    // A new version installed earlier and still waiting (e.g. the user tapped "Agora não").
    if (registration.waiting && navigator.serviceWorker.controller) promptUpdate(registration.waiting);

    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        // With no controller this is the first install, not an update.
        if (worker.state === 'installed' && navigator.serviceWorker.controller) promptUpdate(worker);
      });
    });

    // The installed app can stay open for days: check for updates when it returns to the foreground.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && navigator.onLine) registration.update().catch(() => {});
    });
  } catch (error) {
    console.error('Service worker registration failed', error);
  }
}

/** Registers the service worker (offline support) and the user-confirmed update flow. */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!updateAccepted) return;
    updateAccepted = false;
    location.reload();
  });

  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}
