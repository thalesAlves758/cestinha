import { html, qs } from '../ui/dom.js';
import { getThemeMode, setThemeMode } from '../theme.js';
import { BTN_PRIMARY, BTN_SECONDARY } from '../ui/buttons.js';
import { getAllTemplates, getAllLists } from '../db.js';
import {
  buildBackup, createBackupFile, shareOrDownload,
  getLastBackup, setLastBackup, formatLastBackup,
  parseBackup, migrateBackup, importBackup,
} from '../backup.js';
import { confirmDialog } from '../ui/confirm.js';
import { showToast } from '../ui/toast.js';
import { formatShortDate } from '../calc.js';

const OPTIONS = [
  { value: 'auto', label: 'Automático' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
];

export function render(container) {
  const current = getThemeMode();
  // Column layout so `mt-auto` pins the version to the bottom. Removed in cleanup: #view is shared.
  container.classList.add('flex', 'flex-col');
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
    <section data-backup class="mb-8"></section>
    <p class="mt-auto pb-[env(safe-area-inset-bottom)] text-sm text-muted">Versão ${self.APP_VERSION}</p>`;

  qs('[data-back]', container).addEventListener('click', () => {
    if (history.length > 1) history.back();
    else location.hash = '#/lists';
  });
  container.addEventListener('change', onChange);

  // Backup section. The File is built when the data loads, so the tap handler can call
  // share/download with no await before it (WebKit requires the user gesture).
  const section = qs('[data-backup]', container);
  let disposed = false;
  let loaded = false;
  let hasData = false;
  let file = null;
  let failed = false;
  let importError = '';
  let lastBackup = getLastBackup();

  function drawBackup() {
    if (disposed) return;
    const canExport = loaded && hasData && !!file;
    section.innerHTML = html`
      <h3 class="mb-2 font-semibold">Backup</h3>
      <p class="mb-3">Último backup: ${formatLastBackup(lastBackup)}</p>
      <div class="flex flex-col gap-3">
        <button type="button" data-export class="${BTN_PRIMARY} w-full disabled:opacity-50" ${canExport ? '' : 'disabled'}>Exportar dados</button>
        <button type="button" data-import class="${BTN_SECONDARY} w-full">Importar dados</button>
      </div>
      <input type="file" data-import-file accept=".json,application/json" hidden>
      ${loaded && !hasData && !failed ? html`<p class="mt-2 text-sm text-muted">Nada para exportar ainda</p>` : ''}
      ${failed ? html`<p role="alert" class="mt-2 text-danger">Não foi possível exportar. Tente de novo.</p>` : ''}
      ${importError ? html`<p role="alert" class="mt-2 text-danger">${importError}</p>` : ''}
      <p class="mt-2 text-sm text-muted">Importar substitui todos os dados deste aparelho.</p>`;
  }

  function onExport() {
    if (!file) return;
    // No await before this call: keeps the user gesture for navigator.share on iOS.
    shareOrDownload(file).then((result) => {
      if (result === 'cancelled') return;
      setLastBackup(new Date());
      lastBackup = getLastBackup() ?? new Date();
      failed = false;
      drawBackup();
    }, () => {
      failed = true;
      drawBackup();
    });
  }

  async function onImportFile(input) {
    const chosen = input.files?.[0];
    if (!chosen) return;
    importError = '';
    try {
      let text;
      try { text = await chosen.text(); } catch { text = ''; }
      const parsed = parseBackup(text);
      if (!parsed.ok) {
        importError = IMPORT_ERRORS[parsed.error] ?? IMPORT_ERRORS.invalid;
        return;
      }
      const { backup } = parsed;
      const [templates, lists] = await Promise.all([getAllTemplates(), getAllLists()]);
      const confirmed = await confirmDialog({
        title: 'Substituir os dados?',
        message: confirmMessage(backup, templates.length, lists.length),
        confirmLabel: 'Substituir',
        danger: true,
      });
      if (!confirmed) return;
      try {
        await importBackup(await migrateBackup(backup));
      } catch {
        importError = 'Não foi possível importar. Tente de novo.';
        return;
      }
      location.hash = '#/lists';
      showToast({ message: 'Backup importado' });
    } catch {
      importError = 'Não foi possível importar. Tente de novo.';
    } finally {
      input.value = ''; // lets the same file be chosen again
      drawBackup();
    }
  }

  section.addEventListener('click', (e) => {
    if (e.target.closest('[data-export]')) onExport();
    // input.click() straight from the tap: WebKit requires the user gesture.
    else if (e.target.closest('[data-import]')) qs('[data-import-file]', section).click();
  });
  section.addEventListener('change', (e) => {
    if (e.target.matches('[data-import-file]')) onImportFile(e.target);
  });

  drawBackup();
  Promise.all([getAllTemplates(), getAllLists()]).then(([templates, lists]) => {
    if (disposed) return;
    hasData = templates.length + lists.length > 0;
    if (hasData) file = createBackupFile(buildBackup({ templates, lists }), new Date());
    loaded = true;
    drawBackup();
  }).catch(() => {
    if (disposed) return;
    loaded = true;
    failed = true;
    drawBackup();
  });

  return () => {
    disposed = true;
    container.removeEventListener('change', onChange);
    container.classList.remove('flex', 'flex-col');
  };
}

const IMPORT_ERRORS = {
  'not-cestinha': 'Este arquivo não é um backup do Cestinha.',
  invalid: 'O backup está com problema e não foi importado.',
  'too-new': 'Este backup é de uma versão mais nova do Cestinha. Atualize o app e tente de novo.',
};

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function confirmMessage(backup, deviceTemplates, deviceLists) {
  const exported = new Date(backup.exportedAt);
  const when = typeof backup.exportedAt === 'string' && !Number.isNaN(exported.getTime())
    ? formatShortDate(exported) : 'data desconhecida';
  const contents = `${plural(backup.templates.length, 'template', 'templates')} e ${plural(backup.lists.length, 'lista', 'listas')}`;
  const current = deviceTemplates + deviceLists === 0
    ? 'Este aparelho não tem dados.'
    : `Os ${plural(deviceTemplates, 'template', 'templates')} e ${plural(deviceLists, 'lista', 'listas')} deste aparelho serão apagados.`;
  return `Backup de ${when}, com ${contents}. ${current} Isso não pode ser desfeito.`;
}

function onChange(e) {
  if (e.target.name === 'theme') setThemeMode(e.target.value);
}
