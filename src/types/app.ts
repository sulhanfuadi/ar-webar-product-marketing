export type ScanStage =
  | 'idle'
  | 'requesting_camera'
  | 'ready'
  | 'searching'
  | 'found'
  | 'lost'
  | 'error'
  | 'preview';

export interface ScanRuntimeState {
  stage: ScanStage;
  cameraGranted: boolean;
  markerLocked: boolean;
  fallbackActive: boolean;
  errorMessage: string | null;
}

export interface ThemeTokens {
  base: string;
  surface: string;
  text: string;
  muted: string;
  stroke: string;
  accent: string;
}

export interface ScanRuntimeMessages {
  idle: string;
  requesting_camera: string;
  ready: string;
  searching: string;
  found: string;
  lost: string;
  error: string;
  preview: string;
}

export interface ScanTargetConfig {
  mindTargetUrl: string;
  fallbackMindTargetUrl?: string;
  referenceImageUrl: string;
}

export interface ProductArModelConfig {
  url: string;
  scale: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface ProductHotspot {
  id: string;
  label: string;
  title: string;
  summary: string;
  x: number;
  y: number;
}

export interface ProductAction {
  id: string;
  label: string;
  url: string;
  style: 'primary' | 'secondary' | 'outline';
}

export interface ProductMediaPreview {
  id: '2d' | '3d' | string;
  label: string;
  headline: string;
  description: string;
  points: string[];
}

export interface ProductScanCopy {
  title: string;
  guidance: string;
  desktopHint: string;
  referenceLabel: string;
  lockHint: string;
  runtimeMessages: ScanRuntimeMessages;
}

export interface ProductScanPanelCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  actionsHeading: string;
  mediaHeading: string;
}

export interface ProductConfig {
  id: string;
  name: string;
  scan: ProductScanCopy;
  scanPanel: ProductScanPanelCopy;
  scanTarget: ScanTargetConfig;
  arModel?: ProductArModelConfig;
  actions: ProductAction[];
  mediaPreviews: ProductMediaPreview[];
  hotspots: ProductHotspot[];
}
