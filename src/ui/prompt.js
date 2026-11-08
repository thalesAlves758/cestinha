import { html } from './dom.js';
import { openSheet } from './sheet.js';
import { BTN_PRIMARY, FIELD } from './buttons.js';

/** Asks for a required name (RN11). Resolves with the trimmed text, or null if cancelled. */
export function promptText({ title, label, value = '', confirmLabel = 'Salvar' }) {
  return new Promise((resolve) => {
    let result = null;
    openSheet({
      title,
      onClose: () => resolve(result),
      render(body, close) {
        const id = `prompt-${crypto.randomUUID()}`;
        body.innerHTML = html`
          <form novalidate class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <label for="${id}" class="font-medium">${label}</label>
              <input id="${id}" name="text" type="text" autocomplete="off" aria-describedby="${id}-error" value="${value}" class="${FIELD}">
              <p id="${id}-error" role="alert" class="text-danger text-sm" hidden></p>
            </div>
            <button type="submit" class="${BTN_PRIMARY}">${confirmLabel}</button>
          </form>`.toString();

        const form = body.querySelector('form');
        const input = body.querySelector('input');
        const error = body.querySelector('p');
        input.select();

        input.addEventListener('input', () => {
          error.hidden = true;
          input.removeAttribute('aria-invalid');
        });
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          const text = input.value.trim();
          if (!text) {
            error.textContent = 'Informe um nome.';
            error.hidden = false;
            input.setAttribute('aria-invalid', 'true');
            input.focus();
            return;
          }
          result = text;
          close();
        });
      },
    });
  });
}
