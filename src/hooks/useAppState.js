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

export function useAppState() {
  // Sync load from localStorage for instant boot — no flicker
  const [state, setState] = useState(() => loadStateSync(defaultState()));

  // 'electron' | 'ready' | 'needs_permission' | 'not_configured' | 'unsupported' | 'checking'
  const [fileStatus, setFileStatus] = useState('checking');

  const saveRef = useRef(null);

  // On mount: detect environment and load persisted data
  useEffect(() => {
    async function init() {
      if (isElectron()) {
        // Best case: Electron — loads from AppData via Node.js fs
        const data = await loadStateElectron(defaultState());
        if (data) setState(data);
        setFileStatus('electron');
      } else {
        // Browser: try File System Access API, fall back to localStorage
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

  // Debounced auto-save (500ms)
  useEffect(() => {
    if (fileStatus === 'checking') return;
    if (saveRef.current) clearTimeout(saveRef.current);
    saveRef.current = setTimeout(() => {
      if (fileStatus === 'electron') {
        saveStateElectron(state);
      } else {
        saveState(state, fileStatus);
      }
    }, 500);
    return () => clearTimeout(saveRef.current);
  }, [state, fileStatus]);

  const up = useCallback((fn) => setState(p => ({ ...p, ...fn(p) })), []);

  return { state, setState, up, fileStatus, setFileStatus };
}
