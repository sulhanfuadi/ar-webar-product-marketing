import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScanHUD } from '../components/ScanHUD';
import { routes, scanTarget, viewCopy } from '../content/appContent';
import { useScanSession } from '../state/ScanSessionContext';
import { useMindArRuntime } from '../ar/mindarRuntime';
import type { ScanStage } from '../types/app';

function isProbablyMobile() {
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent || '');
}

function toCameraErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error ?? 'Unknown camera failure');
  const message = raw.toLowerCase();

  if (message.includes('notallowederror') || message.includes('permission') || message.includes('denied')) {
    return 'Camera access denied. Enable camera in browser site settings, then retry.';
  }

  if (message.includes('notfounderror') || message.includes('device not found')) {
    return 'No camera device found. Try another phone or close apps that lock the camera.';
  }

  return `Basic camera fallback failed: ${raw}`;
}

export function ScanPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const basicVideoRef = useRef<HTMLVideoElement | null>(null);
  const basicStreamRef = useRef<MediaStream | null>(null);

  const { runtime, setStage, setCameraGranted, setMarkerLocked, setFallbackActive, setErrorMessage } = useScanSession();

  const [bootNonce, setBootNonce] = useState(0);
  const [basicCameraMode, setBasicCameraMode] = useState(false);

  const stopBasicCamera = useCallback(() => {
    if (basicVideoRef.current) {
      basicVideoRef.current.pause();
      basicVideoRef.current.srcObject = null;
    }

    if (basicStreamRef.current) {
      basicStreamRef.current.getTracks().forEach((track) => track.stop());
      basicStreamRef.current = null;
    }
  }, []);

  const onStage = useCallback(
    (stage: ScanStage) => {
      setStage(stage);
      if (stage === 'error' || stage === 'preview') {
        setFallbackActive(true);
      }
      if (stage === 'found') {
        setMarkerLocked(true);
      }
      if (stage === 'lost' || stage === 'searching') {
        setMarkerLocked(false);
      }
    },
    [setFallbackActive, setMarkerLocked, setStage],
  );

  const mobile = useMemo(() => isProbablyMobile(), []);

  useEffect(() => {
    if (runtime.stage !== 'requesting_camera' && runtime.stage !== 'ready') return;

    const timer = window.setTimeout(() => {
      setErrorMessage('AR initialization timed out. Retry camera or use basic camera fallback.');
      setFallbackActive(true);
      setStage('error');
    }, 14000);

    return () => window.clearTimeout(timer);
  }, [runtime.stage, setErrorMessage, setFallbackActive, setStage]);

  useEffect(() => {
    if (!mobile) {
      setStage('preview');
      setFallbackActive(true);
    }
  }, [mobile, setFallbackActive, setStage]);

  useEffect(() => {
    if (!basicCameraMode) {
      stopBasicCamera();
      return;
    }

    let canceled = false;

    const startBasicCamera = async () => {
      try {
        if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
          throw new Error('Secure camera runtime is unavailable in this browser context');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });

        if (canceled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        basicStreamRef.current = stream;
        setCameraGranted(true);

        if (basicVideoRef.current) {
          basicVideoRef.current.srcObject = stream;
          await basicVideoRef.current.play().catch(() => undefined);
        }
      } catch (error) {
        setErrorMessage(toCameraErrorMessage(error));
        setBasicCameraMode(false);
      }
    };

    void startBasicCamera();

    return () => {
      canceled = true;
      stopBasicCamera();
    };
  }, [basicCameraMode, setCameraGranted, setErrorMessage, stopBasicCamera]);

  useEffect(() => {
    return () => {
      stopBasicCamera();
    };
  }, [stopBasicCamera]);

  const resetAndRetryAr = useCallback(() => {
    stopBasicCamera();
    setBasicCameraMode(false);
    setFallbackActive(false);
    setErrorMessage(null);
    setStage('requesting_camera');
    setBootNonce((value) => value + 1);
  }, [setErrorMessage, setFallbackActive, setStage, stopBasicCamera]);

  useMindArRuntime({
    containerRef,
    imageTargetSrc: scanTarget.customImageTargetSrc,
    fallbackImageTargetSrc: scanTarget.fallbackImageTargetSrc,
    onStage,
    onCameraGranted: setCameraGranted,
    onMarkerLocked: setMarkerLocked,
    onError: setErrorMessage,
    enabled: mobile,
    bootNonce,
  });

  return (
    <div className="min-h-[100dvh] bg-apple-bg">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-3 pb-2 pt-[max(env(safe-area-inset-top),0.75rem)]">
        <Link
          to={routes.intro}
          className="flex h-10 items-center justify-center rounded-full border border-apple-stroke bg-white px-4 text-sm text-apple-text"
        >
          {viewCopy.scan.back}
        </Link>
        <p className="text-sm font-medium text-apple-muted">{viewCopy.scan.title}</p>
        <button
          type="button"
          onClick={() => navigate(routes.afterScan)}
          className="flex h-10 items-center justify-center rounded-full bg-apple-accent px-4 text-sm font-medium text-white"
        >
          {viewCopy.scan.continue}
        </button>
      </header>

      <main className="relative mx-auto h-[calc(100dvh-4.2rem)] w-full max-w-6xl overflow-hidden bg-black sm:rounded-apple sm:border sm:border-apple-stroke">
        <div ref={containerRef} className="mindar-stage absolute inset-0 z-10 bg-black" />

        {basicCameraMode && (
          <video
            ref={basicVideoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 z-20 h-full w-full bg-black object-cover"
          />
        )}

        <ScanHUD runtime={runtime} isMobile={mobile} />

        {runtime.stage === 'error' && (
          <div className="absolute bottom-4 left-1/2 z-40 w-[min(92%,480px)] -translate-x-1/2 rounded-2xl border border-red-200 bg-apple-dangerSoft p-3 text-center text-sm text-red-700">
            <p className="font-medium">AR runtime failed</p>
            <p className="mt-1">Retry AR first. If still failing, open basic camera mode.</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={resetAndRetryAr}
                className="h-10 rounded-full bg-apple-accent px-5 text-sm font-medium text-white"
              >
                Retry AR
              </button>
              <button
                type="button"
                onClick={() => {
                  setFallbackActive(true);
                  setErrorMessage(null);
                  setBasicCameraMode(true);
                }}
                className="h-10 rounded-full border border-apple-stroke bg-white px-5 text-sm font-medium text-apple-text"
              >
                Open Basic Camera
              </button>
            </div>
          </div>
        )}

        {(runtime.stage === 'requesting_camera' || runtime.stage === 'ready') && !basicCameraMode && (
          <div className="absolute bottom-4 left-1/2 z-40 w-[min(92%,480px)] -translate-x-1/2 rounded-2xl border border-amber-200 bg-apple-warningSoft p-3 text-center text-sm text-amber-800">
            <p className="font-medium">If camera feed does not appear, retry manually</p>
            <button
              type="button"
              onClick={resetAndRetryAr}
              className="mt-3 h-10 rounded-full bg-apple-accent px-5 text-sm font-medium text-white"
            >
              Force Retry
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
