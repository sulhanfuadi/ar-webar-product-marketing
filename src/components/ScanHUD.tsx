import { runtimeMessages, operatorGuidance, viewCopy } from '../content/appContent';
import type { ScanRuntimeState } from '../types/app';

export function ScanHUD({ runtime, isMobile }: { runtime: ScanRuntimeState; isMobile: boolean }) {
  const message = runtimeMessages[runtime.stage] ?? runtimeMessages.idle;

  return (
    <div className="pointer-events-none absolute left-3 right-3 top-3 z-30 space-y-2">
      <div className="pointer-events-auto rounded-2xl border border-apple-stroke bg-white/92 p-3 shadow-apple backdrop-blur">
        <p className="text-[11px] uppercase tracking-[0.11em] text-apple-muted">Scan Status</p>
        <h2 className="mt-1 text-sm font-semibold text-apple-text">{message}</h2>
        <p className="mt-1 text-xs leading-relaxed text-apple-muted">
          {runtime.stage === 'lost' ? operatorGuidance.markerLost : operatorGuidance.markerSlow}
        </p>
      </div>

      {runtime.stage === 'error' && (
        <div className="pointer-events-auto rounded-2xl border border-red-200 bg-apple-dangerSoft p-3 text-xs text-red-700">
          AR camera runtime failed. Please open this page in Chrome Android or Safari iPhone and allow camera access.
        </div>
      )}

      {!isMobile && (
        <div className="pointer-events-auto rounded-2xl border border-red-200 bg-apple-dangerSoft p-3 text-xs text-red-700">
          {viewCopy.intro.desktopHint}
        </div>
      )}
    </div>
  );
}
