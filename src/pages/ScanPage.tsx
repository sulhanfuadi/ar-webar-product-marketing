import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMindArRuntime } from '../ar/mindarRuntime';
import { ModelDetailModal } from '../components/ModelDetailModal';
import { mvpProduct } from '../content/appContent';
import { useScanSession } from '../state/ScanSessionContext';
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const basicVideoRef = useRef<HTMLVideoElement | null>(null);
  const basicStreamRef = useRef<MediaStream | null>(null);

  const { runtime, setStage, setCameraGranted, setMarkerLocked, setFallbackActive, setErrorMessage } = useScanSession();

  const [bootNonce, setBootNonce] = useState(0);
  const [basicCameraMode, setBasicCameraMode] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

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
  const markerLocked = runtime.stage === 'found';

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
    setDetailOpen(false);
    setFallbackActive(false);
    setErrorMessage(null);
    setStage('requesting_camera');
    setBootNonce((value) => value + 1);
  }, [setErrorMessage, setFallbackActive, setStage, stopBasicCamera]);

  useEffect(() => {
    if (runtime.stage === 'lost' || runtime.stage === 'error') {
      setDetailOpen(false);
    }
  }, [runtime.stage]);

  useMindArRuntime({
    containerRef,
    imageTargetSrc: mvpProduct.scanTarget.mindTargetUrl,
    fallbackImageTargetSrc: mvpProduct.scanTarget.fallbackMindTargetUrl,
    productArModel: mvpProduct.arModel,
    onStage,
    onCameraGranted: setCameraGranted,
    onMarkerLocked: setMarkerLocked,
    onError: setErrorMessage,
    enabled: mobile,
    bootNonce,
  });

  return (
    <div className="min-h-[100dvh] bg-apple-bg p-2 sm:p-3">
      <main className="relative mx-auto h-[calc(100dvh-1rem)] w-full max-w-6xl overflow-hidden rounded-[28px] border border-apple-stroke bg-black shadow-apple">
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

        <div className="pointer-events-none absolute left-3 right-3 top-3 z-40">
          <header className="pointer-events-auto mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-white/25 bg-black/60 p-1.5 shadow-apple backdrop-blur-xl">
            <div className="flex min-w-0 flex-1 items-center gap-2 px-2">
              <span className="h-2 w-2 rounded-full bg-apple-accent" />
              <p className="truncate text-sm font-medium text-white">{mvpProduct.scan.title}</p>
            </div>
            <div className="flex items-center gap-2">
              {markerLocked && (
                <button
                  type="button"
                  onClick={() => setDetailOpen(true)}
                  className="inline-flex h-9 min-w-28 items-center justify-center rounded-full border border-white/30 bg-white/10 px-3 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  View Details
                </button>
              )}
              <button
                type="button"
                onClick={resetAndRetryAr}
                className="inline-flex h-9 min-w-24 items-center justify-center rounded-full bg-apple-accent px-3 text-sm font-medium text-white transition hover:brightness-105"
              >
                Restart
              </button>
            </div>
          </header>
        </div>

        {runtime.stage === 'error' && (
          <div className="absolute bottom-3 left-3 right-3 z-40">
            <article className="mx-auto w-full max-w-3xl rounded-2xl border border-apple-dangerStroke bg-black/60 p-4 text-white backdrop-blur-xl">
              <p className="text-sm font-semibold">AR runtime interrupted</p>
              <p className="mt-1 text-sm text-white/75">Retry AR first. If it still fails, open Basic Camera mode.</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={resetAndRetryAr}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-apple-accent px-5 text-sm font-medium text-white transition hover:brightness-105"
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
                  className="inline-flex h-10 items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  Open Basic Camera
                </button>
              </div>
            </article>
          </div>
        )}

        {(runtime.stage === 'requesting_camera' || runtime.stage === 'ready') && !basicCameraMode && !markerLocked && (
          <div className="absolute bottom-3 left-3 right-3 z-40">
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-apple-warningStroke bg-black/60 p-4 text-white backdrop-blur-xl">
              <p className="text-sm text-white/80">If camera feed does not appear, run a manual retry.</p>
              <button
                type="button"
                onClick={resetAndRetryAr}
                className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-apple-accent px-5 text-sm font-medium text-white transition hover:brightness-105"
              >
                Force Retry
              </button>
            </div>
          </div>
        )}
      </main>
      <ModelDetailModal
        open={detailOpen}
        modelUrl={mvpProduct.arModel?.url ?? '/assets/models/apple-macbook/model.glb'}
        title={mvpProduct.name}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
