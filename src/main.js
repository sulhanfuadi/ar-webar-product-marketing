import './style.css';
import { appConfig, assetManifest, chatbotContent, productContent } from './config/content';
import { createAppMarkup } from './lib/arScene';
import { createInitialMessages, getChatbotReply } from './lib/chatbot';

const app = document.querySelector('#app');
app.innerHTML = createAppMarkup();
document.title = appConfig.appName;

const appElements = {
  arStage: document.querySelector('#ar-stage'),
  enterArButton: document.querySelector('#enter-ar-btn'),
  trackingStatus: document.querySelector('#tracking-status'),
  supportCopy: document.querySelector('#support-copy'),
  compatBanner: document.querySelector('#compat-banner'),
  hotspotTitle: document.querySelector('#hotspot-title'),
  hotspotSummary: document.querySelector('#hotspot-summary'),
  marker: document.querySelector('#main-marker'),
  scene: document.querySelector('#ar-scene'),
  runtimeStatePill: document.querySelector('#runtime-state-pill'),
  cameraStatePill: document.querySelector('#camera-state-pill'),
  markerStatePill: document.querySelector('#marker-state-pill'),
  modelStatePill: document.querySelector('#model-state-pill'),
  fallbackModePill: document.querySelector('#fallback-mode-pill'),
  operatorGuidanceTitle: document.querySelector('#operator-guidance-title'),
  operatorGuidanceCopy: document.querySelector('#operator-guidance-copy'),
  heroModel: document.querySelector('#hero-model'),
  heroFallback: document.querySelector('#hero-fallback'),
  chatbotModePill: document.querySelector('#chatbot-mode-pill'),
  chatbotLog: document.querySelector('#chatbot-log'),
  chatbotEmpty: document.querySelector('#chatbot-empty'),
  chatbotForm: document.querySelector('#chatbot-form'),
  chatbotInput: document.querySelector('#chatbot-input'),
  chatbotSendButton: document.querySelector('#chatbot-send-btn'),
};

const hotspotMap = new Map(productContent.hotspots.map((item) => [item.id, item]));

const runtimeState = {
  arStageOpen: false,
  cameraGranted: false,
  markerFound: false,
  modelReady: assetManifest.model.mode !== 'gltf',
  fallbackActive: assetManifest.model.mode !== 'gltf',
  sceneLoaded: false,
  stage: 'idle',
  timers: {
    markerSearch: null,
    sceneReady: null,
    markerLostCooldown: null,
  },
};

const runtimeLabels = {
  idle: 'Runtime idle',
  requesting_camera: 'Runtime requesting camera',
  scene_loading: 'Runtime scene loading',
  ready: 'Runtime ready',
  searching: 'Runtime searching marker',
  found: 'Runtime marker found',
  lost: 'Runtime marker lost',
  fallback: 'Runtime fallback active',
  unsupported: 'Runtime unsupported',
};

function clearTimer(name) {
  if (runtimeState.timers[name]) {
    window.clearTimeout(runtimeState.timers[name]);
    runtimeState.timers[name] = null;
  }
}

function updateTrackingStatus(message) {
  appElements.trackingStatus.textContent = message;
}

function updateSupportCopy(message) {
  appElements.supportCopy.textContent = message;
}

function setPill(element, label, tone = 'neutral') {
  if (!element) return;
  element.textContent = label;
  element.dataset.tone = tone;
}

function setCompatibilityMessage(message) {
  appElements.compatBanner.textContent = message;
  appElements.compatBanner.hidden = false;
}

function hideCompatibilityMessage() {
  appElements.compatBanner.hidden = true;
  appElements.compatBanner.textContent = '';
}

function setOperatorGuidance(title, copy) {
  appElements.operatorGuidanceTitle.textContent = title;
  appElements.operatorGuidanceCopy.textContent = copy;
}

