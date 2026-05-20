import type { ProductConfig } from '../../types/app';
import { baseRuntimeMessages, buildMvpScanTarget } from './shared';

export const appleMacbook: ProductConfig = {
  id: 'apple-macbook',
  name: 'MacBook Air Concept',
  scan: {
    title: 'AR Scan',
    guidance: 'Point your camera to the printed marker, reduce glare, and keep the full image visible.',
    desktopHint: 'Desktop is preview-only. Use Chrome Android or Safari iPhone for live camera scanning.',
    referenceLabel: 'Reference',
    lockHint: 'Lock the marker to enable 3D Detail and action buttons.',
    runtimeMessages: baseRuntimeMessages(
      'Marker locked. Use 3D Detail to inspect the model closer.',
    ),
  },
  scanPanel: {
    eyebrow: 'Live Overlay',
    title: 'Product Quick Brief',
    subtitle: 'Keep the marker locked while reviewing details and taking an action.',
    actionsHeading: 'Actions',
    mediaHeading: 'Product Summary',
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
  specifications: [
    {
      label: 'Model',
      value: 'MacBook Air Concept',
    },
    {
      label: 'Display',
      value: '13-inch Liquid Retina class',
    },
    {
      label: 'Chip Class',
      value: 'Apple Silicon performance class',
    },
    {
      label: 'Memory',
      value: '8 GB unified memory (base demo spec)',
    },
    {
      label: 'Storage',
      value: '256 GB SSD (base demo spec)',
    },
    {
      label: 'Battery',
      value: 'All-day battery class for mobile productivity',
    },
    {
      label: 'Weight',
      value: 'Lightweight portability class',
    },
  ],
  mediaPreviews: [
    {
      id: 'summary',
      label: 'Summary',
      headline: 'MacBook Air Concept',
      description: 'Lightweight productivity laptop concept showcased in marker-based WebAR.',
      points: [
        '3D runtime model: texture1k GLB for stable mobile loading.',
        'Detail viewer supports rotate and pinch zoom.',
        'Contact and Buy actions are available directly from scan state.',
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
