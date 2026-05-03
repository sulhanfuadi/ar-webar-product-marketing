import type { ProductConfig } from '../../types/app';
import { baseRuntimeMessages, buildProductScanTarget, commonAfterScanCopy, commonIntroCopy } from './shared';

export const appleIphone: ProductConfig = {
  id: 'apple-iphone',
  name: 'Apple iPhone Demo',
  intro: {
    ...commonIntroCopy,
    title: 'Scan the iPhone poster. Start the demo instantly.',
    subtitle: 'An AR-first flow that turns static smartphone poster storytelling into live interaction.',
    helperBody:
      'Use a modern mobile browser over HTTPS, allow camera access, and keep the marker fully visible in frame.',
    referenceLabel: 'Open iPhone marker reference',
  },
  scan: {
    title: 'iPhone AR Scan Session',
    back: 'Back',
    continue: 'Continue',
    fallbackHelp: 'Need fallback help?',
    guidance: 'Point to the iPhone poster marker, reduce glare, and hold stable for 1–2 seconds.',
    runtimeMessages: baseRuntimeMessages('Marker locked. Present the iPhone feature story now.'),
  },
  afterScan: {
    ...commonAfterScanCopy,
    title: 'Complete the iPhone handoff',
    offerLabel: 'Open iPhone Offer Page',
  },
  scanTarget: buildProductScanTarget('apple-iphone'),
  offerCTA: {
    url: 'https://example.com/apple-iphone-offer',
    label: 'Open iPhone Offer Page',
  },
  hotspots: [
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
  ],
};
