import { appConfig, assetManifest, chatbotContent, productContent } from '../config/content';

const hotspotPositions = [
  { x: -0.82, y: 0.88 },
  { x: -0.16, y: 0.48 },
  { x: 0.34, y: 0.8 },
  { x: 0.82, y: 1.14 },
];

function createMarkerAttributes() {
  if (assetManifest.marker.mode === 'pattern') {
    return `type="pattern" url="${assetManifest.marker.patternUrl}"`;
  }

  return 'preset="hiro"';
}

function createProceduralPhone() {
  return `
    <a-box position="0 0 0" depth="0.08" height="1.8" width="0.9" radius="0.08" color="#161617"></a-box>
    <a-box position="0 0.02 0.045" depth="0.01" height="1.62" width="0.78" color="#a7d4ff"></a-box>
    <a-box position="0 0.64 0.052" depth="0.01" height="0.18" width="0.38" color="#4d9bf5"></a-box>
    <a-cylinder position="-0.24 0.54 0.052" radius="0.06" height="0.01" color="#e8e8ed"></a-cylinder>
    <a-cylinder position="0 0.54 0.052" radius="0.06" height="0.01" color="#c7dbf7"></a-cylinder>
    <a-cylinder position="0.24 0.54 0.052" radius="0.06" height="0.01" color="#e8e8ed"></a-cylinder>
  `;
}

function createHeroMarkup() {
  const model = assetManifest.model;

  if (model.mode === 'gltf') {
    return `
      <a-entity id="hero-model-root" position="${model.position}" rotation="${model.rotation}" scale="${model.scale}">
        <a-entity id="hero-model" gltf-model="${model.src}"></a-entity>
      </a-entity>
      <a-entity id="hero-fallback" visible="false" position="${model.fallbackPosition}">
        ${createProceduralPhone()}
      </a-entity>
    `;
  }

  return `
    <a-entity id="hero-model-root" position="${model.fallbackPosition}" rotation="${model.rotation}" scale="${model.scale}">
      <a-entity id="hero-fallback" visible="true">
        ${createProceduralPhone()}
      </a-entity>
    </a-entity>
  `;
}

