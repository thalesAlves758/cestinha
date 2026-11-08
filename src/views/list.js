import { html, qs } from '../ui/dom.js';
import { getList, putList, deleteList } from '../db.js';
import { createItem, nextOrder } from '../model.js';
import {
  formatQuantity, formatMoney, itemSubtotalCents, listTotals, listProgress, sortItemsForDisplay,
} from '../calc.js';
import { promptText } from '../ui/prompt.js';
import { confirmDialog } from '../ui/confirm.js';
import { openActionSheet } from '../ui/actionSheet.js';
import { openItemEditor } from '../ui/itemEditor.js';
import { renderFab } from '../ui/fab.js';
import { showToast } from '../ui/toast.js';
import { BTN_PRIMARY, FIELD } from '../ui/buttons.js';

const ICON_BTN = 'inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg text-xl';

/**
 * Extension point for RF14 (suggest adding the new item to the source template).
 * Called by addItem() after every item addition (quick or via the editor), once the item
 * is already in list.items. Intentionally empty: the behavior is implemented in CARD-012.
 */
// eslint-disable-next-line no-unused-vars
function onItemAdded(list, item) {}

/** Single entry point for adding an item to a list (quick add and full editor). */
function addItem(list, data) {
  const item = { ...createItem(data, nextOrder(list.items)), checked: false };
  list.items.push(item);
  onItemAdded(list, item);
  return item;
}

function renderItem(item) {
  const priced = item.priceCents != null;
  return html`
    <li class="flex items-stretch gap-2 rounded-lg bg-surface border border-line ${item.checked ? 'text-muted' : ''}">
      <label class="flex items-center justify-center w-11 shrink-0 cursor-pointer">
        <input type="checkbox" data-check="${item.id}" ${item.checked ? 'checked' : ''} aria-label="No carrinho: ${item.name}" class="size-6 accent-primary">
      </label>
      <button type="button" data-item="${item.id}" class="flex-1 min-w-0 min-h-14 py-3 text-left">
        <span class="block font-semibold break-words ${item.checked ? 'line-through' : ''}">${item.name}</span>
        <span class="block text-sm text-muted tabular-nums ${item.checked ? 'line-through' : ''}">${formatQuantity(item.quantity, item.unit)}</span>
      </button>
      <button type="button" data-price="${item.id}" aria-label="Editar valor de ${item.name}" class="flex flex-col items-end justify-center shrink-0 min-h-14 min-w-11 pr-4 pl-1 text-sm tabular-nums">
        ${priced
          ? html`<span class="text-muted">${formatMoney(item.priceCents)}/${item.unit}</span>
                 <span class="font-semibold">${formatMoney(itemSubtotalCents(item))}</span>`
          : html`<span class="text-muted">Definir valor</span>`}
      </button>
    </li>`;
}

function renderSummary(items) {
  const { checked, total, percent } = listProgress(items);
  const { plannedCents, inCartCents } = listTotals(items);
  const done = total > 0 && checked === total;
  return html`
    <section aria-label="Resumo da lista" class="sticky top-0 z-10 -mx-4 px-4 py-3 mb-4 bg-surface border-b border-line">
      <div class="flex items-end justify-between gap-3">
        <div>
          <p class="text-sm text-muted">No carrinho</p>
          <p class="text-2xl font-bold tabular-nums">${formatMoney(inCartCents)}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-muted">Previsto</p>
          <p class="font-semibold tabular-nums">${formatMoney(plannedCents)}</p>
        </div>
      </div>
      <div role="progressbar" aria-label="Progresso da lista" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}" class="mt-2 h-2 rounded-full bg-line overflow-hidden">
        <div class="h-full bg-primary" style="width: ${percent}%"></div>
      </div>
      <p class="mt-1 text-sm tabular-nums ${done ? 'text-primary font-semibold' : 'text-muted'}">${done ? '✓ Tudo no carrinho! · ' : ''}${checked} de ${total} ${total === 1 ? 'item' : 'itens'}</p>
    </section>`;
}

