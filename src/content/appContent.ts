import type { ProductConfig, ThemeTokens } from '../types/app';
import { appleMacbook } from './products/appleMacbook';

export const routes = {
  root: '/',
  scan: '/scan',
} as const;

export const themeTokens: ThemeTokens = {
  base: '#f5f5f7',
  surface: '#ffffff',
  text: '#1d1d1f',
  muted: '#6e6e73',
  stroke: '#d2d2d7',
  accent: '#0071e3',
};

export const mvpProduct: ProductConfig = appleMacbook;

export const operatorGuidance = {
  markerSlow: 'Flatten poster, reduce glare, and keep full marker in frame.',
  markerLost: 'Hold device steady, then re-center marker for lock recovery.',
  cameraDenied: 'Enable camera permission for this origin and reopen scan.',
  sceneDelayed: 'Wait a few seconds or refresh if camera feed remains delayed.',
} as const;

export const appMeta = {
  appName: 'Apple Product Scan-First AR MVP',
  supportedMobile: 'Chrome Android / Safari iPhone',
};
