import { html } from './dom.js';
import { BTN_SECONDARY } from './buttons.js';

/**
 * Bottom sheet built on <dialog>.
 * The Android back button closes the top sheet: opening pushes a history entry
 * (same URL, so the hash router is not triggered); closing by any other means
 * consumes that entry with history.back().
 */

const stack = [];        // open sheets, top is last
let pendingBacks = 0;    // history.back() calls whose popstate has not arrived yet
let waiting = [];        // pushState calls deferred until pending backs settle

function pushEntry(sheet) {
  history.pushState({ sheet: true }, '');
  sheet.pushed = true;
}

window.addEventListener('popstate', () => {
  if (pendingBacks > 0) {
    pendingBacks -= 1;
    if (pendingBacks === 0) {
      const queued = waiting;
      waiting = [];
      queued.forEach((fn) => fn());
    }
    return;
  }
  const top = stack[stack.length - 1];
  if (top) top.finish({ fromHistory: true });
});

const DIALOG_CLASS = [
  'fixed inset-x-0 bottom-0 top-auto mx-auto my-0 w-full max-w-2xl max-h-[90dvh] overflow-y-auto overscroll-contain',
  'rounded-t-2xl bg-surface text-ink p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]',
  'backdrop:bg-black/50',
].join(' ');

export function openSheet({ title, render, onClose }) {
  const origin = document.activeElement;
  const dialog = document.createElement('dialog');
  dialog.className = DIALOG_CLASS;
  const titleId = `sheet-title-${crypto.randomUUID()}`;
  dialog.setAttribute('aria-labelledby', titleId);
  dialog.innerHTML = html`
    <div class="flex items-center justify-between gap-2 mb-3">
      <h2 id="${titleId}" class="text-lg font-semibold">${title}</h2>
      <button type="button" data-sheet-close class="${BTN_SECONDARY}">Fechar</button>
    </div>
    <div data-sheet-body></div>`.toString();
  const bodyEl = dialog.querySelector('[data-sheet-body]');

  const sheet = { dialog, pushed: false, closed: false };

  function fitViewport() {
    const vv = window.visualViewport;
    if (!vv) return;
    dialog.style.maxHeight = `${Math.round(vv.height * 0.9)}px`;
    dialog.style.bottom = `${Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop))}px`;
  }
  function onFocusIn(event) {
    const el = event.target;
    if (el instanceof HTMLElement && el.matches('input, textarea, select')) {
      setTimeout(() => el.scrollIntoView({ block: 'nearest' }), 300);
    }
  }

  sheet.finish = ({ fromHistory = false } = {}) => {
    if (sheet.closed) return;
    sheet.closed = true;
    const i = stack.indexOf(sheet);
    if (i !== -1) stack.splice(i, 1);
    window.visualViewport?.removeEventListener('resize', fitViewport);
    window.visualViewport?.removeEventListener('scroll', fitViewport);
    dialog.removeEventListener('focusin', onFocusIn);
    if (dialog.open) dialog.close();
    dialog.remove();
    if (sheet.pushed && !fromHistory) {
      pendingBacks += 1;
      history.back();
    }
    if (origin instanceof HTMLElement && origin.isConnected) origin.focus();
    onClose?.();
  };
  const close = () => sheet.finish();

  dialog.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
  dialog.querySelector('[data-sheet-close]').addEventListener('click', close);
  dialog.addEventListener('focusin', onFocusIn);

  document.body.append(dialog);
  stack.push(sheet);
  render(bodyEl, close);
  dialog.showModal();
  fitViewport();
  window.visualViewport?.addEventListener('resize', fitViewport);
  window.visualViewport?.addEventListener('scroll', fitViewport);

  if (pendingBacks > 0) waiting.push(() => { if (!sheet.closed) pushEntry(sheet); });
  else pushEntry(sheet);

  const first = bodyEl.querySelector('[autofocus], input, textarea, select') || bodyEl.querySelector('button');
  (first || dialog.querySelector('[data-sheet-close]')).focus();

  return { close };
}
