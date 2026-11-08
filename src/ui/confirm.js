import { html } from './dom.js';
import { openSheet } from './sheet.js';
import { BTN_PRIMARY, BTN_SECONDARY, BTN_DANGER } from './buttons.js';

/** Resolves true only when the confirm button is pressed. */
export function confirmDialog({ title, message, confirmLabel = 'Excluir', danger = true }) {
  return new Promise((resolve) => {
    let result = false;
    openSheet({
      title,
      onClose: () => resolve(result),
      render(body, close) {
        body.innerHTML = html`
          <p class="mb-4">${message}</p>
          <div class="grid grid-cols-2 gap-3">
            <button type="button" data-cancel class="${BTN_SECONDARY}">Cancelar</button>
            <button type="button" data-confirm class="${danger ? BTN_DANGER : BTN_PRIMARY}">${confirmLabel}</button>
          </div>`.toString();
        body.querySelector('[data-cancel]').addEventListener('click', close);
        body.querySelector('[data-confirm]').addEventListener('click', () => {
          result = true;
          close();
        });
      },
    });
  });
}
