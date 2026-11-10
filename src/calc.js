// Pure functions: totals, progress, pt-BR formatting/parsing, name normalization.
// Totals and progress are always computed from items, never stored.

const moneyFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const quantityFormat = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
});
const shortDateFormat = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

/** Subtotal in cents, or null when the item has no price. */
export function itemSubtotalCents(item) {
  if (item.priceCents == null) return null;
  return Math.round(item.quantity * item.priceCents);
}

/** plannedCents: all priced items; inCartCents: checked priced items. */
export function listTotals(items) {
  let plannedCents = 0;
  let inCartCents = 0;
  for (const item of items) {
    const subtotal = itemSubtotalCents(item);
    if (subtotal === null) continue;
    plannedCents += subtotal;
    if (item.checked) inCartCents += subtotal;
  }
  return { plannedCents, inCartCents };
}

/** Checked / all items (items without price count too). 0% for an empty list. */
export function listProgress(items) {
  const total = items.length;
  const checked = items.filter((item) => item.checked).length;
  const percent = total === 0 ? 0 : Math.round((checked / total) * 100);
  return { checked, total, percent };
}

/** Display order (RN14): unchecked by `order` asc, then checked by `order` asc. Returns a new array. */
export function sortItemsForDisplay(items) {
  const byOrder = (a, b) => a.order - b.order;
  return [
    ...items.filter((item) => !item.checked).sort(byOrder),
    ...items.filter((item) => item.checked).sort(byOrder),
  ];
}

/** 123456 -> 'R$ 1.234,56' (Intl uses a non-breaking space after 'R$'). */
export function formatMoney(cents) {
  return moneyFormat.format(cents / 100);
}

/** (1.5, 'kg') -> '1,5 kg'; up to 3 decimals, no trailing zeros. */
export function formatQuantity(quantity, unit) {
  return `${quantityFormat.format(quantity)} ${unit}`;
}

/** new Date(2026, 2, 5) -> '05/03/2026' (local time zone). */
export function formatShortDate(date) { return shortDateFormat.format(date); }

/**
 * Parses a user-typed non-negative decimal. Accepts ',' or '.' as separator;
 * thousands separators are not supported.
 * @returns {{ok: true, value: number} | {ok: false, reason: 'empty'|'invalid'|'too_many_decimals'}}
 */
export function parseDecimal(text, { maxDecimals = 3 } = {}) {
  const trimmed = String(text ?? '').trim();
  if (trimmed === '') return { ok: false, reason: 'empty' };
  const match = /^(\d*)(?:[.,](\d*))?$/.exec(trimmed);
  if (!match || (match[1] === '' && !match[2])) return { ok: false, reason: 'invalid' };
  const decimals = match[2] ?? '';
  if (decimals.length > maxDecimals) return { ok: false, reason: 'too_many_decimals' };
  return { ok: true, value: Number(`${match[1] || '0'}.${decimals || '0'}`) };
}

/** '' -> {ok, value: null}; '12,9' -> {ok, value: 1290}. Max 2 decimals. */
export function parsePriceToCents(text) {
  if (String(text ?? '').trim() === '') return { ok: true, value: null };
  const result = parseDecimal(text, { maxDecimals: 2 });
  if (!result.ok) return result;
  return { ok: true, value: Math.round(result.value * 100) };
}

/** 1290 -> '12,90' (to fill an input); null -> ''. */
export function centsToInput(cents) {
  if (cents == null) return '';
  return (cents / 100).toFixed(2).replace('.', ',');
}

/** Case-, accent- and whitespace-insensitive form of a name (RN10). */
export function normalizeName(name) {
  return String(name ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}
