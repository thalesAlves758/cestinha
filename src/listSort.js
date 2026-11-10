// List sort preference for the Lists screen. Stored in localStorage (UI preference, not data).
const KEY = 'cestinha.listSort';
const DEFAULT_SORT = 'newest';

export const LIST_SORTS = [
  { id: 'newest', label: 'Mais recentes' },
  { id: 'oldest', label: 'Mais antigas' },
  { id: 'updated', label: 'Alteradas por último' },
  { id: 'name', label: 'Nome A–Z' },
];

const collator = new Intl.Collator('pt-BR', { sensitivity: 'base', numeric: true });

const isValid = (id) => LIST_SORTS.some((sort) => sort.id === id);
const time = (iso) => Date.parse(iso);

export function getListSort() {
  try {
    const id = localStorage.getItem(KEY);
    return isValid(id) ? id : DEFAULT_SORT;
  } catch {
    return DEFAULT_SORT;
  }
}

export function setListSort(id) {
  if (!isValid(id)) id = DEFAULT_SORT;
  try { localStorage.setItem(KEY, id); } catch { /* storage unavailable */ }
}

/** Returns a new sorted array; never mutates `lists`. Ties fall back to createdAt, newest first. */
export function sortLists(lists, sortId) {
  const primary = {
    newest: (a, b) => time(b.createdAt) - time(a.createdAt),
    oldest: (a, b) => time(a.createdAt) - time(b.createdAt),
    updated: (a, b) => time(b.updatedAt) - time(a.updatedAt),
    name: (a, b) => collator.compare(a.name, b.name),
  }[isValid(sortId) ? sortId : DEFAULT_SORT];
  return [...lists].sort((a, b) => primary(a, b) || time(b.createdAt) - time(a.createdAt));
}
