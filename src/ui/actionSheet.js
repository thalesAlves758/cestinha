import { html, raw } from './dom.js';
import { openSheet } from './sheet.js';
import { BTN_SECONDARY, BTN_DANGER } from './buttons.js';

/**
 * Action menu as a bottom sheet. `onSelect` runs after the sheet has closed.
 * If any action sets `selected`, every button gets a fixed-width check column (the selected one shows ✓).
 */
export function openActionSheet({ title, actions }) {
  const hasSelection = actions.some((action) => action.selected !== undefined);
  return openSheet({
    title,
    render(body, close) {
      body.innerHTML = html`
        <div class="flex flex-col gap-2">
          ${actions.map((action, i) => html`
            <button type="button" data-action="${i}"${action.selected ? raw(' aria-current="true"') : ''} class="${action.danger ? BTN_DANGER : BTN_SECONDARY} w-full justify-start">${hasSelection ? html`<span aria-hidden="true" class="w-6 shrink-0 text-left">${action.selected ? '✓' : ''}</span>` : ''}${action.label}</button>`)}
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
