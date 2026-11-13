// Immediate deletion with a single-level "Desfazer" (RF23, RN19).
import {
  deleteList, deleteTemplate, restoreList, restoreTemplate,
  getList, getTemplate, putList, putTemplate,
} from './db.js';
import { showToast } from './ui/toast.js';

export const RESTORED_EVENT = 'cestinha:restored';
const UNDO_TIMEOUT = 6000;

export function notifyRestored() {
  window.dispatchEvent(new CustomEvent(RESTORED_EVENT));
}

/** Registers a listener for restores; returns the function that removes it. */
export function onRestored(fn) {
  window.addEventListener(RESTORED_EVENT, fn);
  return () => window.removeEventListener(RESTORED_EVENT, fn);
}

function offerUndo(message, restore) {
  showToast({
    message,
    timeout: UNDO_TIMEOUT,
    actions: [{
      label: 'Desfazer',
      onSelect: async () => {
        try {
          await restore();
          notifyRestored();
        } catch {
          showToast({ message: 'Não foi possível desfazer.' });
        }
      },
    }],
  });
}

export async function deleteListWithUndo(list) {
  const copy = structuredClone(list);
  await deleteList(list.id);
  offerUndo(`Lista "${copy.name}" excluída`, () => restoreList(copy));
}

export async function deleteTemplateWithUndo(template) {
  const copy = structuredClone(template);
  await deleteTemplate(template.id);
  offerUndo(`Template "${copy.name}" excluído`, () => restoreTemplate(copy));
}

/** Call after the view already removed the item and saved the owner. */
export function offerItemUndo({ owner, ownerId, item }) {
  const copy = structuredClone(item);
  const get = owner === 'list' ? getList : getTemplate;
  const put = owner === 'list' ? putList : putTemplate;
  offerUndo(`"${copy.name}" excluído`, async () => {
    const record = await get(ownerId);
    if (!record || record.items.some((it) => it.id === copy.id)) return;
    record.items.push(copy);
    await put(record);
  });
}
