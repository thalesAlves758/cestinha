import { html, qs } from '../ui/dom.js';
import { getThemeMode, setThemeMode } from '../theme.js';

const OPTIONS = [
  { value: 'auto', label: 'Automático' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
];

export function render(container) {
  const current = getThemeMode();
  container.innerHTML = html`
    <div class="flex items-center gap-1 mb-4">
      <button type="button" data-back aria-label="Voltar" class="flex items-center justify-center w-11 h-11 -ml-2 text-xl rounded-full">←</button>
      <h2 class="text-xl font-semibold">Configurações</h2>
    </div>
    <fieldset class="mb-8">
      <legend class="mb-2 font-semibold">Tema</legend>
      <div class="grid grid-cols-3 rounded-lg border border-line bg-surface overflow-hidden">
        ${OPTIONS.map((o) => html`
          <label class="flex items-center justify-center gap-1 min-h-11 px-2 text-base cursor-pointer has-checked:bg-primary has-checked:text-on-primary has-checked:font-semibold has-focus-visible:outline-2 has-focus-visible:-outline-offset-2 has-focus-visible:outline-primary">
            <input type="radio" name="theme" value="${o.value}" class="sr-only" ${current === o.value ? 'checked' : ''}>
            <span>${o.label}</span>
          </label>`)}
      </div>
    </fieldset>
    <p class="text-sm text-muted">Versão ${self.APP_VERSION}</p>`;

  qs('[data-back]', container).addEventListener('click', () => {
    if (history.length > 1) history.back();
    else location.hash = '#/lists';
  });
  container.addEventListener('change', onChange);
  return () => container.removeEventListener('change', onChange);
}

function onChange(e) {
  if (e.target.name === 'theme') setThemeMode(e.target.value);
}
