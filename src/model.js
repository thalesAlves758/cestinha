// Pure record factories (no I/O). Totals, subtotals and progress are never stored (see calc.js).

const now = () => new Date().toISOString();

export function createTemplate(name) {
  const ts = now();
  return { id: crypto.randomUUID(), name, createdAt: ts, updatedAt: ts, items: [] };
}

export function createList({ name, templateId = null, items = [] }) {
  const ts = now();
  return { id: crypto.randomUUID(), name, templateId, createdAt: ts, updatedAt: ts, items };
}

export function createItem({ name, quantity = 1, unit = 'un', priceCents = null }, order) {
  return { id: crypto.randomUUID(), name, quantity, unit, priceCents, order };
}

// RN08: the list is an independent copy; items get a new id and start unchecked.
export function listFromTemplate(template, name) {
  const items = template.items.map((item) => ({
    id: crypto.randomUUID(),
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    priceCents: item.priceCents,
    checked: false,
    order: item.order,
  }));
  return createList({ name, templateId: template.id, items });
}

export function nextOrder(items) {
  return items.length ? Math.max(...items.map((item) => item.order)) + 1 : 0;
}
