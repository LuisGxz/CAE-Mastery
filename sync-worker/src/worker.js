// ============================================================
// CAE Mastery — Sync Worker (Cloudflare)
// Backend mínimo de un solo usuario: login por contraseña + sync de JSON.
//  - POST /register  → fija la contraseña la primera vez (TOFU). Devuelve JWT.
//  - POST /login     → verifica contraseña. Devuelve JWT.
//  - GET  /status    → { initialized } (¿ya hay contraseña?)
//  - GET  /state     → { data, updatedAt }            (requiere Bearer JWT)
//  - PUT  /state     → guarda { data, updatedAt }     (requiere Bearer JWT)
// Estrategia de conflictos: última escritura gana (el cliente envía updatedAt).
// ============================================================

const AUTH_KEY = 'auth';     // KV: { username, salt, hash, iters }
const STATE_KEY = 'state';   // KV: { data, updatedAt }
const LOCK_KEY = 'lockout';  // KV: { fails, until }
const TOKEN_TTL = 60 * 60 * 24 * 30; // 30 días
const PBKDF2_ITERS = 100000;
const MAX_FAILS = 3;
const LOCK_MS = 15 * 60 * 1000; // 15 min de bloqueo tras 3 fallos

// ---------- base64url ----------
const enc = new TextEncoder();
const dec = new TextDecoder();
function b64urlFromBytes(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function bytesFromB64url(str) {
  const s = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(s + '==='.slice((s.length + 3) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function b64urlFromString(str) { return b64urlFromBytes(enc.encode(str)); }

// ---------- PBKDF2 password hashing ----------
async function hashPassword(password, saltBytes, iters = PBKDF2_ITERS) {
  const salt = saltBytes || crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: iters, hash: 'SHA-256' }, key, 256);
  return { salt: b64urlFromBytes(salt), hash: b64urlFromBytes(new Uint8Array(bits)), iters };
}
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
async function verifyPassword(password, record) {
  const salt = bytesFromB64url(record.salt);
  const { hash } = await hashPassword(password, salt, record.iters);
  return timingSafeEqual(hash, record.hash);
}

// ---------- JWT (HS256) ----------
async function hmacKey(secret) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
async function signJWT(secret, payload) {
  const header = b64urlFromString(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64urlFromString(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(data));
  return `${data}.${b64urlFromBytes(new Uint8Array(sig))}`;
}
async function verifyJWT(secret, token) {
  if (!token || token.split('.').length !== 3) return null;
  const [h, b, s] = token.split('.');
  const ok = await crypto.subtle.verify('HMAC', await hmacKey(secret), bytesFromB64url(s), enc.encode(`${h}.${b}`));
  if (!ok) return null;
  try {
    const payload = JSON.parse(dec.decode(bytesFromB64url(b)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}

// ---------- CORS ----------
function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim());
  const allow = allowed.includes(origin) ? origin : allowed[0] || '';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}
function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}

async function requireAuth(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  return verifyJWT(env.JWT_SECRET, token);
}

async function readLock(env) {
  const raw = await env.KV.get(LOCK_KEY);
  return raw ? JSON.parse(raw) : { fails: 0, until: 0 };
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === '/status' && request.method === 'GET') {
        const auth = await env.KV.get(AUTH_KEY);
        const lock = await readLock(env);
        const now = Date.now();
        const locked = lock.until > now;
        return json({ initialized: !!auth, locked, retryAfter: locked ? Math.ceil((lock.until - now) / 1000) : 0 }, 200, cors);
      }

      if (path === '/register' && request.method === 'POST') {
        const existing = await env.KV.get(AUTH_KEY);
        if (existing) return json({ error: 'already_initialized' }, 409, cors);
        const { username, password } = await request.json();
        if (!username || username.length < 3) return json({ error: 'invalid_username' }, 400, cors);
        if (!password || password.length < 8) return json({ error: 'weak_password' }, 400, cors);
        const record = await hashPassword(password);
        record.username = username;
        await env.KV.put(AUTH_KEY, JSON.stringify(record));
        const token = await signJWT(env.JWT_SECRET, { sub: username, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL });
        return json({ token }, 200, cors);
      }

      if (path === '/login' && request.method === 'POST') {
        const raw = await env.KV.get(AUTH_KEY);
        if (!raw) return json({ error: 'not_initialized' }, 404, cors);

        let lock = await readLock(env);
        const now = Date.now();
        // El bloqueo expiró → arranca con intentos frescos.
        if (lock.until && lock.until <= now) lock = { fails: 0, until: 0 };
        if (lock.until > now) {
          return json({ error: 'locked', retryAfter: Math.ceil((lock.until - now) / 1000) }, 423, cors);
        }

        const { username, password } = await request.json();
        const record = JSON.parse(raw);
        // Comparación constante: verifica password siempre; usuario sumado al final.
        const passOk = password ? await verifyPassword(password, record) : false;
        const ok = passOk && username === record.username;
        if (!ok) {
          lock.fails += 1;
          if (lock.fails >= MAX_FAILS) lock.until = now + LOCK_MS;
          await env.KV.put(LOCK_KEY, JSON.stringify(lock));
          if (lock.until > now) {
            return json({ error: 'locked', retryAfter: Math.ceil((lock.until - now) / 1000) }, 423, cors);
          }
          // Respuesta genérica (no revela si falló usuario o contraseña).
          return json({ error: 'invalid_credentials', attemptsLeft: MAX_FAILS - lock.fails }, 401, cors);
        }
        await env.KV.delete(LOCK_KEY); // éxito → resetea el contador
        const token = await signJWT(env.JWT_SECRET, { sub: record.username, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL });
        return json({ token }, 200, cors);
      }

      if (path === '/state') {
        const payload = await requireAuth(request, env);
        if (!payload) return json({ error: 'unauthorized' }, 401, cors);

        if (request.method === 'GET') {
          const raw = await env.KV.get(STATE_KEY);
          return json(raw ? JSON.parse(raw) : { data: null, updatedAt: 0 }, 200, cors);
        }
        if (request.method === 'PUT') {
          const body = await request.json();
          const record = { data: body.data, updatedAt: body.updatedAt || Date.now() };
          await env.KV.put(STATE_KEY, JSON.stringify(record));
          return json({ ok: true, updatedAt: record.updatedAt }, 200, cors);
        }
      }

      return json({ error: 'not_found' }, 404, cors);
    } catch (e) {
      return json({ error: 'server_error', detail: String(e) }, 500, cors);
    }
  },
};
