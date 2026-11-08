import { html } from './dom.js';
import { openSheet } from './sheet.js';
import { BTN_SECONDARY, BTN_DANGER } from './buttons.js';

/** Action menu as a bottom sheet. `onSelect` runs after the sheet has closed. */
export function openActionSheet({ title, actions }) {
  return openSheet({
    title,
    render(body, close) {
      body.innerHTML = html`
        <div class="flex flex-col gap-2">
          ${actions.map((action, i) => html`
            <button type="button" data-action="${i}" class="${action.danger ? BTN_DANGER : BTN_SECONDARY} w-full justify-start">${action.label}</button>`)}
        </div>`.toString();
      body.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) return;
        const action = actions[Number(button.dataset.action)];
        close();
        action.onSelect?.();
      });
    },
  });
}
