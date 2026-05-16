import type { ScanRuntimeMessages, ScanTargetConfig } from '../../types/app';

const sampleMindTargetUrl =
  'https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind';

export const sampleReferenceImageUrl =
  'https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.png';

export const mvpMarkerPaths = {
  mindTargetUrl: '/assets/markers/mvp/macbook-air/target.mind',
  referenceImageUrl: '/assets/markers/mvp/macbook-air/reference.png',
} as const;

export function buildMvpScanTarget(): ScanTargetConfig {
  return {
    mindTargetUrl: mvpMarkerPaths.mindTargetUrl,
    fallbackMindTargetUrl: import.meta.env.VITE_MINDAR_TARGET_URL || sampleMindTargetUrl,
    referenceImageUrl: mvpMarkerPaths.referenceImageUrl,
  };
}

export const fallbackSampleScanTarget: ScanTargetConfig = {
  mindTargetUrl: sampleMindTargetUrl,
  fallbackMindTargetUrl: sampleMindTargetUrl,
  referenceImageUrl: sampleReferenceImageUrl,
};

export const baseRuntimeMessages = (foundMessage: string): ScanRuntimeMessages => ({
  idle: 'Ready to start AR scan.',
  requesting_camera: 'Requesting camera permission…',
  ready: 'Camera ready. Initializing tracking…',
  searching: 'Marker not locked yet. Move closer and keep the full marker in frame.',
  found: foundMessage,
  lost: 'Marker lost. Re-center the marker to restore tracking.',
  error: 'Camera or AR runtime failed.',
  preview: 'Preview mode only. Use a mobile device for full scan validation.',
});
