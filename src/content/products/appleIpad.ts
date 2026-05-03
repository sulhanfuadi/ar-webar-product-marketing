import type { ProductConfig } from '../../types/app';
import { baseRuntimeMessages, buildProductScanTarget, commonAfterScanCopy, commonIntroCopy } from './shared';

export const appleIpad: ProductConfig = {
  id: 'apple-ipad',
  name: 'Apple iPad Demo',
  intro: {
    ...commonIntroCopy,
    title: 'Scan the iPad poster. Start the demo instantly.',
    subtitle: 'A visual AR handoff for creativity, study, note-taking, and portable productivity.',
    helperBody: 'Use HTTPS on mobile, allow camera access, and keep the iPad poster marker flat in frame.',
    referenceLabel: 'Open iPad marker reference',
  },
  scan: {
    title: 'iPad AR Scan Session',
    back: 'Back',
    continue: 'Continue',
    fallbackHelp: 'Need fallback help?',
    guidance: 'Point to the iPad poster marker, reduce reflections, and hold still briefly.',
    runtimeMessages: baseRuntimeMessages('Marker locked. Present the iPad feature story now.'),
  },
  afterScan: {
    ...commonAfterScanCopy,
    title: 'Complete the iPad handoff',
    offerLabel: 'Open iPad Offer Page',
  },
  scanTarget: buildProductScanTarget('apple-ipad'),
  offerCTA: {
    url: 'https://example.com/apple-ipad-offer',
    label: 'Open iPad Offer Page',
  },
  hotspots: [
    {
      id: 'display',
      label: 'Canvas',
      title: 'Large Creative Canvas',
      summary: 'Spacious display for sketching, reading, browsing, and split-screen workflows.',
      x: -32,
      y: 28,
    },
    {
      id: 'pencil',
      label: 'Pencil',
      title: 'Apple Pencil Workflow',
      summary: 'Precise input for notes, diagrams, annotations, and creative drafts.',
      x: -8,
      y: 48,
    },
    {
      id: 'keyboard',
      label: 'Keyboard',
      title: 'Keyboard Productivity',
      summary: 'Flexible typing setup for documents, emails, and presentation preparation.',
      x: 20,
      y: 50,
    },
    {
      id: 'apps',
      label: 'Apps',
      title: 'App Ecosystem',
      summary: 'Creative, study, and productivity apps make iPad useful across tasks.',
      x: 36,
      y: 60,
    },
  ],
};
