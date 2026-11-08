/** Floating "+" button, bottom-right above the tabs. Returns the element; the caller appends it. */
export function renderFab({ label, onClick }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', label);
  button.className = 'fixed right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary text-3xl shadow-lg bottom-[calc(4.5rem+env(safe-area-inset-bottom))]';
  button.textContent = '+';
  button.addEventListener('click', onClick);
  return button;
}