export function render(container, { id } = {}) {
  let disposed = false;
  let busy = false;
  let list = null;
  let fab = null;
  let refocus = false;

  const notFound = () => {
    if (disposed) return;
    container.innerHTML = html`
      <h2 class="text-xl font-semibold mb-2">Lista não encontrada</h2>
      <a href="#/lists" class="text-primary underline inline-flex items-center min-h-11">Voltar para Listas</a>`;
  };

  const showError = () => {
    if (disposed) return;
    container.innerHTML = html`
      <p role="alert" class="text-danger mb-2">Não foi possível acessar o armazenamento do aparelho.</p>
      <a href="#/lists" class="text-primary underline inline-flex items-center min-h-11">Voltar para Listas</a>`;
  };

  // Optimistic: the UI is already updated; persist the current state and warn on failure.
  async function persist() {
    try {
      await putList(list);
    } catch {
      showToast({
        message: 'Não foi possível salvar.',
        timeout: 0,
        actions: [{ label: 'Tentar de novo', onSelect: persist }],
      });
    }
  }

  function save() {
    if (!disposed) draw();
    return persist();
  }

  function draw() {
    const items = sortItemsForDisplay(list.items);
    container.innerHTML = html`
      <header class="flex items-center gap-1 mb-4">
        <a href="#/lists" aria-label="Voltar para Listas" class="${ICON_BTN}">←</a>
        <button type="button" data-rename class="flex-1 min-h-11 px-2 text-left text-xl font-semibold break-words min-w-0">${list.name}</button>
        <button type="button" data-menu aria-label="Mais ações" class="${ICON_BTN}">⋮</button>
      </header>
      ${renderSummary(items)}
      ${items.length === 0
        ? html`<p class="text-muted mb-4">Lista vazia. Adicione o primeiro item.</p>`
        : html`<ul class="flex flex-col gap-2 mb-4">${items.map(renderItem)}</ul>`}
      <form data-quick novalidate class="flex gap-2 pb-24">
        <label for="quick-name" class="sr-only">Adicionar item</label>
        <input id="quick-name" name="name" type="text" autocomplete="off" autocapitalize="sentences" placeholder="Adicionar item" class="${FIELD} flex-1 min-w-0">
        <button type="submit" class="${BTN_PRIMARY}">Adicionar</button>
      </form>`;

    qs('[data-rename]', container).addEventListener('click', rename);
    qs('[data-menu]', container).addEventListener('click', () => openActionSheet({
      title: 'Lista',
      actions: [
        { label: 'Renomear', onSelect: rename },
        { label: 'Excluir lista', danger: true, onSelect: remove },
      ],
    }));
    container.querySelectorAll('[data-item]').forEach((button) => {
      button.addEventListener('click', () => editItem(button.dataset.item));
    });
    container.querySelectorAll('[data-check]').forEach((box) => {
      box.addEventListener('change', () => toggleChecked(box.dataset.check));
    });
    container.querySelectorAll('[data-price]').forEach((button) => {
      button.addEventListener('click', () => editItem(button.dataset.price, 'price'));
    });
    qs('[data-quick]', container).addEventListener('submit', quickAdd);
    if (refocus) {
      refocus = false;
      qs('#quick-name', container).focus();
    }
    if (fab) container.appendChild(fab);
  }

  function toggleChecked(itemId) {
    const item = list.items.find((it) => it.id === itemId);
    if (!item) return;
    item.checked = !item.checked;
    save();
  }

  function quickAdd(event) {
    event.preventDefault();
    const name = event.currentTarget.elements.name.value.trim();
    if (!name) return;
    addItem(list, { name });
    refocus = true;
    save();
  }

  async function rename() {
    if (busy) return;
    busy = true;
    try {
      const name = await promptText({ title: 'Renomear lista', label: 'Nome', value: list.name });
      if (!name || name === list.name) return;
      list.name = name;
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
        title: 'Excluir lista?',
        message: `A lista '${list.name}' será excluída. O template de origem não será afetado.`,
      });
      if (!ok) return;
      await deleteList(list.id);
      location.hash = '#/lists';
    } catch {
      showError();
    } finally {
      busy = false;
    }
  }

  function openNewItem() {
    openItemEditor({
      title: 'Novo item',
      onSave: (data) => {
        addItem(list, data);
        return save();
      },
    });
  }

  function editItem(itemId, focus = 'name') {
    const item = list.items.find((it) => it.id === itemId);
    if (!item) return;
    openItemEditor({
      item,
      focus,
      title: 'Editar item',
      onSave: (data) => {
        Object.assign(item, data);
        return save();
      },
      onDelete: () => {
        list.items = list.items.filter((it) => it.id !== itemId);
        return save();
      },
    });
  }

  container.innerHTML = html`<p class="text-muted">Carregando…</p>`;

  getList(id).then((found) => {
    if (disposed) return;
    if (!found) return notFound();
    list = found;
    fab = renderFab({ label: 'Novo item', onClick: openNewItem });
    draw();
  }).catch(showError);

  return () => {
    disposed = true;
    fab?.remove();
  };
}
