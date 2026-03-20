// ─── storage.js ───────────────────────────────────────────────────────────────
// Persistent storage using File System Access API (real file on disk).
// Falls back to localStorage if the API is unsupported or not yet configured.
// The file handle is persisted in IndexedDB between sessions.
// ──────────────────────────────────────────────────────────────────────────────

const IDB_NAME = 'cae-mastery-idb';
const IDB_STORE = 'config';
const HANDLE_KEY = 'fileHandle';
const LS_KEY = 'cae-mastery-v4';

// ─── IndexedDB helpers ────────────────────────────────────────────────────────

function openDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(IDB_NAME, 1);
    r.onupgradeneeded = e => e.target.result.createObjectStore(IDB_STORE);
    r.onsuccess = e => res(e.target.result);
    r.onerror = () => rej(r.error);
  });
}

async function idbGet(key) {
  try {
    const db = await openDB();
    return new Promise(res => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => res(req.result ?? null);
      req.onerror = () => res(null);
    });
  } catch { return null; }
}

async function idbSet(key, value) {
  try {
    const db = await openDB();
    await new Promise((res, rej) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = res;
      tx.onerror = () => rej(tx.error);
    });
  } catch { /* silent */ }
}

async function idbDel(key) {
  try {
    const db = await openDB();
    await new Promise((res, rej) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(key);
      tx.oncomplete = res;
      tx.onerror = () => rej(tx.error);
    });
  } catch { /* silent */ }
}

// ─── localStorage fallback ────────────────────────────────────────────────────

export function loadStateSync(defaultState) {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...defaultState, ...JSON.parse(raw) };
  } catch { /* silent */ }
  return defaultState;
}

function lsSave(state) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch { /* silent */ }
}

// ─── File System Access API ───────────────────────────────────────────────────

export const isFileAPISupported = () => 'showSaveFilePicker' in window;

export async function getFileHandle() {
  return idbGet(HANDLE_KEY);
}

/**
 * Returns the current storage status:
 * - 'unsupported'     : File System Access API not available (use localStorage)
 * - 'not_configured'  : API available but user hasn't set up a file yet
 * - 'ready'           : File handle exists and permission is granted
 * - 'needs_permission': File handle exists but needs user to re-grant permission (after browser restart)
 * - 'denied'          : Permission was explicitly denied
 */
export async function getStorageStatus() {
  if (!isFileAPISupported()) return 'unsupported';
  const handle = await getFileHandle();
  if (!handle) return 'not_configured';
  try {
    const perm = await handle.queryPermission({ mode: 'readwrite' });
    if (perm === 'granted') return 'ready';
    if (perm === 'prompt') return 'needs_permission';
    return 'denied';
  } catch { return 'not_configured'; }
}

/**
 * Opens the file picker and saves the chosen handle to IndexedDB.
 * MUST be called from a user gesture (button click).
 * Writes currentState to the chosen file immediately.
 */
export async function setupFileStorage(currentState) {
  if (!isFileAPISupported()) return { ok: false, reason: 'unsupported' };
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: 'cae-mastery-data.json',
      types: [{ description: 'CAE Mastery Data', accept: { 'application/json': ['.json'] } }],
    });
    await idbSet(HANDLE_KEY, handle);
    await writeToHandle(handle, currentState);
    return { ok: true };
  } catch (e) {
    if (e.name === 'AbortError') return { ok: false, reason: 'cancelled' };
    return { ok: false, reason: e.message };
  }
}

/**
 * Re-requests read/write permission after a browser restart.
 * MUST be called from a user gesture (button click).
 */
export async function requestFilePermission() {
  const handle = await getFileHandle();
  if (!handle) return false;
  try {
    const perm = await handle.requestPermission({ mode: 'readwrite' });
    return perm === 'granted';
  } catch { return false; }
}

export async function disconnectFileStorage() {
  await idbDel(HANDLE_KEY);
}

async function writeToHandle(handle, state) {
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(state, null, 2));
  await writable.close();
}

// ─── Public load / save ───────────────────────────────────────────────────────

/**
 * Tries to load state from the stored file.
 * Returns null if file storage is not ready or fails.
 */
export async function loadStateFromFile(defaultState) {
  try {
    const handle = await getFileHandle();
    if (!handle) return null;
    const perm = await handle.queryPermission({ mode: 'readwrite' });
    if (perm !== 'granted') return null;
    const file = await handle.getFile();
    const text = await file.text();
    return { ...defaultState, ...JSON.parse(text) };
  } catch { return null; }
}

/**
 * Saves state. Always writes to localStorage as backup.
 * Also writes to the file if fileStatus === 'ready'.
 */
export async function saveState(state, fileStatus) {
  lsSave(state);
  if (fileStatus === 'ready') {
    try {
      const handle = await getFileHandle();
      if (handle) await writeToHandle(handle, state);
    } catch { /* localStorage backup is always written above */ }
  }
}

// ─── Import / Export ─────────────────────────────────────────────────────────

export function exportData(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `cae-mastery-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function importData(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => {
      try { res(JSON.parse(e.target.result)); }
      catch { rej(new Error('Archivo inválido')); }
    };
    reader.onerror = () => rej(new Error('No se pudo leer el archivo'));
    reader.readAsText(file);
  });
}
