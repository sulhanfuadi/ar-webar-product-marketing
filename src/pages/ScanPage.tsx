import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FeatureHotspots } from '../components/FeatureHotspots';
import { ScanHUD } from '../components/ScanHUD';
import { routes, scanTarget, viewCopy } from '../content/appContent';
import { useScanSession } from '../state/ScanSessionContext';
import { useMindArRuntime } from '../ar/mindarRuntime';
import type { ScanStage } from '../types/app';

function isProbablyMobile() {
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent || '');
}

export function ScanPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { runtime, setStage, setCameraGranted, setMarkerLocked, setFallbackActive } = useScanSession();

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
    if (!mobile) {
      setStage('preview');
      setFallbackActive(true);
    }
  }, [mobile, setFallbackActive, setStage]);

  useMindArRuntime({
    containerRef,
    imageTargetSrc: scanTarget.customImageTargetSrc,
    fallbackImageTargetSrc: scanTarget.fallbackImageTargetSrc,
    onStage,
    onCameraGranted: setCameraGranted,
    onMarkerLocked: setMarkerLocked,
    enabled: mobile,
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

      <main className="relative mx-auto h-[calc(100dvh-4.2rem)] w-full max-w-6xl overflow-hidden border-y border-apple-stroke bg-black sm:rounded-apple sm:border">
        <div ref={containerRef} className="absolute inset-0 z-10 bg-black" />
        <ScanHUD runtime={runtime} isMobile={mobile} />
        <FeatureHotspots />
      </main>
    </div>
  );
}
