import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ScanRuntimeState, ScanStage } from '../types/app';

interface ScanSessionContextValue {
  runtime: ScanRuntimeState;
  setStage: (stage: ScanStage) => void;
  setCameraGranted: (granted: boolean) => void;
  setMarkerLocked: (locked: boolean) => void;
  setFallbackActive: (active: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  setModelLoadState: (state: ScanRuntimeState['modelLoadState']) => void;
  setModelErrorMessage: (message: string | null) => void;
  resetRuntime: () => void;
}

const initialRuntime: ScanRuntimeState = {
  stage: 'idle',
  cameraGranted: false,
  markerLocked: false,
  fallbackActive: false,
  errorMessage: null,
  modelLoadState: 'idle',
  modelErrorMessage: null,
};

const ScanSessionContext = createContext<ScanSessionContextValue | null>(null);

export function ScanSessionProvider({ children }: { children: ReactNode }) {
  const [runtime, setRuntime] = useState<ScanRuntimeState>(initialRuntime);

  const setStage = useCallback((stage: ScanStage) => {
    setRuntime((prev) => ({ ...prev, stage }));
  }, []);

  const setCameraGranted = useCallback((cameraGranted: boolean) => {
    setRuntime((prev) => ({ ...prev, cameraGranted }));
  }, []);

  const setMarkerLocked = useCallback((markerLocked: boolean) => {
    setRuntime((prev) => ({ ...prev, markerLocked }));
  }, []);

  const setFallbackActive = useCallback((fallbackActive: boolean) => {
    setRuntime((prev) => ({ ...prev, fallbackActive }));
  }, []);

  const setErrorMessage = useCallback((errorMessage: string | null) => {
    setRuntime((prev) => ({ ...prev, errorMessage }));
  }, []);

  const setModelLoadState = useCallback((modelLoadState: ScanRuntimeState['modelLoadState']) => {
    setRuntime((prev) => ({ ...prev, modelLoadState }));
  }, []);

  const setModelErrorMessage = useCallback((modelErrorMessage: string | null) => {
    setRuntime((prev) => ({ ...prev, modelErrorMessage }));
  }, []);

  const resetRuntime = useCallback(() => {
    setRuntime(initialRuntime);
  }, []);

  const value = useMemo<ScanSessionContextValue>(
    () => ({
      runtime,
      setStage,
      setCameraGranted,
      setMarkerLocked,
      setFallbackActive,
      setErrorMessage,
      setModelLoadState,
      setModelErrorMessage,
      resetRuntime,
    }),
    [
      runtime,
      resetRuntime,
      setCameraGranted,
      setErrorMessage,
      setFallbackActive,
      setMarkerLocked,
      setModelErrorMessage,
      setModelLoadState,
      setStage,
    ],
  );

  return <ScanSessionContext.Provider value={value}>{children}</ScanSessionContext.Provider>;
}

export function useScanSession() {
  const context = useContext(ScanSessionContext);
  if (!context) {
    throw new Error('useScanSession must be used within ScanSessionProvider');
  }
  return context;
}
