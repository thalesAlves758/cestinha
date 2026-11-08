// Theme: 'auto' | 'light' | 'dark'. Stored in localStorage.
// NOTE: the key 'cestinha.theme' is duplicated in the inline <head> script of index.html; keep both in sync.
const KEY = 'cestinha.theme';
const MODES = ['auto', 'light', 'dark'];
const DARK_QUERY = '(prefers-color-scheme: dark)';
// Match the header surface token so the Android status bar blends in.
const THEME_COLORS = { light: '#FFFFFF', dark: '#18201C' };

export function getThemeMode() {
  try {
    const mode = localStorage.getItem(KEY);
    return MODES.includes(mode) ? mode : 'auto';
  } catch {
    return 'auto';
  }
}

export function setThemeMode(mode) {
  if (!MODES.includes(mode)) mode = 'auto';
  try { localStorage.setItem(KEY, mode); } catch { /* storage unavailable */ }
  applyTheme();
}

export function applyTheme() {
  const mode = getThemeMode();
  const dark = mode === 'dark' || (mode === 'auto' && matchMedia(DARK_QUERY).matches);
  document.documentElement.classList.toggle('dark', dark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? THEME_COLORS.dark : THEME_COLORS.light);
}

// Follows system changes; only acts while the mode is 'auto'.
export function watchSystemTheme() {
  matchMedia(DARK_QUERY).addEventListener('change', () => {
    if (getThemeMode() === 'auto') applyTheme();
  });
}
