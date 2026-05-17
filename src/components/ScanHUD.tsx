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

function stageTone(stage: ScanRuntimeState['stage']) {
  if (stage === 'found') return 'border-apple-successStroke bg-apple-successSoft text-apple-successText';
  if (stage === 'error') return 'border-apple-dangerStroke bg-apple-dangerSoft text-apple-dangerText';
  return 'border-apple-warningStroke bg-apple-warningSoft text-apple-warningText';
}

function formatStageLabel(stage: ScanRuntimeState['stage']) {
  return stage.replaceAll('_', ' ');
}

export function ScanHUD({ runtime, isMobile, runtimeMessages, desktopHint, guidanceText, lockHint, fallbackNotice }: ScanHUDProps) {
  const message = runtimeMessages[runtime.stage] ?? runtimeMessages.idle;

  return (
    <div className="pointer-events-none absolute left-3 right-3 top-[4.7rem] z-30 space-y-2">
      {fallbackNotice && (
        <div className="pointer-events-auto rounded-2xl border border-white/25 bg-black/60 p-3 text-xs text-white/80 backdrop-blur-xl">
          {fallbackNotice}
        </div>
      )}

      <div className="pointer-events-auto rounded-2xl border border-white/25 bg-black/60 p-4 shadow-apple backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] uppercase tracking-[0.12em] text-white/60">Tracking</p>
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${stageTone(runtime.stage)}`}>
            {formatStageLabel(runtime.stage)}
          </span>
        </div>
        <h2 className="mt-2 text-lg font-semibold leading-tight text-white">{message}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/75">
          {runtime.stage === 'lost' ? operatorGuidance.markerLost : guidanceText}
        </p>
        {(runtime.stage === 'requesting_camera' || runtime.stage === 'ready' || runtime.stage === 'searching') && (
          <p className="mt-3 rounded-xl border border-apple-warningStroke bg-apple-warningSoft px-3 py-2 text-xs text-apple-warningText">
            {lockHint}
          </p>
        )}
      </div>

      {runtime.stage === 'error' && (
        <div className="pointer-events-auto rounded-2xl border border-apple-dangerStroke bg-black/60 p-3 text-xs text-white backdrop-blur-xl">
          <p className="font-medium">Camera runtime failed.</p>
          <p className="mt-1 text-white/75">{runtime.errorMessage ?? 'Use Retry AR, or switch to Basic Camera mode.'}</p>
        </div>
      )}

      {!isMobile && (
        <div className="pointer-events-auto rounded-2xl border border-apple-warningStroke bg-apple-warningSoft p-3 text-xs text-apple-warningText">
          {desktopHint}
        </div>
      )}
    </div>
  );
}
