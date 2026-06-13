import { useRef, useState, useEffect } from 'react';
import { SKILLS } from '../../data';
import { Icon } from '../ui';
import {
  exportData, importData, setupFileStorage, requestFilePermission,
  disconnectFileStorage, isFileAPISupported, getElectronDataPath,
} from '../../storage';

const STATUS_INFO = {
  electron:         { tone: 'var(--success)', icon: 'shield', label: 'App de escritorio — guardado automático en AppData' },
  checking:         { tone: 'var(--text-3)', icon: 'clock', label: 'Verificando…' },
  ready:            { tone: 'var(--success)', icon: 'checkCircle', label: 'Archivo en disco activo' },
  needs_permission: { tone: 'var(--warn)', icon: 'alert', label: 'Necesita reconectar (sesión nueva)' },
  not_configured:   { tone: 'var(--text-3)', icon: 'bookmark', label: 'No configurado — usando localStorage' },
  unsupported:      { tone: 'var(--danger)', icon: 'x', label: 'No soportado (usa Chrome/Edge)' },
  denied:           { tone: 'var(--danger)', icon: 'x', label: 'Permiso denegado' },
};

export default function ConfigScreen({ state, setState, fileStatus, setFileStatus, defaultState }) {
  const fileRef = useRef(null);
  const [dataPath, setDataPath] = useState(null);

  useEffect(() => {
    if (fileStatus === 'electron') getElectronDataPath().then((p) => setDataPath(p));
  }, [fileStatus]);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importData(file);
      setState((prev) => ({ ...prev, ...data }));
      alert('Datos importados correctamente');
    } catch (err) {
      alert('Error al importar: ' + err.message);
    }
  };
  const handleSetupFile = async () => {
    const result = await setupFileStorage(state);
    if (result.ok) { setFileStatus('ready'); alert('Almacenamiento en disco configurado. Tus datos se guardarán automáticamente.'); }
    else if (result.reason !== 'cancelled') alert('Error al configurar: ' + result.reason);
  };
  const handleReconnect = async () => {
    const granted = await requestFilePermission();
    if (granted) setFileStatus('ready');
    else alert('No se pudo reconectar. Intenta configurar un nuevo archivo.');
  };
  const handleDisconnect = async () => {
    if (!window.confirm('¿Desconectar el archivo? Los datos quedarán en localStorage.')) return;
    await disconnectFileStorage();
    setFileStatus('not_configured');
  };

  const info = STATUS_INFO[fileStatus] || STATUS_INFO.not_configured;
  const latest = (k) => state.scores[k][state.scores[k].length - 1].score;
  const stats = [
    { label: 'Minutos estudiados', value: `${state.totalMinutes} (${Math.floor(state.totalMinutes / 60)}h)` },
    { label: 'Entradas de diario', value: state.diary.length },
    { label: 'Errores (dominados)', value: `${state.errors.length} (${state.errors.filter((e) => e.mastered).length})` },
    { label: 'Tarjetas de repaso', value: state.srCards.length },
    { label: 'Sesiones de shadowing', value: state.shadowLog.length },
    { label: 'Outputs guardados', value: state.outputLog.length },
    { label: 'Lecturas', value: (state.readingLog || []).length },
    { label: 'Promedio actual', value: Math.round(SKILLS.reduce((a, s) => a + latest(s.key), 0) / 5) },
  ];

  return (
    <div className="page" style={{ paddingTop: 14 }}>
      {/* Almacenamiento */}
      <div className="ds-card">
        <div className="card-h"><span className="card-title row" style={{ gap: 7 }}><Icon name="shield" size={16} color="var(--accent-2)" /> Almacenamiento</span></div>
        <div className="row" style={{ gap: 8, marginBottom: 12, color: info.tone, fontSize: 12.5, fontWeight: 600 }}>
          <Icon name={info.icon} size={15} /> {info.label}
        </div>
        {fileStatus === 'electron' && dataPath && (
          <p style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'monospace', wordBreak: 'break-all' }}>{dataPath}</p>
        )}
        {fileStatus === 'not_configured' && isFileAPISupported() && (
          <button className="ds-btn primary block" onClick={handleSetupFile}><Icon name="download" size={16} /> Configurar archivo en disco</button>
        )}
        {fileStatus === 'ready' && (
          <button className="ds-btn block" onClick={handleDisconnect} style={{ color: 'var(--danger)' }}>Desconectar archivo</button>
        )}
        {fileStatus === 'needs_permission' && (
          <div className="row" style={{ gap: 8 }}>
            <button className="ds-btn primary" style={{ flex: 1 }} onClick={handleReconnect}><Icon name="rotate" size={16} /> Reconectar</button>
            <button className="ds-btn" style={{ flex: 1 }} onClick={handleSetupFile}>Cambiar archivo</button>
          </div>
        )}
      </div>

      {/* Respaldo */}
      <div className="ds-card" style={{ marginTop: 12 }}>
        <div className="card-h"><span className="card-title row" style={{ gap: 7 }}><Icon name="download" size={16} color="var(--accent-2)" /> Respaldo de datos</span></div>
        <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 12 }}>Exporta todo como JSON para guardarlo o moverlo a otro dispositivo. Importa para restaurar.</p>
        <div className="row" style={{ gap: 8 }}>
          <button className="ds-btn primary" style={{ flex: 1 }} onClick={() => exportData(state)}><Icon name="download" size={16} /> Exportar</button>
          <button className="ds-btn" style={{ flex: 1 }} onClick={() => fileRef.current?.click()}><Icon name="upload" size={16} /> Importar</button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="ds-card" style={{ marginTop: 12 }}>
        <div className="card-h"><span className="card-title row" style={{ gap: 7 }}><Icon name="trend" size={16} color="var(--text-2)" /> Estadísticas globales</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 14px' }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div className="tnum" style={{ fontSize: 17, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Zona peligrosa */}
      <div className="ds-card" style={{ marginTop: 12, border: '1px solid color-mix(in oklab, var(--danger) 30%, transparent)' }}>
        <div className="card-h"><span className="card-title" style={{ color: 'var(--danger)' }}>Zona peligrosa</span></div>
        <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 12 }}>Borra TODOS tus datos y vuelve al estado inicial. No se puede deshacer.</p>
        <button className="ds-btn danger block" onClick={() => { if (window.confirm('¿Borrar TODOS los datos? Esta acción no se puede deshacer.')) setState(defaultState()); }}>
          <Icon name="rotate" size={16} /> Reiniciar datos
        </button>
      </div>
    </div>
  );
}
