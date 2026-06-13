import { useState, useEffect, useCallback, useRef } from 'react';
import { defaultState } from '../data';
import {
  isElectron,
  loadStateElectron,
  saveStateElectron,
  loadStateSync,
  loadStateFromFile,
  saveState,
  getStorageStatus,
} from '../storage';
import { isLoggedIn, pull, push, getLocalUpdatedAt, setLocalUpdatedAt, clearToken } from '../sync';

// Token rechazado por el servidor (expirado/revocado) → cierra sesión y recarga
// para volver al muro de acceso.
function handleAuthError(e) {
  if (e && e.status === 401) { clearToken(); window.location.reload(); return true; }
  return false;
}

export function useAppState() {
  // Sync load from localStorage for instant boot — no flicker
  const [state, setState] = useState(() => loadStateSync(defaultState()));

  // 'electron' | 'ready' | 'needs_permission' | 'not_configured' | 'unsupported' | 'checking'
  const [fileStatus, setFileStatus] = useState('checking');
  // Cloud sync: 'off' | 'idle' | 'syncing' | 'error'
  const [syncState, setSyncState] = useState(isLoggedIn() ? 'idle' : 'off');

  const saveRef = useRef(null);
  const pushRef = useRef(null);

  // On mount: detect environment and load persisted data (local backends)
  useEffect(() => {
    async function init() {
      if (isElectron()) {
        const data = await loadStateElectron(defaultState());
        if (data) setState(data);
        setFileStatus('electron');
      } else {
        const status = await getStorageStatus();
        setFileStatus(status);
        if (status === 'ready') {
          const fileState = await loadStateFromFile(defaultState());
          if (fileState) setState(fileState);
        }
      }
    }
    init();
  }, []);

  // On mount: if logged into cloud sync, pull remote and adopt if newer.
  useEffect(() => {
    if (!isLoggedIn()) return;
    let cancelled = false;
    (async () => {
      setSyncState('syncing');
      try {
        const remote = await pull();
        if (!cancelled && remote && remote.updatedAt > getLocalUpdatedAt()) {
          setState((prev) => ({ ...prev, ...remote.data }));
          setLocalUpdatedAt(remote.updatedAt);
        }
        if (!cancelled) setSyncState('idle');
      } catch (e) {
        if (handleAuthError(e)) return;
        if (!cancelled) setSyncState('error');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Debounced auto-save (local backends, 500ms)
  useEffect(() => {
    if (fileStatus === 'checking') return;
    if (saveRef.current) clearTimeout(saveRef.current);
    saveRef.current = setTimeout(() => {
      if (fileStatus === 'electron') saveStateElectron(state);
      else saveState(state, fileStatus);
    }, 500);
    return () => clearTimeout(saveRef.current);
  }, [state, fileStatus]);

  // Debounced cloud push (2s) when logged in
  useEffect(() => {
    if (!isLoggedIn()) return;
    if (pushRef.current) clearTimeout(pushRef.current);
    pushRef.current = setTimeout(async () => {
      setSyncState('syncing');
      try { await push(state); setSyncState('idle'); }
      catch (e) { if (!handleAuthError(e)) setSyncState('error'); }
    }, 2000);
    return () => clearTimeout(pushRef.current);
  }, [state]);

  const up = useCallback((fn) => setState((p) => ({ ...p, ...fn(p) })), []);

  return { state, setState, up, fileStatus, setFileStatus, syncState, setSyncState };
}
