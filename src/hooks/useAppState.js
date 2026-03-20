import { useState, useEffect, useCallback, useRef } from 'react';
import { defaultState } from '../data';
import {
  loadStateSync,
  loadStateFromFile,
  saveState,
  getStorageStatus,
} from '../storage';

export function useAppState() {
  // Sync load from localStorage for instant boot — no flicker
  const [state, setState] = useState(() => loadStateSync(defaultState()));

  // 'checking' | 'ready' | 'needs_permission' | 'not_configured' | 'unsupported'
  const [fileStatus, setFileStatus] = useState('checking');

  const saveRef = useRef(null);

  // On mount: check file storage status and try to load from file if ready
  useEffect(() => {
    async function init() {
      const status = await getStorageStatus();
      setFileStatus(status);
      if (status === 'ready') {
        const fileState = await loadStateFromFile(defaultState());
        if (fileState) setState(fileState);
      }
    }
    init();
  }, []);

  // Debounced auto-save (500ms) — writes to localStorage + file if configured
  useEffect(() => {
    if (fileStatus === 'checking') return;
    if (saveRef.current) clearTimeout(saveRef.current);
    saveRef.current = setTimeout(() => {
      saveState(state, fileStatus);
    }, 500);
    return () => clearTimeout(saveRef.current);
  }, [state, fileStatus]);

  const up = useCallback((fn) => setState(p => ({ ...p, ...fn(p) })), []);

  return { state, setState, up, fileStatus, setFileStatus };
}
