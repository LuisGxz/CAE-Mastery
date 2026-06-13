import { useState, useEffect } from 'react';
import { GraduationCap, Lock, RefreshCw } from 'lucide-react';
import { fetchStatus, login, register } from '../sync';

// Muro de acceso obligatorio (web/escritorio). Tras autenticarse, recarga para
// que la app arranque con sesión y sincronice.
export default function LoginGate() {
  const [mode, setMode] = useState('login'); // login | register
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [locked, setLocked] = useState(0); // segundos restantes

  useEffect(() => {
    fetchStatus()
      .then((s) => {
        setMode(s.initialized ? 'login' : 'register');
        if (s.locked) setLocked(s.retryAfter || 0);
      })
      .catch(() => {});
  }, []);

  // Cuenta atrás del bloqueo.
  useEffect(() => {
    if (locked <= 0) return undefined;
    const id = setTimeout(() => setLocked((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(id);
  }, [locked]);

  async function submit() {
    setErr(null);
    if (!username.trim() || !password) { setErr('Ingresa usuario y contraseña.'); return; }
    if (mode === 'register' && password.length < 8) { setErr('La contraseña debe tener al menos 8 caracteres.'); return; }
    setBusy(true);
    try {
      if (mode === 'register') await register(username.trim(), password, remember);
      else await login(username.trim(), password, remember);
      window.location.reload();
    } catch (e) {
      if (e.status === 423) { setLocked(e.data?.retryAfter || 900); setErr(null); }
      else if (e.status === 401) {
        const left = e.data?.attemptsLeft;
        setErr(left != null ? `Credenciales incorrectas. ${left} intento${left === 1 ? '' : 's'} restante${left === 1 ? '' : 's'}.` : 'Credenciales incorrectas.');
      } else if (e.status === 409) { setMode('login'); setErr('La cuenta ya existe. Inicia sesión.'); }
      else setErr('No se pudo conectar. Revisa tu internet.');
      setBusy(false);
    }
  }

  const mm = String(Math.floor(locked / 60)).padStart(2, '0');
  const ss = String(locked % 60).padStart(2, '0');

  return (
    <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 20 }}>
      <div className="ds-card" style={{ width: '100%', maxWidth: 360, padding: 22 }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: 15, margin: '0 auto 12px', display: 'grid', placeItems: 'center', background: 'var(--accent-soft)', color: 'var(--accent-2)' }}>
            <GraduationCap size={26} />
          </div>
          <h1 style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em' }}>CAE Mastery</h1>
          <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 4 }}>
            {mode === 'register' ? 'Crea tu acceso para sincronizar' : 'Inicia sesión para continuar'}
          </p>
        </div>

        {locked > 0 ? (
          <div style={{ textAlign: 'center', padding: '14px 0' }}>
            <Lock size={28} color="var(--danger)" />
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--danger)', marginTop: 10 }}>Acceso bloqueado</p>
            <p style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 4 }}>Demasiados intentos fallidos. Reintenta en</p>
            <div className="tnum" style={{ fontSize: 30, fontWeight: 800, marginTop: 6 }}>{mm}:{ss}</div>
          </div>
        ) : (
          <>
            <input className="ds-inp" placeholder="Usuario" value={username} autoComplete="username"
              onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
            <input className="ds-inp" type="password" placeholder="Contraseña" value={password} style={{ marginTop: 8 }}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />

            <label className="row" style={{ gap: 8, marginTop: 12, cursor: 'pointer', fontSize: 12.5, color: 'var(--text-2)' }}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--accent)' }} />
              Mantener sesión iniciada en este dispositivo
            </label>

            {err && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 10 }}>{err}</div>}

            <button className="ds-btn primary block" style={{ marginTop: 14 }} disabled={busy} onClick={submit}>
              {busy ? <RefreshCw size={16} /> : <Lock size={16} />} {busy ? 'Entrando…' : (mode === 'register' ? 'Crear y entrar' : 'Entrar')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
