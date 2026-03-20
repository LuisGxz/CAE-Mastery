import { useRef } from 'react';
import { SKILLS, EXAM_DATE } from '../../data';
import {
  exportData,
  importData,
  setupFileStorage,
  requestFilePermission,
  disconnectFileStorage,
  isFileAPISupported,
} from '../../storage';

const STATUS_INFO = {
  checking:        { color: "#64748b", icon: "⏳", label: "Verificando..." },
  ready:           { color: "#22c55e", icon: "✅", label: "Archivo en disco activo" },
  needs_permission:{ color: "#f59e0b", icon: "⚠️", label: "Necesita reconectar (sesión nueva)" },
  not_configured:  { color: "#94a3b8", icon: "📁", label: "No configurado — usando localStorage" },
  unsupported:     { color: "#ef4444", icon: "❌", label: "No soportado en este navegador (usa Chrome/Edge)" },
  denied:          { color: "#ef4444", icon: "🚫", label: "Permiso denegado" },
};

export default function ConfigTab({ state, setState, fileStatus, setFileStatus, defaultState, daysLeft }) {
  const fileRef = useRef(null);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importData(file);
      setState(prev => ({ ...prev, ...data }));
      alert('Datos importados correctamente');
    } catch (err) {
      alert('Error al importar: ' + err.message);
    }
  };

  const handleSetupFile = async () => {
    const result = await setupFileStorage(state);
    if (result.ok) {
      setFileStatus('ready');
      alert('✅ Almacenamiento en disco configurado.\nTus datos se guardarán automáticamente en el archivo elegido.');
    } else if (result.reason !== 'cancelled') {
      alert('Error al configurar: ' + result.reason);
    }
  };

  const handleReconnect = async () => {
    const granted = await requestFilePermission();
    if (granted) {
      setFileStatus('ready');
    } else {
      alert('No se pudo reconectar. Intenta configurar un nuevo archivo.');
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('¿Desconectar el archivo? Los datos quedarán en localStorage hasta que configures un archivo nuevo.')) return;
    await disconnectFileStorage();
    setFileStatus('not_configured');
  };

  const info = STATUS_INFO[fileStatus] || STATUS_INFO.not_configured;
  const totalErrors = state.errors.length;
  const masteredErrors = state.errors.filter(e => e.mastered).length;
  const totalReadings = (state.readingLog || []).length;
  const totalExpressions = (state.readingLog || []).reduce((a, e) => a + (e.expressions ? e.expressions.split(',').filter(x => x.trim()).length : 0), 0);

  return (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Configuración</h2>

      {/* File Storage */}
      <div className="card" style={{ borderColor: `${info.color}40` }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>💾 Almacenamiento</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 16 }}>{info.icon}</span>
          <span style={{ fontSize: 13, color: info.color }}>{info.label}</span>
        </div>

        {fileStatus === 'not_configured' && isFileAPISupported() && (
          <div>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>
              Guarda tus datos en un archivo real en tu computadora. El archivo se actualiza automáticamente cada vez que haces un cambio.
            </p>
            <button onClick={handleSetupFile} className="btn" style={{ background: "linear-gradient(135deg,#22c55e,#3b82f6)" }}>
              📁 Configurar archivo en disco
            </button>
          </div>
        )}

        {fileStatus === 'ready' && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>Los datos se guardan automáticamente.</span>
            <button onClick={handleDisconnect} style={{ fontSize: 11, background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "none", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>
              Desconectar archivo
            </button>
          </div>
        )}

        {fileStatus === 'needs_permission' && (
          <div>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>
              Después de reiniciar el navegador necesitas reconectar el archivo para que el guardado automático funcione.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleReconnect} className="btn" style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}>
                🔗 Reconectar archivo
              </button>
              <button onClick={handleSetupFile} className="btn" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", fontSize: 12 }}>
                Cambiar archivo
              </button>
            </div>
          </div>
        )}

        {fileStatus === 'unsupported' && (
          <p style={{ fontSize: 12, color: "#94a3b8" }}>
            Usa Chrome o Edge para activar el guardado en disco. En Firefox, los datos se guardan en localStorage del navegador.
          </p>
        )}
      </div>

      {/* Backup manual */}
      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Backup manual</h3>
        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>
          Exporta todos tus datos como JSON. Importa para restaurar en otro dispositivo o si cambias de navegador.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => exportData(state)} className="btn" style={{ background: "linear-gradient(135deg,#22c55e,#06b6d4)" }}>
            📥 Exportar backup
          </button>
          <button onClick={() => fileRef.current?.click()} className="btn" style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
            📤 Importar datos
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
        </div>
      </div>

      {/* Stats */}
      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Estadísticas globales</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13 }}>
          <div><span style={{ color: "#64748b" }}>Minutos estudiados:</span> <strong>{state.totalMinutes} ({Math.floor(state.totalMinutes / 60)}h)</strong></div>
          <div><span style={{ color: "#64748b" }}>Entradas de diario:</span> <strong>{state.diary.length}</strong></div>
          <div><span style={{ color: "#64748b" }}>Errores registrados:</span> <strong>{totalErrors} ({masteredErrors} dominados)</strong></div>
          <div><span style={{ color: "#64748b" }}>Tarjetas SR:</span> <strong>{state.srCards.length}</strong></div>
          <div><span style={{ color: "#64748b" }}>Sesiones shadowing:</span> <strong>{state.shadowLog.length}</strong></div>
          <div><span style={{ color: "#64748b" }}>Outputs guardados:</span> <strong>{state.outputLog.length}</strong></div>
          <div><span style={{ color: "#64748b" }}>Lecturas registradas:</span> <strong>{totalReadings} ({totalExpressions} expresiones)</strong></div>
          <div><span style={{ color: "#64748b" }}>Días para examen:</span> <strong style={{ color: "#fca5a5" }}>{daysLeft}</strong></div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ borderColor: "rgba(239,68,68,0.3)" }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: "#fca5a5" }}>Zona peligrosa</h3>
        <button onClick={() => {
          if (window.confirm('¿Estás seguro? Se borran TODOS tus datos. Esta acción no se puede deshacer.')) {
            setState(defaultState());
          }
        }} className="btn" style={{ background: "#ef4444" }}>
          Resetear todos los datos
        </button>
      </div>
    </div>
  );
}