function setRuntimeStage(stage, message, detail, tone = 'neutral') {
  runtimeState.stage = stage;
  setPill(appElements.runtimeStatePill, runtimeLabels[stage] || `Runtime ${stage}`, tone);
  if (message) updateTrackingStatus(message);
  if (detail) updateSupportCopy(detail);
}

function setHotspot(id) {
  const active = hotspotMap.get(id);
  if (!active) return;

  appElements.hotspotTitle.textContent = active.title;
  appElements.hotspotSummary.textContent = active.summary;

  document.querySelectorAll('[data-hotspot-id]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.hotspotId === id);
  });
}

function openArStage() {
  if (runtimeState.arStageOpen) return;

  runtimeState.arStageOpen = true;
  appElements.arStage.hidden = false;
  document.body.classList.add('ar-active');
}

function scrollToArStage() {
  if (!appElements.arStage) return;

  window.requestAnimationFrame(() => {
    appElements.arStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function setFallbackModeLabel() {
  const fallbackLabel = assetManifest.marker.devFallbackMode === 'preset-hiro' ? 'Hiro fallback ready' : assetManifest.marker.devFallbackMode;
  setPill(appElements.fallbackModePill, fallbackLabel, 'warning');
}

function checkCompatibility() {
  const cameraSupported = Boolean(navigator.mediaDevices?.getUserMedia);
  const secureContextReady = window.isSecureContext || ['localhost', '127.0.0.1'].includes(window.location.hostname);

  if (!cameraSupported || !secureContextReady) {
    setCompatibilityMessage(appConfig.statusCopy.unsupported);
    setRuntimeStage('unsupported', appConfig.statusCopy.unsupported, appConfig.compatibility.cameraHelp, 'warning');
    setPill(appElements.cameraStatePill, 'Camera unsupported', 'warning');
    setPill(appElements.markerStatePill, 'Marker waiting', 'warning');
    setOperatorGuidance('Perangkat belum kompatibel penuh', appConfig.compatibility.desktopHint);
    return false;
  }

  hideCompatibilityMessage();
  return true;
}

function startSceneReadyTimer() {
  clearTimer('sceneReady');
  runtimeState.timers.sceneReady = window.setTimeout(() => {
    if (!runtimeState.sceneLoaded) {
      setRuntimeStage('scene_loading', appConfig.statusCopy.sceneDelayed, appConfig.operatorGuidance.sceneDelayed, 'warning');
      setOperatorGuidance('Scene belum sepenuhnya siap', appConfig.operatorGuidance.sceneDelayed);
    }
  }, appConfig.runtime.sceneReadyTimeoutMs);
}

function startMarkerSearchTimer() {
  clearTimer('markerSearch');
  runtimeState.timers.markerSearch = window.setTimeout(() => {
    if (!runtimeState.markerFound && runtimeState.cameraGranted) {
      setRuntimeStage('searching', appConfig.statusCopy.markerSearchTimeout, appConfig.operatorGuidance.markerSlow, 'warning');
      setOperatorGuidance('Marker belum terkunci', appConfig.operatorGuidance.markerSlow);
    }
  }, appConfig.runtime.markerSearchTimeoutMs);
}

function activateProceduralFallback(reasonMessage = appConfig.statusCopy.modelFallback) {
  runtimeState.fallbackActive = true;
  runtimeState.modelReady = false;

  if (appElements.heroFallback) {
    appElements.heroFallback.setAttribute('visible', 'true');
  }

  setPill(appElements.modelStatePill, 'Model fallback active', 'warning');
  setRuntimeStage('fallback', reasonMessage, appConfig.compatibility.fallbackHelp, 'warning');
  setOperatorGuidance('Fallback visual aktif', appConfig.compatibility.fallbackHelp);
}

function initModelHandling() {
  if (assetManifest.model.mode !== 'gltf' || !appElements.heroModel) {
    setPill(appElements.modelStatePill, 'Model procedural', 'ok');
    return;
  }

  setPill(appElements.modelStatePill, 'Model loading', 'neutral');

  appElements.heroModel.addEventListener('model-loaded', () => {
    runtimeState.modelReady = true;
    runtimeState.fallbackActive = false;

    if (appElements.heroFallback) {
      appElements.heroFallback.setAttribute('visible', 'false');
    }

    setPill(appElements.modelStatePill, 'Model ready', 'ok');
  });

  appElements.heroModel.addEventListener('model-error', () => {
    activateProceduralFallback();
  });
}

function setChatbotPending(isPending) {
  appElements.chatbotInput.disabled = isPending;
  appElements.chatbotSendButton.disabled = isPending;
  appElements.chatbotForm.setAttribute('aria-busy', isPending ? 'true' : 'false');
  setPill(appElements.chatbotModePill, isPending ? 'FAQ processing' : `Mode ${chatbotContent.mode}`, isPending ? 'warning' : 'ok');
}

function appendChatMessage(role, text, meta = '') {
  const item = document.createElement('article');
  item.className = `chat-message chat-message-${role}`;
  item.innerHTML = `
    <p class="chat-role">${role === 'assistant' ? chatbotContent.personaName : 'Presenter'}</p>
    <p class="chat-text"></p>
    ${meta ? `<p class="chat-meta">${meta}</p>` : ''}
  `;
  item.querySelector('.chat-text').textContent = text;
  appElements.chatbotLog.appendChild(item);
  appElements.chatbotEmpty.hidden = true;
  appElements.chatbotLog.scrollTop = appElements.chatbotLog.scrollHeight;
}

async function askChatbot(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;

  appendChatMessage('user', cleanQuestion);

  try {
    setChatbotPending(true);
    const reply = await getChatbotReply(cleanQuestion);
    const meta =
      reply.meta?.source === 'faq'
        ? `Sumber: FAQ lokal (${reply.meta.faqId})`
        : reply.meta?.source === 'remote-stub'
          ? 'Sumber: remote stub API'
          : reply.meta?.source === 'remote-ready-fallback'
            ? appConfig.statusCopy.chatbotRemoteFallback
            : 'Sumber: fallback umum';

    appendChatMessage('assistant', reply.text, meta);
  } finally {
    setChatbotPending(false);
  }
}

function initChatbot() {
  createInitialMessages().forEach((message) => {
    appendChatMessage(message.role, message.text, 'Mode presentasi: local-first');
  });

  appElements.chatbotForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = appElements.chatbotInput.value;
    appElements.chatbotInput.value = '';
    await askChatbot(value);
    appElements.chatbotInput.focus();
  });

  document.querySelectorAll('[data-chatbot-question]').forEach((button) => {
    button.addEventListener('click', async () => {
      await askChatbot(button.dataset.chatbotQuestion || '');
    });
  });
}

async function requestCameraAccess() {
  setPill(appElements.cameraStatePill, 'Camera requesting', 'neutral');
  setPill(appElements.markerStatePill, 'Marker pending', 'neutral');
  setRuntimeStage('requesting_camera', appConfig.statusCopy.requestingCamera, appConfig.compatibility.cameraHelp, 'neutral');
  setOperatorGuidance('Meminta izin kamera', appConfig.compatibility.cameraHelp);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    });
    stream.getTracks().forEach((track) => track.stop());

    runtimeState.cameraGranted = true;
    setPill(appElements.cameraStatePill, 'Camera granted', 'ok');

    if (runtimeState.sceneLoaded) {
      setPill(appElements.markerStatePill, 'Marker searching', 'warning');
      setRuntimeStage('searching', appConfig.statusCopy.markerSearching, appConfig.compatibility.markerHelp, 'warning');
      setOperatorGuidance('Arahkan ke marker', appConfig.operatorGuidance.markerSlow);
      startMarkerSearchTimer();
    } else {
      setRuntimeStage('scene_loading', appConfig.statusCopy.sceneLoading, appConfig.operatorGuidance.sceneDelayed, 'neutral');
      setOperatorGuidance('Scene sedang disiapkan', appConfig.operatorGuidance.sceneDelayed);
      startSceneReadyTimer();
    }
  } catch (error) {
    runtimeState.cameraGranted = false;
    setPill(appElements.cameraStatePill, 'Camera denied', 'warning');
    setRuntimeStage('idle', appConfig.statusCopy.cameraDenied, appConfig.operatorGuidance.cameraDenied, 'warning');
    setOperatorGuidance('Izin kamera ditolak', appConfig.operatorGuidance.cameraDenied);
    console.error(error);
  }
}

