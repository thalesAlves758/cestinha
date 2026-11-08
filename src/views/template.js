import { html, qs } from '../ui/dom.js';
import { getTemplate, putTemplate, deleteTemplate } from '../db.js';
import { createItem, nextOrder } from '../model.js';
import { formatQuantity, formatMoney } from '../calc.js';
import { promptText } from '../ui/prompt.js';
import { confirmDialog } from '../ui/confirm.js';
import { openActionSheet } from '../ui/actionSheet.js';
import { openItemEditor } from '../ui/itemEditor.js';
import { renderFab } from '../ui/fab.js';

const ICON_BTN = 'inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg text-xl';

function renderItem(item) {
  const price = item.priceCents == null ? '' : `${formatMoney(item.priceCents)}/${item.unit}`;
  return html`
    <li>
      <button type="button" data-item="${item.id}" class="flex w-full items-center justify-between gap-3 min-h-14 px-4 py-3 rounded-lg bg-surface border border-line text-left">
        <span class="font-semibold break-words min-w-0">${item.name}</span>
        <span class="flex flex-col items-end text-sm text-muted tabular-nums shrink-0">
          <span>${formatQuantity(item.quantity, item.unit)}</span>
          ${price ? html`<span>${price}</span>` : ''}
        </span>
      </button>
    </li>`;
}

export function render(container, { id } = {}) {
  let disposed = false;
  let busy = false;
  let template = null;
  let fab = null;

  const notFound = () => {
    if (disposed) return;
    container.innerHTML = html`
      <h2 class="text-xl font-semibold mb-2">Template não encontrado</h2>
      <a href="#/templates" class="text-primary underline inline-flex items-center min-h-11">Voltar para Templates</a>`;
  };

  const showError = () => {
    if (disposed) return;
    container.innerHTML = html`
      <p role="alert" class="text-danger mb-2">Não foi possível acessar o armazenamento do aparelho.</p>
      <a href="#/templates" class="text-primary underline inline-flex items-center min-h-11">Voltar para Templates</a>`;
  };

  async function save() {
    await putTemplate(template);
    if (!disposed) draw();
  }

  function draw() {
    const items = [...template.items].sort((a, b) => a.order - b.order);
    container.innerHTML = html`
      <header class="flex items-center gap-1 mb-4">
        <a href="#/templates" aria-label="Voltar para Templates" class="${ICON_BTN}">←</a>
        <button type="button" data-rename class="flex-1 min-h-11 px-2 text-left text-xl font-semibold break-words min-w-0">${template.name}</button>
        <button type="button" data-menu aria-label="Mais ações" class="${ICON_BTN}">⋮</button>
      </header>
      ${items.length === 0
        ? html`<p class="text-muted">Adicione os itens que você compra sempre.</p>`
        : html`<ul class="flex flex-col gap-2 pb-24">${items.map(renderItem)}</ul>`}`;

    qs('[data-rename]', container).addEventListener('click', rename);
    qs('[data-menu]', container).addEventListener('click', () => openActionSheet({
      title: 'Template',
      actions: [
        { label: 'Renomear', onSelect: rename },
        { label: 'Excluir template', danger: true, onSelect: remove },
      ],
    }));
    container.querySelectorAll('[data-item]').forEach((button) => {
      button.addEventListener('click', () => editItem(button.dataset.item));
    });
    if (fab) container.appendChild(fab);
  }

  async function rename() {
    if (busy) return;
    busy = true;
    try {
      const name = await promptText({ title: 'Renomear template', label: 'Nome', value: template.name });
      if (!name || name === template.name) return;
      template.name = name;
      await save();
    } catch {
      showError();
    } finally {
      busy = false;
    }
  }

  async function remove() {
    if (busy) return;
    busy = true;
    try {
      const ok = await confirmDialog({
        title: 'Excluir template?',
        message: `O template '${template.name}' será excluído. Listas já criadas a partir dele não serão afetadas.`,
      });
      if (!ok) return;
      await deleteTemplate(template.id);
      location.hash = '#/templates';
    } catch {
      showError();
    } finally {
      busy = false;
    }
  }

  function addItem() {
    openItemEditor({
      title: 'Novo item',
      onSave: async (data) => {
        template.items.push(createItem(data, nextOrder(template.items)));
        await save();
      },
    });
  }

  function editItem(itemId) {
    const item = template.items.find((it) => it.id === itemId);
    if (!item) return;
    openItemEditor({
      item,
      title: 'Editar item',
      onSave: async (data) => {
        Object.assign(item, data);
        await save();
      },
      onDelete: async () => {
        template.items = template.items.filter((it) => it.id !== itemId);
        await save();
      },
    });
  }

  container.innerHTML = html`<p class="text-muted">Carregando…</p>`;

  getTemplate(id).then((found) => {
    if (disposed) return;
    if (!found) return notFound();
    template = found;
    fab = renderFab({ label: 'Novo item', onClick: addItem });
    draw();
  }).catch(showError);

  return () => {
    disposed = true;
    fab?.remove();
  };
}
