// ─── sync.js ───────────────────────────────────────────────────────────────
// Cliente del Worker de sincronización (Cloudflare). Login por contraseña +
// pull/push del estado completo como JSON. Última escritura gana (por updatedAt).
// Si SYNC_URL está vacío, el sync queda deshabilitado y la app sigue 100% local.
// ─────────────────────────────────────────────────────────────────────────────
import { SYNC_URL } from './syncConfig';

const TOKEN_KEY = 'cae-sync-token';
const UPDATED_KEY = 'cae-sync-updatedAt'; // ts de la última escritura local conocida

export const syncEnabled = () => !!SYNC_URL;
export const getToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };
const setToken = (t) => { try { localStorage.setItem(TOKEN_KEY, t); } catch { /* */ } };
export const clearToken = () => { try { localStorage.removeItem(TOKEN_KEY); } catch { /* */ } };
export const isLoggedIn = () => syncEnabled() && !!getToken();

export const getLocalUpdatedAt = () => { try { return Number(localStorage.getItem(UPDATED_KEY)) || 0; } catch { return 0; } };
export const setLocalUpdatedAt = (ts) => { try { localStorage.setItem(UPDATED_KEY, String(ts)); } catch { /* */ } };

async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const t = getToken();
    if (!t) throw new Error('no_token');
    headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(SYNC_URL + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || `http_${res.status}`), { status: res.status, data });
  return data;
}

/** ¿El backend ya tiene contraseña configurada? */
export async function fetchStatus() {
  const { initialized } = await api('/status');
  return initialized;
}

/** Crea la contraseña la primera vez (TOFU). Devuelve true si quedó logueado. */
export async function register(password) {
  const { token } = await api('/register', { method: 'POST', body: { password } });
  setToken(token);
  return true;
}

/** Inicia sesión con la contraseña. */
export async function login(password) {
  const { token } = await api('/login', { method: 'POST', body: { password } });
  setToken(token);
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