appElements.enterArButton.addEventListener('click', async () => {
  openArStage();
  scrollToArStage();
  setFallbackModeLabel();

  if (!checkCompatibility()) {
    return;
  }

  await requestCameraAccess();
});

appElements.marker?.addEventListener('markerFound', () => {
  clearTimer('markerSearch');
  clearTimer('markerLostCooldown');
  runtimeState.markerFound = true;
  setPill(appElements.markerStatePill, 'Marker found', 'ok');
  setRuntimeStage('found', appConfig.statusCopy.markerFound, 'Gunakan hotspot secara berurutan untuk menjaga narasi tetap ringkas.', 'ok');
  setOperatorGuidance('Tracking terkunci', 'Lanjutkan narasi fitur lalu tutup dengan FAQ singkat dan CTA penawaran.');
});

appElements.marker?.addEventListener('markerLost', () => {
  runtimeState.markerFound = false;
  setPill(appElements.markerStatePill, 'Marker lost', 'warning');
  setRuntimeStage('lost', appConfig.statusCopy.markerLost, appConfig.operatorGuidance.markerLost, 'warning');
  setOperatorGuidance('Tracking hilang sementara', appConfig.operatorGuidance.markerLost);

  clearTimer('markerLostCooldown');
  runtimeState.timers.markerLostCooldown = window.setTimeout(() => {
    if (!runtimeState.markerFound && runtimeState.cameraGranted) {
      setPill(appElements.markerStatePill, 'Marker searching', 'warning');
      setRuntimeStage('searching', appConfig.statusCopy.markerSearching, appConfig.compatibility.markerHelp, 'warning');
      startMarkerSearchTimer();
    }
  }, appConfig.runtime.markerLostCooldownMs);
});

