// The only module that touches IndexedDB (native API, no wrappers).

const DB_NAME = 'cestinha';
const DB_VERSION = 1;

let dbPromise = null;

export function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }
    let request;
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)));
      return;
    }

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (event.oldVersion < 1) {
        const templates = db.createObjectStore('templates', { keyPath: 'id' });
        templates.createIndex('updatedAt', 'updatedAt');
        const lists = db.createObjectStore('lists', { keyPath: 'id' });
        lists.createIndex('createdAt', 'createdAt');
        lists.createIndex('templateId', 'templateId');
      }
      // if (event.oldVersion < 2) { ... }  <- future migrations; never edit the v1 block
    };

    request.onsuccess = () => {
      const db = request.result;
      // Another tab is upgrading the schema: release our connection.
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };
    request.onerror = () => reject(request.error ?? new Error('Failed to open the database.'));
    request.onblocked = () => reject(new Error('Database upgrade blocked by another open tab.'));
  });
  // Allow a retry after a failure instead of caching the rejection forever.
  dbPromise.catch(() => {
    dbPromise = null;
  });
  return dbPromise;
}

function promisify(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Runs fn(store) in a transaction; resolves with fn's result once the transaction completes.
async function withStore(name, mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(name, mode);
    let result;
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error('Transaction aborted.'));
    Promise.resolve(fn(tx.objectStore(name))).then((value) => {
      result = value;
    }, reject);
  });
}

function getAllByIndexDesc(storeName, indexName) {
  return withStore(storeName, 'readonly', (store) => {
    return new Promise((resolve, reject) => {
      const rows = [];
      const request = store.index(indexName).openCursor(null, 'prev');
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          rows.push(cursor.value);
          cursor.continue();
        } else {
          resolve(rows);
        }
      };
      request.onerror = () => reject(request.error);
    });
  });
}

async function put(storeName, record) {
  record.updatedAt = new Date().toISOString(); // createdAt is never touched
  await withStore(storeName, 'readwrite', (store) => promisify(store.put(record)));
  return record;
}

export const getAllTemplates = () => getAllByIndexDesc('templates', 'updatedAt');
export const getTemplate = (id) => withStore('templates', 'readonly', (s) => promisify(s.get(id)));
export const putTemplate = (template) => put('templates', template);
// Deliberately leaves lists alone (RN13).
export const deleteTemplate = (id) => withStore('templates', 'readwrite', (s) => promisify(s.delete(id)));

export const getAllLists = () => getAllByIndexDesc('lists', 'createdAt');
export const getList = (id) => withStore('lists', 'readonly', (s) => promisify(s.get(id)));
export const putList = (list) => put('lists', list);
export const deleteList = (id) => withStore('lists', 'readwrite', (s) => promisify(s.delete(id)));

// Undo of a deletion: written as-is, keeping the original updatedAt (RN19).
export const restoreTemplate = (record) => withStore('templates', 'readwrite', (s) => promisify(s.put(record)));
export const restoreList = (record) => withStore('lists', 'readwrite', (s) => promisify(s.put(record)));

/**
 * Backup import (RN17): replaces everything in one transaction over both stores.
 * Records are written as-is (no put() helper: it would overwrite updatedAt).
 * If anything fails the transaction aborts and the old data stays.
 */
export async function replaceAllData({ templates, lists }) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    let tx;
    try {
      tx = db.transaction(['templates', 'lists'], 'readwrite');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error('Transaction aborted.'));
      const templateStore = tx.objectStore('templates');
      const listStore = tx.objectStore('lists');
      templateStore.clear();
      listStore.clear();
      templates.forEach((record) => templateStore.put(record));
      lists.forEach((record) => listStore.put(record));
    } catch (err) {
      try { tx?.abort(); } catch { /* already finished */ }
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}

export async function requestPersistence() {
  try {
    if (navigator.storage?.persist) await navigator.storage.persist();
  } catch {
    // Refusal or failure is ignored on purpose (RNF07).
  }
}
