import type { ProductConfig } from '../../types/app';
import { baseRuntimeMessages, buildProductScanTarget, commonAfterScanCopy, commonIntroCopy } from './shared';

export const appleWatch: ProductConfig = {
  id: 'apple-watch',
  name: 'Apple Watch Demo',
  intro: {
    ...commonIntroCopy,
    title: 'Scan the Apple Watch poster. Start the demo instantly.',
    subtitle: 'A compact AR story for health, activity, notifications, and everyday convenience.',
    helperBody: 'Use HTTPS on mobile, allow camera access, and keep the Apple Watch poster marker visible.',
    referenceLabel: 'Open Apple Watch marker reference',
  },
  scan: {
    title: 'Apple Watch AR Scan Session',
    back: 'Back',
    continue: 'Continue',
    fallbackHelp: 'Need fallback help?',
    guidance: 'Point to the Apple Watch poster marker, reduce glare, and hold the frame steady.',
    runtimeMessages: baseRuntimeMessages('Marker locked. Present the Apple Watch feature story now.'),
  },
  afterScan: {
    ...commonAfterScanCopy,
    title: 'Complete the Apple Watch handoff',
    offerLabel: 'Open Apple Watch Offer Page',
  },
  scanTarget: buildProductScanTarget('apple-watch'),
  offerCTA: {
    url: 'https://example.com/apple-watch-offer',
    label: 'Open Apple Watch Offer Page',
  },
  hotspots: [
    {
      id: 'health',
      label: 'Health',
      title: 'Health Insights',
      summary: 'Daily metrics help users understand movement, recovery, and wellness signals.',
      x: -34,
      y: 28,
    },
    {
      id: 'fitness',
      label: 'Fitness',
      title: 'Workout Tracking',
      summary: 'Activity and workout tracking supports consistent movement goals.',
      x: -10,
      y: 46,
    },
    {
      id: 'notifications',
      label: 'Alerts',
      title: 'Glanceable Notifications',
      summary: 'Important calls, messages, and reminders stay visible without reaching for a phone.',
      x: 18,
      y: 44,
    },
    {
      id: 'safety',
      label: 'Safety',
      title: 'Safety Features',
      summary: 'Emergency and location-aware features support confidence during daily routines.',
      x: 36,
      y: 60,
    },
  ],
};
