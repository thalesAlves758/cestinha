// Shared button/field class strings (complete strings so the Tailwind scanner sees them).
const BASE = 'inline-flex items-center justify-center min-h-11 min-w-11 px-4 rounded-lg font-semibold text-base';

export const BTN_PRIMARY = `${BASE} bg-primary text-on-primary`;
export const BTN_SECONDARY = `${BASE} bg-surface text-ink border border-line`;
export const BTN_DANGER = `${BASE} bg-surface text-danger border-2 border-danger`;
export const FIELD = 'w-full min-h-11 px-3 rounded-lg bg-page text-ink border border-line text-base';
