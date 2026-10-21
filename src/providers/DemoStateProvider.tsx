import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { demoReducer, type DemoAction } from '@/providers/demoReducer';
import { createInitialState } from '@/services/demoData';
import type { DemoState } from '@/types/demo';

interface DemoStore {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
}

const DemoContext = createContext<DemoStore | null>(null);

/**
 * Estado global de la demostración.
 * Todo vive en la memoria de esta pestaña: recargar reinicia la sesión.
 * No se invoca GPS, cámara, micrófono, notificaciones ni APIs de emergencia.
 */
export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, createInitialState);

  /* Reloj de la simulación: duraciones, vencimientos, GPS simulado y escalamiento. */
  useEffect(() => {
    const id = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(id);
  }, []);

  /* El toast es transitorio y nunca bloquea controles de emergencia o consentimiento. */
  useEffect(() => {
    if (!state.toast) return;
    const id = setTimeout(() => dispatch({ type: 'clearToast' }), 3800);
    return () => clearTimeout(id);
  }, [state.toast]);

  return <DemoContext.Provider value={{ state, dispatch }}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoStore {
  const store = useContext(DemoContext);
  if (!store) throw new Error('useDemo debe usarse dentro de DemoStateProvider');
  return store;
}

/** Acceso rápido al estado de la demostración. */
export function useDemoState(): DemoState {
  return useDemo().state;
}
