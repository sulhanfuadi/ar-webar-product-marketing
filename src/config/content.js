const BASE_URL = import.meta.env.BASE_URL || '/';

function withBase(path) {
  return `${BASE_URL.replace(/\/$/, '')}${path}`;
}

export const appConfig = {
  appName: 'Apple Devices Smart Poster AR Demo',
  appEyebrow: 'Academic WebAR Showcase',
  appDescription:
    'A marker-based WebAR demo for Apple device campaigns, designed as a minimal scan-first flow for live presentations.',
  supportUrl: 'https://example.com/apple-device-offer',
  deploy: {
    recommendedTarget: 'Vercel',
    requiresHttps: true,
    previewUrlHint: 'Use HTTPS on mobile browsers to enable full camera behavior for AR scanning.',
  },
  runtime: {
    markerSearchTimeoutMs: 12000,
    markerLostCooldownMs: 2200,
    sceneReadyTimeoutMs: 7000,
    chatbotRequestTimeoutMs: 4500,
  },
  views: {
    intro_minimal: {
      id: 'intro_minimal',
      title: 'Scan your poster. Start the demo instantly.',
      subtitle: 'A clean AR-first journey for Apple device storytelling from print to interaction.',
      primaryCtaLabel: 'Start AR Scan',
      helperLabel: 'How to scan',
      helperBody:
        'Use a modern mobile browser over HTTPS or localhost, allow camera access, and place the marker fully inside the frame.',
      desktopPreview:
        'Desktop is preview-only. Use a modern mobile browser for real marker lock and camera validation.',
    },
    ar_scan: {
      id: 'ar_scan',
      fallbackHintLabel: 'Need fallback help?',
      fallbackHintBody:
        'If marker lock is slow, flatten the poster, reduce glare, and keep 20–35 cm camera distance.',
      finishLabel: 'Continue to FAQ & Offer',
      backLabel: 'Back',
    },
    post_scan: {
      id: 'post_scan',
      title: 'Post-scan support',
      subtitle: 'Use concise FAQ support and close with one clear offer action.',
      backToScanLabel: 'Back to AR Scan',
      restartLabel: 'Restart Demo',
    },
  },
  theme: {
    mode: 'light',
    appleInspired: true,
    surfaces: {
      base: '#f5f5f7',
      card: '#ffffff',
      elevated: '#fbfbfd',
      text: '#1d1d1f',
      muted: '#6e6e73',
      stroke: '#d2d2d7',
      accent: '#0071e3',
      accentSoft: '#e8f3ff',
    },
  },
  compatibility: {
    cameraHelp:
      'Use a modern mobile browser over HTTPS or localhost, then allow camera access to start AR scanning.',
    markerHelp:
      'Point your camera to the custom marker on the poster and keep it flat, bright, and fully visible in frame.',
    fallbackHelp:
      'If the final model is unavailable, the procedural fallback keeps the demo narrative running safely.',
    desktopHint:
      'Desktop is for layout preview. Use mobile for camera permission and marker tracking validation.',
  },
  operatorGuidance: {
    cameraDenied:
      'If camera permission is denied, re-enable camera access for this origin and re-open AR scan.',
    markerSlow:
      'If marker lock is slow, move to 20–35 cm distance, flatten the poster, and reduce reflective glare.',
    markerLost:
      'If tracking is lost, hold your phone steady for 1–2 seconds and bring the full marker back into frame.',
    sceneDelayed:
      'If AR scene loading feels delayed, wait a few seconds or refresh. During live demos, close heavy background tabs.',
    devFallback:
      'For troubleshooting, use the Hiro fallback marker to verify baseline AR readiness.',
    remoteFallback:
      'If remote chatbot fails, fallback to local FAQ automatically and continue presentation flow.',
  },
  statusCopy: {
    idle: 'Ready to start AR scan when the presenter is ready.',
    requestingCamera: 'Requesting camera permission. After allowing access, point to the poster marker.',
    cameraReady: 'Camera active. Now align the custom marker to reveal the AR product.',
    sceneLoading: 'Preparing AR scene before marker tracking starts.',
    sceneDelayed: 'AR scene is still stabilizing. Wait a moment or refresh if camera response is delayed.',
    markerSearching: 'Marker not locked yet. Move closer and keep the marker fully visible.',
    markerSearchTimeout: 'Marker is still not detected. Use fallback guidance to improve lock speed.',
    markerFound: 'Marker locked. AR product and feature hotspots are now presentation-ready.',
    markerLost: 'Marker was lost. Re-center the marker in frame to restore stable tracking.',
    cameraDenied: 'Camera access was not granted. Enable camera permission to continue AR scanning.',
    unsupported: 'This browser/device is in preview mode. Use a modern mobile browser for full AR scanning.',
    modelFallback: 'Procedural fallback model is active to keep the demo flow stable.',
    chatbotRemoteLoading: 'Assistant is attempting a remote-ready response.',
    chatbotRemoteFallback: 'Remote assistant unavailable, returning safely to local FAQ.',
  },
  knownLimitations: [
    'Best marker tracking still requires a modern mobile browser and HTTPS origin.',
    'Desktop preview does not represent real-world camera tracking performance.',
    'Marker print quality and lighting strongly affect lock stability.',
    'Remote chatbot mode is optional and not required for the primary live demo flow.',
  ],
};

