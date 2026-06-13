// ─── sync.js ───────────────────────────────────────────────────────────────
// Cliente del Worker de sincronización (Cloudflare). Login usuario+contraseña +
// pull/push del estado completo como JSON. Última escritura gana (por updatedAt).
// Token JWT persistido (localStorage = "recuérdame"; sessionStorage = sesión).
// ─────────────────────────────────────────────────────────────────────────────
import { SYNC_URL } from './syncConfig';

const TOKEN_KEY = 'cae-sync-token';
const UPDATED_KEY = 'cae-sync-updatedAt'; // ts de la última escritura local conocida

export const syncEnabled = () => !!SYNC_URL;

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
};
function setToken(t, remember) {
  try {
    if (remember) { localStorage.setItem(TOKEN_KEY, t); sessionStorage.removeItem(TOKEN_KEY); }
    else { sessionStorage.setItem(TOKEN_KEY, t); localStorage.removeItem(TOKEN_KEY); }
  } catch { /* */ }
}
export const clearToken = () => {
  try { localStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(TOKEN_KEY); } catch { /* */ }
};

// Valida el token en local (decodifica exp del JWT) sin contactar al servidor →
// permite uso offline con sesión recordada.
export function tokenValid() {
  const t = getToken();
  if (!t || t.split('.').length !== 3) return false;
  try {
    const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return !payload.exp || payload.exp > Math.floor(Date.now() / 1000);
  } catch { return false; }
}
export const isLoggedIn = () => syncEnabled() && tokenValid();

export const getLocalUpdatedAt = () => { try { return Number(localStorage.getItem(UPDATED_KEY)) || 0; } catch { return 0; } };
export const setLocalUpdatedAt = (ts) => { try { localStorage.setItem(UPDATED_KEY, String(ts)); } catch { /* */ } };

async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = getToken();
    if (!t) throw Object.assign(new Error('no_token'), { status: 401 });
    headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(SYNC_URL + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `http_${res.status}`), { status: res.status, data });
  return data;
}

/** Estado del backend: { initialized, locked, retryAfter }. */
export async function fetchStatus() {
  return api('/status');
}

/** Crea la cuenta la primera vez (TOFU). */
export async function register(username, password, remember = true) {
  const { token } = await api('/register', { method: 'POST', body: { username, password } });
  setToken(token, remember);
  return true;
}

/** Inicia sesión. Lanza error con status 401 (credenciales) o 423 (bloqueado). */
export async function login(username, password, remember = true) {
  const { token } = await api('/login', { method: 'POST', body: { username, password } });
  setToken(token, remember);
  return true;
}

/** Trae el estado remoto: { data, updatedAt } o null si no hay. */
export async function pull() {
  const res = await api('/state', { auth: true });
  return res && res.data ? res : null;
}

/** Sube el estado completo. updatedAt = ahora. */
export async function push(state) {
  const updatedAt = Date.now();
  await api('/state', { method: 'PUT', auth: true, body: { data: state, updatedAt } });
  setLocalUpdatedAt(updatedAt);
  return updatedAt;
}
