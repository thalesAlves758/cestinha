import { html, raw } from './dom.js';
import { openSheet } from './sheet.js';
import { BTN_PRIMARY, BTN_SECONDARY, FIELD } from './buttons.js';
import { getAllTemplates, putList } from '../db.js';
import { createList, listFromTemplate } from '../model.js';
import { showToast } from './toast.js';

const BLANK = 'blank';
const DEFAULT_NAME = 'Nova lista';
const OPTION = 'flex items-center gap-3 min-h-11 px-3 py-2 rounded-lg bg-page border border-line';

function itemCountLabel(count) {
  if (count === 0) return 'Nenhum item';
  return count === 1 ? '1 item' : `${count} itens`;
}

// The sheet's own history.back() is async; navigating before it settles would pop the new entry.
function navigateAfterSheet(hash) {
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    window.removeEventListener('popstate', go);
    location.hash = hash;
  };
  window.addEventListener('popstate', go);
  setTimeout(go, 300);
}

/** Opens the "Nova lista" sheet (T02): pick a template or a blank list, confirm the name, create. */
export async function openNewListSheet() {
  let templates;
  try {
    templates = await getAllTemplates();
  } catch {
    showToast({ message: 'Não foi possível acessar o armazenamento do aparelho.' });
    return;
  }

  openSheet({
    title: 'Nova lista',
    render(body, close) {
      const uid = crypto.randomUUID();
      const nameId = `newlist-name-${uid}`;
      const hasTemplates = templates.length > 0;
      let selected = hasTemplates ? templates[0].id : BLANK;
      let nameEdited = false;
      let busy = false;

      const options = [
        ...templates.map((t) => html`
          <label class="${OPTION}">
            <input type="radio" name="source" value="${t.id}" class="size-5 shrink-0">
            <span class="flex flex-col min-w-0">
              <span class="font-medium truncate">${t.name}</span>
              <span class="text-sm text-muted">${itemCountLabel(t.items.length)}</span>
            </span>
          </label>`),
        html`
          <label class="${OPTION}">
            <input type="radio" name="source" value="${BLANK}" class="size-5 shrink-0">
            <span class="font-medium">Lista em branco</span>
          </label>`,
      ];

      body.innerHTML = html`
        <form novalidate class="flex flex-col gap-4">
          <fieldset class="flex flex-col gap-2">
            <legend class="font-medium mb-2">Começar a partir de</legend>
            ${options}
          </fieldset>
          ${raw(hasTemplates ? '' : html`
            <div class="flex flex-col items-start gap-2">
              <p class="text-muted text-sm">Você ainda não tem templates.</p>
              <button type="button" data-goto-templates class="${BTN_SECONDARY}">Criar um template</button>
            </div>`)}
          <div class="flex flex-col gap-1">
            <label for="${nameId}" class="font-medium">Nome da lista</label>
            <input id="${nameId}" name="name" type="text" autocomplete="off" aria-describedby="${nameId}-error" class="${FIELD}">
            <p id="${nameId}-error" role="alert" class="text-danger text-sm" hidden></p>
          </div>
          <button type="submit" class="${BTN_PRIMARY}">Criar</button>
        </form>`.toString();

      const form = body.querySelector('form');
      const nameInput = body.querySelector(`#${CSS.escape(nameId)}`);
      const error = body.querySelector(`#${CSS.escape(nameId)}-error`);
      const radios = [...body.querySelectorAll('input[type="radio"]')];

      const templateById = (id) => templates.find((t) => t.id === id) ?? null;
      const defaultName = () => templateById(selected)?.name ?? DEFAULT_NAME;

      radios.forEach((radio) => { radio.checked = radio.value === selected; });
      nameInput.value = defaultName();

      form.addEventListener('change', (event) => {
        if (!event.target.matches('input[type="radio"]')) return;
        selected = event.target.value;
        if (!nameEdited) nameInput.value = defaultName();
      });
      nameInput.addEventListener('input', () => {
        nameEdited = true;
        error.hidden = true;
        nameInput.removeAttribute('aria-invalid');
      });

      body.querySelector('[data-goto-templates]')?.addEventListener('click', () => {
        close();
        navigateAfterSheet('#/templates');
      });

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (busy) return;
        const name = nameInput.value.trim();
        if (!name) {
          error.textContent = 'Informe um nome.';
          error.hidden = false;
          nameInput.setAttribute('aria-invalid', 'true');
          nameInput.focus();
          return;
        }
        busy = true;
        try {
          const template = templateById(selected);
          const list = template ? listFromTemplate(template, name) : createList({ name });
          await putList(list);
          close();
          navigateAfterSheet(`#/list/${list.id}`);
        } catch {
          busy = false;
          showToast({ message: 'Não foi possível criar a lista.' });
        }
      });
    },
  });
}