appElements.scene?.addEventListener('loaded', () => {
  runtimeState.sceneLoaded = true;
  clearTimer('sceneReady');
  setPill(appElements.markerStatePill, 'Marker ready', 'neutral');
  initModelHandling();

  if (runtimeState.cameraGranted && !runtimeState.markerFound) {
    setRuntimeStage('searching', appConfig.statusCopy.markerSearching, appConfig.compatibility.markerHelp, 'warning');
    setOperatorGuidance('Scene siap, mulai lock marker', appConfig.operatorGuidance.markerSlow);
    startMarkerSearchTimer();
  } else if (!runtimeState.cameraGranted) {
    setRuntimeStage('ready', appConfig.statusCopy.idle, appConfig.compatibility.cameraHelp, 'neutral');
  }
});

document.querySelectorAll('[data-hotspot-id]').forEach((button, index) => {
  button.addEventListener('click', () => {
    setHotspot(button.dataset.hotspotId);
    if (!runtimeState.markerFound) {
      setRuntimeStage('searching', appConfig.statusCopy.markerSearching, appConfig.compatibility.markerHelp, 'warning');
      setOperatorGuidance('Hotspot siap, marker belum lock', appConfig.operatorGuidance.markerSlow);
    }
  });

  if (index === 0) {
    setHotspot(button.dataset.hotspotId);
  }
});

initChatbot();
setChatbotPending(false);
setFallbackModeLabel();
checkCompatibility();
setRuntimeStage('idle', appConfig.statusCopy.idle, appConfig.compatibility.cameraHelp, 'neutral');
setOperatorGuidance('Demonstrasi siap dimulai', `${appConfig.operatorGuidance.markerSlow} ${appConfig.operatorGuidance.devFallback}`);
