import type { ThemeTokens } from '../types/app';

export const routes = {
  intro: '/',
  scan: '/scan',
  afterScan: '/after-scan',
} as const;

export const themeTokens: ThemeTokens = {
  base: '#f5f5f7',
  surface: '#ffffff',
  text: '#1d1d1f',
  muted: '#6e6e73',
  stroke: '#d2d2d7',
  accent: '#0071e3',
};

export const viewCopy = {
  intro: {
    eyebrow: 'Academic WebAR Showcase',
    title: 'Scan your poster. Start the demo instantly.',
    subtitle: 'A clean AR-first journey for Apple device storytelling from print to interaction.',
    primaryCta: 'Start AR Scan',
    helperLabel: 'How to scan',
    helperBody:
      'Use a modern mobile browser over HTTPS, allow camera access, and keep the marker fully visible in frame.',
    desktopHint:
      'Desktop is preview-only. For full camera scan, open this link from Chrome Android or Safari iPhone.',
  },
  scan: {
    title: 'AR Scan Session',
    back: 'Back',
    continue: 'Continue',
    fallbackHelp: 'Need fallback help?',
    guidance:
      'Point to marker and keep 20–35 cm distance, reduce glare, and hold the frame stable for 1–2 seconds.',
    runtimeMessages: {
      idle: 'Ready to start AR scan.',
      requesting_camera: 'Requesting camera permission…',
      ready: 'Camera ready. Initializing tracking…',
      searching: 'Marker not locked yet. Move closer and keep marker fully visible.',
      found: 'Marker locked. Present the feature story now.',
      lost: 'Marker lost. Re-center the marker to restore tracking.',
      error: 'Camera or AR runtime failed. Use fallback preview flow.',
      preview: 'Preview mode only. Use mobile for full scan validation.',
    },
  },
  afterScan: {
    eyebrow: 'After scan',
    title: 'Complete the handoff',
    subtitle: 'Move from AR interaction to one clear conversion action.',
    offerLabel: 'Open Offer Page',
    backToScan: 'Back to Scan',
    restart: 'Restart Demo',
  },
} as const;

export const runtimeMessages = viewCopy.scan.runtimeMessages;

export const operatorGuidance = {
  markerSlow: 'Flatten poster, reduce glare, and keep full marker in frame.',
  markerLost: 'Hold device steady, then re-center marker for lock recovery.',
  cameraDenied: 'Enable camera permission for this origin and reopen scan.',
  sceneDelayed: 'Wait a few seconds or refresh if camera feed remains delayed.',
} as const;

export const hotspots = [
  {
    id: 'camera',
    label: 'Camera',
    title: 'Pro Camera System',
    summary: 'Portrait depth control, stable video, and reliable low-light output.',
    x: -34,
    y: 24,
  },
  {
    id: 'display',
    label: 'Display',
    title: 'High-Refresh Display',
    summary: 'Smooth motion, color accuracy, and bright outdoor readability.',
    x: -10,
    y: 45,
  },
  {
    id: 'performance',
    label: 'Performance',
    title: 'Flagship Silicon',
    summary: 'Fast app switching, efficient sustained performance, and lower thermal spikes.',
    x: 16,
    y: 38,
  },
  {
    id: 'battery',
    label: 'Battery',
    title: 'All-Day Battery',
    summary: 'Long endurance and fast top-up flow for high-mobility usage.',
    x: 36,
    y: 55,
  },
] as const;

export const offerCTA = {
  url: 'https://example.com/apple-device-offer',
  label: viewCopy.afterScan.offerLabel,
};

export const scanTarget = {
  customImageTargetSrc:
    import.meta.env.VITE_MINDAR_TARGET_URL ||
    'https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind',
  fallbackImageTargetSrc:
    'https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.mind',
  referenceImage:
    'https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/image-tracking/assets/card-example/card.png',
};

export const appMeta = {
  appName: 'Apple Devices Smart Poster AR Demo',
  supportedMobile: 'Chrome Android / Safari iPhone',
};
