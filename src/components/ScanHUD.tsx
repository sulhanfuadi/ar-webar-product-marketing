import { operatorGuidance } from '../content/appContent';
import type { ScanRuntimeMessages, ScanRuntimeState } from '../types/app';

interface ScanHUDProps {
  runtime: ScanRuntimeState;
  isMobile: boolean;
  runtimeMessages: ScanRuntimeMessages;
  desktopHint: string;
  guidanceText: string;
  lockHint: string;
  fallbackNotice?: string | null;
}

export function ScanHUD({ runtime, isMobile, runtimeMessages, desktopHint, guidanceText, lockHint, fallbackNotice }: ScanHUDProps) {
  const message = runtimeMessages[runtime.stage] ?? runtimeMessages.idle;

  return (
    <div className="pointer-events-none absolute left-3 right-3 top-[4.2rem] z-30 space-y-2">
      {fallbackNotice && (
        <div className="pointer-events-auto rounded-2xl border border-apple-warningStroke bg-apple-warningSoft p-3 text-xs text-apple-warningText">
          {fallbackNotice}
        </div>
      )}

      <div className="pointer-events-auto rounded-2xl border border-apple-stroke bg-white/92 p-3 shadow-apple backdrop-blur">
        <p className="text-[11px] uppercase tracking-[0.11em] text-apple-muted">Tracking Status</p>
        <h2 className="mt-1 text-sm font-semibold text-apple-text">{message}</h2>
        <p className="mt-1 text-xs leading-relaxed text-apple-muted">
          {runtime.stage === 'lost' ? operatorGuidance.markerLost : guidanceText}
        </p>
        {(runtime.stage === 'requesting_camera' || runtime.stage === 'ready' || runtime.stage === 'searching') && (
          <p className="mt-2 rounded-lg border border-apple-warningStroke bg-apple-warningSoft px-2 py-1.5 text-[11px] text-apple-warningText">
            {lockHint}
          </p>
        )}
      </div>

      {runtime.stage === 'error' && (
        <div className="pointer-events-auto rounded-2xl border border-apple-dangerStroke bg-apple-dangerSoft p-3 text-xs text-apple-dangerText">
          <p className="font-medium">AR camera runtime failed.</p>
          <p className="mt-1">{runtime.errorMessage ?? 'Use Retry AR, or switch to Basic Camera mode.'}</p>
        </div>
      )}

      {!isMobile && (
        <div className="pointer-events-auto rounded-2xl border border-apple-dangerStroke bg-apple-dangerSoft p-3 text-xs text-apple-dangerText">
          {desktopHint}
        </div>
      )}
    </div>
  );
}
