import type { ProductConfig } from '../../types/app';
import { baseRuntimeMessages, buildProductScanTarget, commonAfterScanCopy, commonIntroCopy } from './shared';

export const appleMacbook: ProductConfig = {
  id: 'apple-macbook',
  name: 'Apple MacBook Demo',
  intro: {
    ...commonIntroCopy,
    title: 'Scan the MacBook poster. Start the demo instantly.',
    subtitle: 'A focused AR flow for laptop product storytelling from poster to guided interaction.',
    helperBody: 'Use HTTPS on mobile, allow camera access, and keep the marker flat in frame for stable tracking.',
    referenceLabel: 'Open MacBook marker reference',
  },
  scan: {
    title: 'MacBook AR Scan Session',
    back: 'Back',
    continue: 'Continue',
    fallbackHelp: 'Need fallback help?',
    guidance: 'Point to the MacBook poster marker, reduce reflections, and hold still briefly.',
    runtimeMessages: baseRuntimeMessages('Marker locked. Present the MacBook feature story now.'),
  },
  afterScan: {
    ...commonAfterScanCopy,
    title: 'Complete the MacBook handoff',
    offerLabel: 'Open MacBook Offer Page',
  },
  scanTarget: buildProductScanTarget('apple-macbook'),
  offerCTA: {
    url: 'https://example.com/apple-macbook-offer',
    label: 'Open MacBook Offer Page',
  },
  hotspots: [
    {
      id: 'chip',
      label: 'Chip',
      title: 'Apple Silicon Performance',
      summary: 'Fast compile cycles, efficient multitasking, and consistent sustained speed.',
      x: -30,
      y: 30,
    },
    {
      id: 'display',
      label: 'Display',
      title: 'Liquid Retina Display',
      summary: 'Sharp detail, accurate color, and high brightness for design and media tasks.',
      x: -8,
      y: 44,
    },
    {
      id: 'battery',
      label: 'Battery',
      title: 'Long Battery Runtime',
      summary: 'Extended work sessions with less dependency on charging stops.',
      x: 18,
      y: 48,
    },
    {
      id: 'portability',
      label: 'Portable',
      title: 'Lightweight Build',
      summary: 'Portable chassis for campus presentations and mobile productivity.',
      x: 34,
      y: 58,
    },
  ],
};
