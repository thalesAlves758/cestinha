const BANNER_ID = 'update-banner';

/**
 * Persistent banner right below the header announcing a new app version.
 * It lives outside <main id="view">, so it survives route changes and is never
 * replaced by toasts. Idempotent: a second call while it is shown does nothing.
 * `onUpdate` runs when the user taps "Atualizar"; "Dispensar" hides it until the next app start.
 */
export function showUpdateBanner({ onUpdate }) {
  if (document.getElementById(BANNER_ID)) return;

  const banner = document.createElement('aside');
  banner.id = BANNER_ID;
  banner.setAttribute('role', 'status');
  banner.setAttribute('aria-label', 'Atualização do app');
  banner.className = 'bg-primary text-on-primary';
  banner.innerHTML = `
    <div class="mx-auto flex w-full max-w-2xl items-center gap-2 py-2 pl-4 pr-1">
      <p class="flex-1 text-sm font-medium">Nova versão do Cestinha disponível.</p>
      <button type="button" data-update class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-on-primary px-4 text-base font-semibold text-primary disabled:opacity-70">Atualizar</button>
      <button type="button" data-dismiss aria-label="Dispensar aviso de atualização" class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-xl text-on-primary">✕</button>
    </div>`;

  const updateButton = banner.querySelector('[data-update]');
  updateButton.addEventListener('click', () => {
    updateButton.disabled = true;
    updateButton.textContent = 'Atualizando…';
    onUpdate();
  });
  banner.querySelector('[data-dismiss]').addEventListener('click', () => banner.remove());

  document.querySelector('header').after(banner);
}
