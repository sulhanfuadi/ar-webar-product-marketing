import type { ProductConfig } from '../../types/app';
import { baseRuntimeMessages, buildProductScanTarget, commonAfterScanCopy, commonIntroCopy } from './shared';

export const appleAirpods: ProductConfig = {
  id: 'apple-airpods',
  name: 'Apple AirPods Demo',
  intro: {
    ...commonIntroCopy,
    title: 'Scan the AirPods poster. Start the demo instantly.',
    subtitle: 'A lightweight AR story for wireless audio, comfort, and everyday listening moments.',
    helperBody: 'Use HTTPS on mobile, allow camera access, and keep the AirPods poster marker fully visible.',
    referenceLabel: 'Open AirPods marker reference',
  },
  scan: {
    title: 'AirPods AR Scan Session',
    back: 'Back',
    continue: 'Continue',
    fallbackHelp: 'Need fallback help?',
    guidance: 'Point to the AirPods poster marker, avoid glare, and keep the frame stable.',
    runtimeMessages: baseRuntimeMessages('Marker locked. Present the AirPods feature story now.'),
  },
  afterScan: {
    ...commonAfterScanCopy,
    title: 'Complete the AirPods handoff',
    offerLabel: 'Open AirPods Offer Page',
  },
  scanTarget: buildProductScanTarget('apple-airpods'),
  offerCTA: {
    url: 'https://example.com/apple-airpods-offer',
    label: 'Open AirPods Offer Page',
  },
  hotspots: [
    {
      id: 'audio',
      label: 'Audio',
      title: 'Immersive Audio',
      summary: 'Clear sound, spatial listening cues, and balanced detail for music and calls.',
      x: -32,
      y: 30,
    },
    {
      id: 'noise',
      label: 'ANC',
      title: 'Noise Control',
      summary: 'Active noise control helps focus during travel, study, and work sessions.',
      x: -8,
      y: 44,
    },
    {
      id: 'comfort',
      label: 'Fit',
      title: 'Comfortable Fit',
      summary: 'Lightweight design supports long listening sessions with less fatigue.',
      x: 18,
      y: 42,
    },
    {
      id: 'case',
      label: 'Case',
      title: 'Charging Case',
      summary: 'Portable case keeps earbuds protected and ready for quick top-ups.',
      x: 36,
      y: 58,
    },
  ],
};
