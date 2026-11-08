import { html, qs } from '../ui/dom.js';
import { getAllLists, putList, deleteList } from '../db.js';
import { listProgress, listTotals, formatMoney } from '../calc.js';
import { promptText } from '../ui/prompt.js';
import { confirmDialog } from '../ui/confirm.js';
import { openActionSheet } from '../ui/actionSheet.js';
import { showToast } from '../ui/toast.js';
import { renderFab } from '../ui/fab.js';
import { BTN_PRIMARY, BTN_SECONDARY } from '../ui/buttons.js';
import { openNewListSheet } from '../ui/newListSheet.js';

const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

function plannedLabel(items) {
  const hasPrice = items.some((item) => item.priceCents != null);
  return hasPrice ? formatMoney(listTotals(items).plannedCents) : '—';
}

function renderCard(list) {
  const { checked, total, percent } = listProgress(list.items);
  return html`
    <li class="flex items-stretch rounded-lg bg-surface border border-line">
      <a href="#/list/${list.id}" class="flex-1 min-w-0 flex flex-col gap-2 min-h-14 pl-4 py-3">
        <span class="flex items-baseline justify-between gap-2">
          <span class="font-semibold truncate">${list.name}</span>
          <span class="text-sm text-muted shrink-0">${dateFormat.format(new Date(list.createdAt))}</span>
        </span>
        <span class="block h-2 rounded-full bg-page border border-line overflow-hidden" role="progressbar" aria-label="Progresso" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
          <span class="block h-full bg-primary" style="width: ${percent}%"></span>
        </span>
        <span class="flex justify-between gap-2 text-sm tabular-nums">
          <span>${checked}/${total}</span>
          <span><span class="text-muted">Previsto </span>${plannedLabel(list.items)}</span>
        </span>
      </a>
      <button type="button" data-menu="${list.id}" aria-label="Opções de ${list.name}" class="min-h-11 min-w-11 px-3 text-xl text-muted">⋮</button>
    </li>`;
}

const TITLE = html`<h2 class="text-xl font-semibold mb-4">Listas</h2>`;

export function render(container) {
  let disposed = false;
  let lists = [];

  const fab = renderFab({ label: 'Nova lista', onClick: openNewListSheet });

  function showError() {
    if (disposed) return;
    container.innerHTML = html`
      ${TITLE}
      <p role="alert" class="text-danger">Não foi possível acessar o armazenamento do aparelho.</p>`;
  }

  function draw() {
    if (disposed) return;
    if (lists.length === 0) {
      container.innerHTML = html`
        ${TITLE}
        <p class="text-muted mb-4">Nenhuma lista ainda. Crie um template com seus itens de sempre ou comece uma lista em branco.</p>
        <div class="flex flex-wrap gap-3">
          <a href="#/templates" class="${BTN_SECONDARY}">Criar template</a>
          <button type="button" data-new class="${BTN_PRIMARY}">Nova lista</button>
        </div>`;
      qs('[data-new]', container).addEventListener('click', openNewListSheet);
    } else {
      container.innerHTML = html`
        ${TITLE}
        <ul class="flex flex-col gap-2 pb-24">${lists.map(renderCard)}</ul>`;
    }
    container.appendChild(fab);
  }

  async function load() {
    try {
      lists = await getAllLists();
      draw();
    } catch {
      showError();
    }
  }

  async function rename(list) {
    try {
      const name = await promptText({ title: 'Renomear lista', label: 'Nome', value: list.name });
      if (!name || name === list.name) return;
      await putList({ ...list, name });
      await load();
    } catch {
      showToast({ message: 'Não foi possível salvar.' });
    }
  }

  async function remove(list) {
    try {
      const ok = await confirmDialog({
        title: 'Excluir lista',
        message: `Excluir "${list.name}"? Esta ação não pode ser desfeita.`,
      });
      if (!ok) return;
      await deleteList(list.id);
      await load();
    } catch {
      showToast({ message: 'Não foi possível excluir.' });
    }
  }

  const onClick = (event) => {
    const button = event.target.closest('[data-menu]');
    if (!button) return;
    const list = lists.find((l) => l.id === button.dataset.menu);
    if (!list) return;
    openActionSheet({
      title: list.name,
      actions: [
        { label: 'Renomear', onSelect: () => rename(list) },
        { label: 'Excluir', danger: true, onSelect: () => remove(list) },
      ],
    });
  };
  container.addEventListener('click', onClick);

  container.innerHTML = html`
    ${TITLE}
    <ul class="flex flex-col gap-2" aria-busy="true" aria-label="Carregando">
      ${[0, 1, 2].map(() => html`<li class="h-24 rounded-lg bg-surface border border-line animate-pulse"></li>`)}
    </ul>`;
  load();

  return () => {
    disposed = true;
    container.removeEventListener('click', onClick);
    fab.remove();
  };
}