export function createAppMarkup() {
  const quickQuestions = chatbotContent.quickQuestions
    .map(
      (question) => `
        <button class="quick-question" type="button" data-chatbot-question="${question}">${question}</button>
      `,
    )
    .join('');

  const hotspots = productContent.hotspots
    .map(
      (hotspot, index) => `
        <button
          class="hotspot"
          type="button"
          data-hotspot-id="${hotspot.id}"
          style="--x:${hotspotPositions[index]?.x ?? 0}; --y:${hotspotPositions[index]?.y ?? 1};"
          aria-label="Open ${hotspot.label} details"
        >
          <span>${hotspot.label}</span>
        </button>
      `,
    )
    .join('');

  return `
    <div class="app-shell">
      <section class="view view-intro" data-view="intro_minimal">
        <article class="intro-card card">
          <p class="eyebrow">${appConfig.appEyebrow}</p>
          <h1>${appConfig.views.intro_minimal.title}</h1>
          <p class="intro-subtitle">${appConfig.views.intro_minimal.subtitle}</p>
          <p class="intro-product">${productContent.productName}</p>
          <div class="intro-actions">
            <button type="button" class="primary-btn" id="enter-ar-btn">${appConfig.views.intro_minimal.primaryCtaLabel}</button>
            <button type="button" class="subtle-btn" id="intro-help-btn">${appConfig.views.intro_minimal.helperLabel}</button>
          </div>
          <p class="helper-copy" id="intro-helper-copy" hidden>${appConfig.views.intro_minimal.helperBody}</p>
          <p class="device-hint" id="intro-device-hint">${appConfig.views.intro_minimal.desktopPreview}</p>
        </article>
      </section>

      <section class="view view-ar" data-view="ar_scan" hidden>
        <header class="scan-toolbar">
          <button type="button" class="subtle-btn" id="back-to-intro-btn">${appConfig.views.ar_scan.backLabel}</button>
          <span class="runtime-pill" id="runtime-state-pill">Runtime idle</span>
          <button type="button" class="subtle-btn" id="open-post-scan-btn">${appConfig.views.ar_scan.finishLabel}</button>
        </header>

        <section class="ar-stage" id="ar-stage">
          <div class="scan-status card-soft">
            <p class="eyebrow">Scan status</p>
            <h2 id="tracking-status">${appConfig.statusCopy.idle}</h2>
            <p class="support-copy" id="support-copy">${appConfig.compatibility.cameraHelp}</p>
            <div class="state-pill-row">
              <span class="state-pill" id="camera-state-pill">Camera idle</span>
              <span class="state-pill" id="marker-state-pill">Marker default ${assetManifest.marker.mode}</span>
              <span class="state-pill" id="model-state-pill">Model ${assetManifest.model.mode}</span>
              <span class="state-pill" id="fallback-mode-pill">Fallback ${assetManifest.marker.mode}</span>
            </div>
          </div>

          <div class="overlay compact-overlay">
            <div class="overlay-card card-soft">
              <p class="eyebrow">Feature focus</p>
              <h3 id="hotspot-title"></h3>
              <p id="hotspot-summary"></p>
            </div>
          </div>

          <div class="overlay guidance-overlay">
            <div class="overlay-card card-soft">
              <div class="guidance-head">
                <div>
                  <p class="eyebrow">Operator guidance</p>
                  <h3 id="operator-guidance-title">Ready to begin</h3>
                </div>
                <button type="button" class="subtle-btn tiny-btn" id="toggle-fallback-help-btn">${appConfig.views.ar_scan.fallbackHintLabel}</button>
              </div>
              <p class="guidance-copy" id="operator-guidance-copy">${appConfig.operatorGuidance.markerSlow}</p>
              <p class="helper-copy" id="fallback-help-text" hidden>${appConfig.views.ar_scan.fallbackHintBody}</p>
            </div>
          </div>

          <div class="hotspot-layer">${hotspots}</div>
          <div class="compat-banner" id="compat-banner" hidden></div>

          <a-scene
            id="ar-scene"
            embedded
            vr-mode-ui="enabled: false"
            renderer="logarithmicDepthBuffer: true; precision: mediump;"
            arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
          >
            <a-assets>
              <a-asset-item id="phone-model-asset" src="${assetManifest.model.src}"></a-asset-item>
            </a-assets>

            <a-marker id="main-marker" ${createMarkerAttributes()}>
              ${createHeroMarkup()}
            </a-marker>
            <a-entity camera></a-entity>
          </a-scene>
        </section>
      </section>

      <section class="view view-post" data-view="post_scan" hidden>
        <article class="post-card card">
          <p class="eyebrow">Post-scan support</p>
          <h2>${appConfig.views.post_scan.title}</h2>
          <p class="intro-subtitle">${appConfig.views.post_scan.subtitle}</p>
          <p class="post-caption">${productContent.cta.supportingText}</p>

          <div class="post-actions">
            <a class="primary-btn" href="${productContent.cta.url}" target="_blank" rel="noreferrer">${productContent.cta.label}</a>
            <button type="button" class="subtle-btn" id="back-to-scan-btn">${appConfig.views.post_scan.backToScanLabel}</button>
            <button type="button" class="subtle-btn" id="restart-demo-btn">${appConfig.views.post_scan.restartLabel}</button>
          </div>
        </article>

        <article class="chatbot-panel card" id="chatbot-panel">
          <div class="chatbot-head">
            <div>
              <p class="eyebrow">${chatbotContent.title}</p>
              <h3>${chatbotContent.personaName}</h3>
            </div>
            <p class="chatbot-subtitle">${chatbotContent.subtitle}</p>
          </div>
          <div class="chatbot-mode-row">
            <span class="state-pill" data-tone="ok" id="chatbot-mode-pill">Mode ${chatbotContent.mode}</span>
          </div>
          <div class="chatbot-log card-soft" id="chatbot-log" aria-live="polite"></div>
          <p class="chatbot-empty" id="chatbot-empty">${chatbotContent.emptyState}</p>
          <div class="quick-question-list">${quickQuestions}</div>
          <form class="chatbot-form" id="chatbot-form">
            <input id="chatbot-input" class="chatbot-input" type="text" placeholder="${chatbotContent.inputPlaceholder}" />
            <button type="submit" class="primary-btn chatbot-send" id="chatbot-send-btn">${chatbotContent.sendLabel}</button>
          </form>
          <a class="subtle-btn chatbot-cta" href="${chatbotContent.escalation.url}" target="_blank" rel="noreferrer">${chatbotContent.escalation.label}</a>
        </article>
      </section>
    </div>
  `;
}
