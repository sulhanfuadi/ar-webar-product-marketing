import type { ProductConfig, ThemeTokens } from '../types/app';
import { appleMacbook } from './products/appleMacbook';

export const routes = {
  root: '/',
  scan: '/scan',
} as const;

export const themeTokens: ThemeTokens = {
  base: '#f2f3f5',
  surface: '#ffffff',
  text: '#121417',
  muted: '#616770',
  stroke: '#d8dce2',
  accent: '#1f7a5a',
};

export const mvpProduct: ProductConfig = appleMacbook;

export const operatorGuidance = {
  markerSlow: 'Flatten poster, reduce glare, and keep full marker in frame.',
  markerLost: 'Hold device steady, then re-center marker for lock recovery.',
  cameraDenied: 'Enable camera permission for this origin and reopen scan.',
  sceneDelayed: 'Wait a few seconds or refresh if camera feed remains delayed.',
} as const;

export const appMeta = {
  appName: 'Product Scan-First AR MVP',
  supportedMobile: 'Chrome Android / Safari iPhone',
};
