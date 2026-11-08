import { BTN_SECONDARY } from './buttons.js';

let region = null;
let current = null;

// The live region exists before any message is inserted so screen readers announce it.
function getRegion() {
  if (!region) {
    region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.className = 'pointer-events-none fixed inset-x-0 z-20 flex justify-center px-4 bottom-[calc(9rem+env(safe-area-inset-bottom))]';
    document.body.append(region);
  }
  return region;
}

/** Non-blocking notice; a new one replaces the previous. Actions: [{ label, onSelect }]. */
export function showToast({ message, actions = [], timeout = 6000 }) {
  current?.dismiss();

  const el = document.createElement('div');
  el.className = 'pointer-events-auto flex w-full max-w-md flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface p-3 text-ink shadow-lg';
  const text = document.createElement('p');
  text.className = 'flex-1 min-w-40';
  text.textContent = message;
  el.append(text);

  let timer = null;
  const toast = {
    dismiss() {
      if (current !== toast) return;
      clearTimeout(timer);
      el.remove();
      current = null;
    },
  };

  for (const action of actions) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = BTN_SECONDARY;
    button.textContent = action.label;
    button.addEventListener('click', () => {
      toast.dismiss();
      action.onSelect?.();
    });
    el.append(button);
  }

  getRegion().append(el);
  current = toast;
  if (timeout > 0) timer = setTimeout(toast.dismiss, timeout);
  return toast;
}
