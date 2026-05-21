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
      label: 'Source Sync',
      value: 'Detailed summary synced on May 21, 2026',
      details: [
        'Primary buy page: https://www.apple.com/shop/buy-mac/macbook-air',
        'Technical specs page: https://www.apple.com/macbook-air/specs/',
      ],
    },
    {
      label: 'Model Lineup',
      value: 'MacBook Air is offered in 13-inch and 15-inch sizes',
      details: [
        '13-inch lineup: M5 chip with 10-core CPU plus 8-core or 10-core GPU.',
        '15-inch lineup: M5 chip with 10-core CPU and 10-core GPU.',
        'Base buy configuration starts at 16GB unified memory and 512GB SSD in current store listing.',
      ],
    },
    {
      label: 'Color Options',
      value: 'Sky Blue, Silver, Starlight, Midnight',
      details: [
        'All finishes are shown as available options in the official buy flow.',
        'Color availability can vary by region and stock.',
      ],
    },
    {
      label: 'Chip Platform (M5)',
      value: '10-core CPU with hardware-accelerated graphics features',
      details: [
        'GPU options include 8-core and 10-core variants depending on selected model.',
        '16-core Neural Engine is listed in the technical specification.',
        'Hardware acceleration includes ray tracing, mesh shading, and media encode/decode engines.',
        'Memory bandwidth shown on the spec page is up to 120GB/s.',
      ],
    },
    {
      label: 'Unified Memory',
      value: 'Starts at 16GB with configurable upgrades',
      details: [
        'Buy flow shows base 16GB unified memory.',
        'Configurable options shown include 24GB and 32GB on selected variants.',
      ],
    },
    {
      label: 'SSD Storage',
      value: 'Starts at 512GB with higher configurable capacities',
      details: [
        'Buy flow includes 512GB as base on the listed M5 configurations.',
        'Configurable upgrades include 1TB, 2TB, and 4TB options (variant dependent).',
      ],
    },
    {
      label: 'Display — 13-inch',
      value: '13.6-inch Liquid Retina display (2560×1664)',
      details: [
        '500 nits brightness, Wide color (P3), and True Tone.',
        'Full native resolution supports millions of colors.',
      ],
    },
    {
      label: 'Display — 15-inch',
      value: '15.3-inch Liquid Retina display (2880×1864)',
      details: [
        '500 nits brightness, Wide color (P3), and True Tone.',
        'Designed for larger workspace while staying in the Air form factor.',
      ],
    },
    {
      label: 'Camera & Audio',
      value: '12MP Center Stage camera with multi-mic and Spatial Audio support',
      details: [
        'Camera supports 1080p HD video recording and advanced image signal processing.',
        'Three-mic array with directional beamforming and voice isolation modes.',
        '13-inch model: four-speaker system.',
        '15-inch model: six-speaker system with force-cancelling woofers.',
      ],
    },
    {
      label: 'Battery & Power',
      value: 'All-day battery profile with fast-charge support',
      details: [
        '13-inch battery: up to 18 hours video playback, up to 15 hours wireless web.',
        '15-inch battery: up to 18 hours video playback, up to 15 hours wireless web.',
        'Fast-charge support is listed with optional higher-watt USB-C adapters.',
        'MagSafe 3 charging plus USB-C charging are supported.',
      ],
    },
    {
      label: 'Ports & Connectivity',
      value: 'MagSafe 3, two Thunderbolt 4 / USB-C, 3.5 mm audio jack',
      details: [
        'Wi‑Fi 6E and Bluetooth 5.3 listed in current technical specifications.',
        'External display support includes up to two external displays with lid closed on supported setup.',
      ],
    },
    {
      label: 'Input & Security',
      value: 'Magic Keyboard, Touch ID, and large Force Touch trackpad',
      details: [
        'Backlit Magic Keyboard with full-height function row.',
        'Touch ID for secure unlock, authentication, and payments.',
        'Large Force Touch trackpad supports pressure-sensitive interactions.',
      ],
    },
    {
      label: 'Physical Design',
      value: 'Thin aluminum enclosure built for portability',
      details: [
        '13-inch: approximately 11.97 × 8.46 × 0.44 inches, around 2.7 lb.',
        '15-inch: approximately 13.40 × 9.35 × 0.45 inches, around 3.3 lb.',
      ],
    },
    {
      label: 'In the Box',
      value: 'MacBook Air, USB-C to MagSafe 3 cable, and USB-C power adapter',
      details: [
        'Adapter wattage may differ by chosen model and charging option.',
      ],
    },
    {
      label: 'Purchase Programs',
      value: 'Financing, trade-in, and education channels are available',
      details: [
        'Buy page highlights Apple Card Monthly Installments in supported markets.',
        'Trade-in program provides estimated credit values based on device condition.',
        'Education pricing and seasonal offers can be available through dedicated education store paths.',
      ],
    },
    {
      label: 'Protection & Support',
      value: 'AppleCare+ options and onboarding services are offered',
      details: [
        'Buy page includes AppleCare+ selection during checkout.',
        'Personal Setup and migration support are promoted for new buyers.',
        'Standard return policies and delivery options are shown in FAQ sections.',
      ],
    },
    {
      label: 'Important Note',
      value: 'Apple updates configurations, price, and availability regularly',
      details: [
        'Use the Buy button for the latest real-time options before final purchase decisions.',
      ],
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
