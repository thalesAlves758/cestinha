const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

/**
 * Template tag that escapes every interpolation.
 * Wrap already-safe fragments with `raw()` to skip escaping; arrays are joined.
 */
export class SafeHtml {
  constructor(value) { this.value = value; }
  toString() { return this.value; }
}

export function raw(value) {
  return new SafeHtml(String(value));
}

function stringify(value) {
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(stringify).join('');
  return escapeHtml(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((value, i) => {
    out += stringify(value) + strings[i + 1];
  });
  return new SafeHtml(out);
}

export function qs(selector, root = document) {
  return root.querySelector(selector);
}
