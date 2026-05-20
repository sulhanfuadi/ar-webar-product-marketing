import type { ProductConfig } from '../../types/app';
import { baseRuntimeMessages, buildMvpScanTarget } from './shared';

export const appleMacbook: ProductConfig = {
  id: 'apple-macbook',
  name: 'Product AR Demo',
  scan: {
    title: 'AR Scan',
    guidance: 'Point your camera to the printed marker, reduce glare, and keep the full image visible.',
    desktopHint: 'Desktop is preview-only. Use Chrome Android or Safari iPhone for live camera scanning.',
    referenceLabel: 'Reference',
    lockHint: 'Lock the marker to enable the View Details button.',
    runtimeMessages: baseRuntimeMessages(
      'Marker locked. Use View Details to inspect the 3D model.',
    ),
  },
  scanPanel: {
    eyebrow: 'Live Overlay',
    title: 'Product Quick Brief',
    subtitle: 'Keep the marker locked while reviewing key details and conversion actions.',
    actionsHeading: 'Actions',
    mediaHeading: '2D / 3D Preview',
  },
  scanTarget: buildMvpScanTarget(),
  arModel: {
    url: '/assets/models/apple-macbook/model.glb',
    scale: [0.9, 0.9, 0.9],
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  actions: [
    {
      id: 'detail',
      label: 'Details',
      url: 'https://www.apple.com/macbook-air/',
      style: 'secondary',
    },
    {
      id: 'contact',
      label: 'Contact',
      url: 'https://wa.me/6285291105501?text=Hello%2C%20I%27m%20interested%20in%20the%20AR%20MacBook%20Air%20demo.%20Could%20you%20share%20more%20details%3F',
      style: 'outline',
    },
    {
      id: 'buy',
      label: 'Buy',
      url: 'https://www.apple.com/shop/buy-mac/macbook-air',
      style: 'primary',
    },
  ],
  mediaPreviews: [
    {
      id: '2d',
      label: '2D',
      headline: '2D Product Information',
      description:
        'This placeholder simulates a clean 2D information card displayed directly in the scan experience.',
      points: [
        'Chip: high-efficiency performance class for daily productivity.',
        'Battery: all-day usage claim for MVP presentation purposes.',
        'Display: high-resolution panel with accurate color profile.',
      ],
    },
    {
      id: '3d',
      label: '3D',
      headline: '3D Preview Placeholder',
      description:
        'Final 3D model can be upgraded later while preserving the same scan and conversion flow.',
      points: [
        'Current runtime still uses a fallback mesh if no GLB is available.',
        'Model path contract remains `/assets/models/apple-macbook/model.glb`.',
        'Safe for MVP demos while final 3D assets are still in progress.',
      ],
    },
  ],
  hotspots: [
    {
      id: 'chip',
      label: 'Chip',
      title: 'Silicon-Class Performance',
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
