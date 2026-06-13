import { useState, useEffect } from 'react';
import { Icon } from '../ui';
import {
  syncEnabled, isLoggedIn, fetchStatus, register, login, clearToken,
  pull, push, getLocalUpdatedAt, setLocalUpdatedAt,
} from '../../sync';

export default function SyncScreen({ state, setState, setSyncState }) {
  const [mode, setMode] = useState('checking'); // checking | register | login | active | disabled
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!syncEnabled()) { setMode('disabled'); return; }
    if (isLoggedIn()) { setMode('active'); return; }
    fetchStatus().then((init) => setMode(init ? 'login' : 'register')).catch(() => setMode('login'));
  }, []);

  // Tras autenticarse: trae remoto y lo adopta si es más nuevo; si no hay remoto,
  // siembra el remoto con el estado local actual.
  async function afterAuth() {
    setSyncState?.('syncing');
    try {
      const remote = await pull();
      if (remote && remote.updatedAt > getLocalUpdatedAt()) {
        setState((prev) => ({ ...prev, ...remote.data }));
        setLocalUpdatedAt(remote.updatedAt);
      } else {
        await push(state);
      }
      setSyncState?.('idle');
    } catch {
      setSyncState?.('error');
    }
  }

  async function doRegister() {
    if (pwd.length < 8) { setMsg({ kind: 'danger', text: 'La contraseña debe tener al menos 8 caracteres.' }); return; }
    if (pwd !== pwd2) { setMsg({ kind: 'danger', text: 'Las contraseñas no coinciden.' }); return; }
    setBusy(true); setMsg(null);
    try { await register(pwd); await afterAuth(); setMode('active'); }
    catch (e) { setMsg({ kind: 'danger', text: e.status === 409 ? 'Ya existe una contraseña. Inicia sesión.' : 'No se pudo crear. Revisa tu conexión.' }); if (e.status === 409) setMode('login'); }
    finally { setBusy(false); setPwd(''); setPwd2(''); }
  }
  async function doLogin() {
    setBusy(true); setMsg(null);
    try { await login(pwd); await afterAuth(); setMode('active'); }
    catch (e) { setMsg({ kind: 'danger', text: e.status === 401 ? 'Contraseña incorrecta.' : 'No se pudo iniciar sesión.' }); }
    finally { setBusy(false); setPwd(''); }
  }
  function doLogout() {
    clearToken();
    window.location.reload(); // vuelve al muro de acceso
  }

  return (
    <div className="page" style={{ paddingTop: 14 }}>
      <div className="ds-card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'var(--accent-soft)', color: 'var(--accent-2)' }}>
          <Icon name="globe" size={20} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Sincronización en la nube</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginTop: 2 }}>
            Mantén tus datos iguales en móvil, web y escritorio. Protegido con tu contraseña.
          </div>
        </div>
      </div>

      {msg && (
        <div className="ds-card" style={{ marginTop: 12, padding: 12, borderColor: `color-mix(in oklab, var(--${msg.kind === 'danger' ? 'danger' : 'accent'}) 35%, transparent)` }}>
          <span style={{ fontSize: 12.5, color: msg.kind === 'danger' ? 'var(--danger)' : 'var(--text-2)' }}>{msg.text}</span>
        </div>
      )}

      {mode === 'disabled' && (
        <div className="ds-card" style={{ marginTop: 12 }}>
          <p style={{ fontSize: 12.5, color: 'var(--text-3)', lineHeight: 1.5 }}>
            El sync aún no está configurado en esta versión. Mientras tanto, usa <strong>Exportar / Importar</strong> en Ajustes para mover tus datos entre dispositivos.
          </p>
        </div>
      )}

      {(mode === 'register' || mode === 'login') && (
        <div className="ds-card" style={{ marginTop: 12 }}>
          <div className="card-h"><span className="card-title">{mode === 'register' ? 'Crear contraseña de sync' : 'Iniciar sesión'}</span></div>
          {mode === 'register' && (
            <p style={{ fontSize: 11.5, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 10 }}>
              Es la primera vez. Elige una contraseña fuerte (mín. 8 caracteres): la usarás en cada dispositivo para acceder a tus datos.
            </p>
          )}
          <input className="ds-inp" type="password" placeholder="Contraseña" value={pwd}
            onChange={(e) => setPwd(e.target.value)} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} />
          {mode === 'register' && (
            <input className="ds-inp" type="password" placeholder="Repite la contraseña" value={pwd2}
              onChange={(e) => setPwd2(e.target.value)} autoComplete="new-password" style={{ marginTop: 8 }} />
          )}
          <button className="ds-btn primary block" style={{ marginTop: 10 }} disabled={busy}
            onClick={mode === 'register' ? doRegister : doLogin}>
            <Icon name={busy ? 'rotate' : 'globe'} size={16} /> {busy ? 'Conectando…' : (mode === 'register' ? 'Crear y activar sync' : 'Entrar')}
          </button>
        </div>
      )}

      {mode === 'active' && (
        <div className="ds-card" style={{ marginTop: 12 }}>
          <div className="row" style={{ gap: 8, color: 'var(--success)', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
            <Icon name="checkCircle" size={16} /> Sincronización activa
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 12 }}>
            Tus cambios se guardan en la nube automáticamente y aparecen en tus otros dispositivos al abrir la app.
          </p>
          <button className="ds-btn block" onClick={doLogout} style={{ color: 'var(--danger)' }}>
            <Icon name="x" size={16} /> Cerrar sesión en este dispositivo
          </button>
        </div>
      )}
    </div>
  );
}