export const productContent = {
  productName: 'Apple Devices AR Experience',
  tagline:
    'Turn a static Apple device poster into a clean AR narrative with guided feature points and conversion-ready support.',
  narrativeTitle: 'From static poster to live product walkthrough',
  narrative:
    'This flow demonstrates how marker-based WebAR improves product vividness and information clarity while keeping presenter control simple.',
  valueProps: [
    'No app install required for participants',
    'Focused hotspot narrative for camera, display, performance, and battery stories',
    'Post-scan FAQ support for common purchase questions',
  ],
  shortSpecs: ['Pro-grade camera pipeline', 'High-refresh display', 'Flagship-class performance', 'All-day battery + fast charging'],
  instruction: {
    title: 'Demo sequence',
    checklist: [
      'Open this page from a modern mobile browser over HTTPS or localhost.',
      'Tap “Start AR Scan” and allow camera access.',
      'Align camera to the custom poster marker until tracking locks.',
      'Use hotspots to explain value points in sequence.',
      'Close with FAQ support and one offer CTA.',
    ],
  },
  cta: {
    label: 'Open Offer Page',
    url: 'https://example.com/apple-device-offer',
    supportingText:
      'After AR interaction, this CTA provides a direct bridge from product understanding to purchase intent.',
  },
  hotspots: [
    {
      id: 'camera',
      label: 'Camera',
      title: 'Pro Camera System',
      summary:
        'Emphasize detail capture, portrait depth control, and low-light reliability for daily and creator workflows.',
    },
    {
      id: 'display',
      label: 'Display',
      title: 'High-Refresh Retina-Class Display',
      summary:
        'Highlight visual smoothness, brightness consistency, and color comfort across media and productivity use.',
    },
    {
      id: 'performance',
      label: 'Performance',
      title: 'Flagship Silicon Performance',
      summary:
        'Explain responsive multitasking, efficient sustained power, and readiness for demanding mobile workflows.',
    },
    {
      id: 'battery',
      label: 'Battery',
      title: 'All-Day Battery + Fast Top-Up',
      summary:
        'Frame practical value: fewer charging interruptions and faster recovery during high-mobility routines.',
    },
  ],
};

export const chatbotContent = {
  mode: 'local',
  remoteReady: true,
  providerLabel: 'Presentation FAQ Assistant',
  personaName: 'NOVA Assistant',
  title: 'Post-scan FAQ Assistant',
  subtitle: 'Concise answers for common questions after the audience sees the AR experience.',
  greeting:
    'Hi! I can help with quick answers on price range, camera value, promo logic, and how to continue to the offer page.',
  emptyState: 'Use a quick question or type your own short prompt.',
  inputPlaceholder: 'Ask about price, camera value, promo, or next purchase step…',
  sendLabel: 'Send',
  quickQuestions: [
    'What is the estimated price range?',
    'What camera value should we highlight?',
    'Any promo angle for launch?',
    'How do users continue after scanning?',
  ],
  escalation: {
    label: 'Continue to offer page',
    url: 'https://example.com/apple-device-offer',
    helperText: 'Use this when the audience is ready to move from exploration to action.',
  },
  integration: {
    endpoint: '/api/chatbot',
    transport: 'http',
    requestShape: 'POST { question } -> { answer, source, matchedQuestion? }',
    timeoutMs: 4500,
    notes: 'Primary live mode stays local-first. Remote mode remains optional for future extensions.',
  },
  fallbackResponse:
    'I do not have a specific answer for that yet. Try asking about price range, camera value, promo, or purchase continuation.',
  faq: [
    {
      id: 'price',
      intents: ['price', 'cost', 'range', 'budget', 'berapa', 'harga'],
      question: 'What is the estimated price range?',
      answer:
        'For demo framing, position this as a premium Apple device category with pricing adapted to storage tier and active campaign period.',
    },
    {
      id: 'camera',
      intents: ['camera', 'photo', 'video', 'low light', 'portrait'],
      question: 'What camera value should we highlight?',
      answer:
        'Focus on practical value: reliable low-light portraits, stable video capture, and consistent detail quality for daily and creator use.',
    },
    {
      id: 'promo',
      intents: ['promo', 'bonus', 'discount', 'launch', 'cashback'],
      question: 'Any promo angle for launch?',
      answer:
        'Common launch angles include accessory bundles, financing support, trade-in incentives, or channel-specific cashback mechanics.',
    },
    {
      id: 'buy',
      intents: ['buy', 'purchase', 'checkout', 'order', 'after scan'],
      question: 'How do users continue after scanning?',
      answer:
        'After the AR walkthrough, direct users to the single offer CTA so they can continue to the official purchase or campaign page.',
    },
  ],
};

export const assetManifest = {
  poster: {
    preview: withBase('/assets/poster/poster-preview.svg'),
    markerGuide: withBase('/assets/poster/poster-marker-guide.svg'),
  },
  branding: {
    thumb: withBase('/assets/branding/brand-thumb.svg'),
  },
  marker: {
    mode: 'pattern',
    devFallbackMode: 'preset-hiro',
    patternUrl: withBase('/assets/markers/custom-marker-placeholder.patt'),
    preview: withBase('/assets/markers/custom-marker-reference.svg'),
    hiroPreview: withBase('/assets/markers/marker-hiro-reference.svg'),
  },
  model: {
    mode: 'procedural',
    fallbackMode: 'procedural',
    src: withBase('/assets/models/phone-demo.glb'),
    scale: '0.82 0.82 0.82',
    rotation: '-90 0 0',
    position: '0 0.9 0',
    fallbackPosition: '0 0.9 0',
  },
};
