import { html, qs } from '../ui/dom.js';
import { getAllTemplates, putTemplate } from '../db.js';
import { createTemplate } from '../model.js';
import { onRestored } from '../undo.js';
import { promptText } from '../ui/prompt.js';
import { renderFab } from '../ui/fab.js';
import { BTN_PRIMARY } from '../ui/buttons.js';

function itemCountLabel(count) {
  if (count === 0) return 'Nenhum item';
  return count === 1 ? '1 item' : `${count} itens`;
}

function renderCard(template) {
  return html`
    <li>
      <a href="#/template/${template.id}" class="flex flex-col justify-center min-h-14 px-4 py-3 rounded-lg bg-surface border border-line">
        <span class="font-semibold">${template.name}</span>
        <span class="text-sm text-muted">${itemCountLabel(template.items.length)}</span>
      </a>
    </li>`;
}

export function render(container) {
  let disposed = false;
  let busy = false;

  const fab = renderFab({ label: 'Novo template', onClick: create });

  async function create() {
    if (busy) return;
    busy = true;
    try {
      const name = await promptText({ title: 'Novo template', label: 'Nome' });
      if (!name) return;
      const template = createTemplate(name);
      await putTemplate(template);
      location.hash = `#/template/${template.id}`;
    } catch {
      showError();
    } finally {
      busy = false;
    }
  }

  function showError() {
    if (disposed) return;
    container.innerHTML = html`
      <h2 class="text-xl font-semibold mb-4">Templates</h2>
      <p role="alert" class="text-danger">Não foi possível acessar o armazenamento do aparelho.</p>`;
  }

  container.innerHTML = html`
    <h2 class="text-xl font-semibold mb-4">Templates</h2>
    <p class="text-muted">Carregando…</p>`;

  function load() {
    return getAllTemplates().then((templates) => {
      if (disposed) return;
      if (templates.length === 0) {
        container.innerHTML = html`
          <h2 class="text-xl font-semibold mb-4">Templates</h2>
          <p class="text-muted mb-4">Templates são suas listas padrão: os itens de sempre, prontos para virar a lista do dia.</p>
          <button type="button" data-create class="${BTN_PRIMARY}">Criar template</button>`;
        qs('[data-create]', container).addEventListener('click', create);
      } else {
        container.innerHTML = html`
          <h2 class="text-xl font-semibold mb-4">Templates</h2>
          <ul class="flex flex-col gap-2 pb-24">${templates.map(renderCard)}</ul>`;
      }
      container.appendChild(fab);
    }).catch(showError);
  }

  load();
  const offRestored = onRestored(load);

  return () => {
    disposed = true;
    offRestored();
    fab.remove();
  };
}
