// Manual backup (RF20): build the export file, share/download it, track the last backup date.
import { getThemeMode } from './theme.js';
import { getListSort } from './listSort.js';
import { formatShortDate } from './calc.js';

export const BACKUP_VERSION = 1;
// Last backup date (ISO). Device-local: not part of the backup file and not changed by import.
const LAST_BACKUP_KEY = 'cestinha.lastBackup';

export function buildBackup({ templates, lists }) {
  return {
    app: 'cestinha',
    backupVersion: BACKUP_VERSION,
    appVersion: self.APP_VERSION,
    exportedAt: new Date().toISOString(),
    preferences: { theme: getThemeMode(), listSort: getListSort() },
    templates,
    lists,
  };
}

const pad = (n) => String(n).padStart(2, '0');

/** Local date (not UTC): cestinha-backup-YYYY-MM-DD.json */
export function backupFileName(date) {
  return `cestinha-backup-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.json`;
}

export function createBackupFile(backup, date) {
  return new File([JSON.stringify(backup, null, 2)], backupFileName(date), { type: 'application/json' });
}

/**
 * Resolves 'shared' | 'downloaded' | 'cancelled'.
 * Must be called straight from the tap handler (no await before it): WebKit requires the user gesture.
 */
export async function shareOrDownload(file) {
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Backup do Cestinha' });
      return 'shared';
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled';
      // Any other failure: fall back to download.
    }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  return 'downloaded';
}

export function getLastBackup() {
  try {
    const iso = localStorage.getItem(LAST_BACKUP_KEY);
    if (!iso) return null;
    const date = new Date(iso);
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

export function setLastBackup(date) {
  try { localStorage.setItem(LAST_BACKUP_KEY, date.toISOString()); } catch { /* storage unavailable */ }
}

const dayNumber = (d) => Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);

/** 'hoje (10/11/2026)', 'há 1 dia (…)', 'há N dias (…)' or 'nunca'. Counts local calendar days. */
export function formatLastBackup(date, now = new Date()) {
  if (!date) return 'nunca';
  const days = Math.max(0, dayNumber(now) - dayNumber(date));
  const when = days === 0 ? 'hoje' : days === 1 ? 'há 1 dia' : `há ${days} dias`;
  return `${when} (${formatShortDate(date)})`;
}
