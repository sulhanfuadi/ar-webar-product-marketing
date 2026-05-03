import './style.css';
import { appConfig, assetManifest, chatbotContent, productContent } from './config/content';
import { createAppMarkup } from './lib/arScene';
import { createInitialMessages, getChatbotReply } from './lib/chatbot';

const app = document.querySelector('#app');
app.innerHTML = createAppMarkup();
document.title = appConfig.appName;

const appElements = {
  views: document.querySelectorAll('[data-view]'),
  introView: document.querySelector('[data-view="intro_minimal"]'),
  arView: document.querySelector('[data-view="ar_scan"]'),
  postView: document.querySelector('[data-view="post_scan"]'),
  arStage: document.querySelector('#ar-stage'),
  enterArButton: document.querySelector('#enter-ar-btn'),
  introHelpButton: document.querySelector('#intro-help-btn'),
  introHelperCopy: document.querySelector('#intro-helper-copy'),
  introDeviceHint: document.querySelector('#intro-device-hint'),
  backToIntroButton: document.querySelector('#back-to-intro-btn'),
  openPostScanButton: document.querySelector('#open-post-scan-btn'),
  backToScanButton: document.querySelector('#back-to-scan-btn'),
  restartDemoButton: document.querySelector('#restart-demo-btn'),
  toggleFallbackHelpButton: document.querySelector('#toggle-fallback-help-btn'),
  fallbackHelpText: document.querySelector('#fallback-help-text'),
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
  currentView: appConfig.views.intro_minimal.id,
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
  unsupported: 'Runtime preview mode',
};

function isProbablyMobile() {
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent || '');
}

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

function setView(viewId) {
  runtimeState.currentView = viewId;

  appElements.views.forEach((view) => {
    view.hidden = view.dataset.view !== viewId;
  });

  document.body.classList.toggle('view-ar-active', viewId === appConfig.views.ar_scan.id);
}

function scrollToActiveView() {
  const target = document.querySelector(`[data-view="${runtimeState.currentView}"]`);
  if (!target) return;

  window.requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
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

function setFallbackModeLabel() {
  const fallbackLabel =
    assetManifest.marker.devFallbackMode === 'preset-hiro' ? 'Hiro fallback ready' : assetManifest.marker.devFallbackMode;
  setPill(appElements.fallbackModePill, fallbackLabel, 'warning');
}

function checkCompatibility() {
  const cameraSupported = Boolean(navigator.mediaDevices?.getUserMedia);
  const secureContextReady = window.isSecureContext || ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const mobileReady = isProbablyMobile();

  if (!mobileReady) {
    setCompatibilityMessage(appConfig.compatibility.desktopHint);
    setRuntimeStage('unsupported', appConfig.statusCopy.unsupported, appConfig.compatibility.desktopHint, 'warning');
    setPill(appElements.cameraStatePill, 'Camera mobile-only', 'warning');
    setPill(appElements.markerStatePill, 'Marker preview-only', 'warning');
    setOperatorGuidance('Preview mode active', appConfig.compatibility.desktopHint);
    return false;
  }

  if (!cameraSupported || !secureContextReady) {
    setCompatibilityMessage(appConfig.statusCopy.unsupported);
    setRuntimeStage('unsupported', appConfig.statusCopy.unsupported, appConfig.compatibility.cameraHelp, 'warning');
    setPill(appElements.cameraStatePill, 'Camera unsupported', 'warning');
    setPill(appElements.markerStatePill, 'Marker waiting', 'warning');
    setOperatorGuidance('Compatibility check needed', appConfig.compatibility.cameraHelp);
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
      setOperatorGuidance('Scene still preparing', appConfig.operatorGuidance.sceneDelayed);
    }
  }, appConfig.runtime.sceneReadyTimeoutMs);
}

function startMarkerSearchTimer() {
  clearTimer('markerSearch');
  runtimeState.timers.markerSearch = window.setTimeout(() => {
    if (!runtimeState.markerFound && runtimeState.cameraGranted) {
      setRuntimeStage('searching', appConfig.statusCopy.markerSearchTimeout, appConfig.operatorGuidance.markerSlow, 'warning');
      setOperatorGuidance('Marker not locked yet', appConfig.operatorGuidance.markerSlow);
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
  setOperatorGuidance('Fallback visual active', appConfig.compatibility.fallbackHelp);
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
  setPill(
    appElements.chatbotModePill,
    isPending ? 'FAQ processing' : `Mode ${chatbotContent.mode}`,
    isPending ? 'warning' : 'ok',
  );
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
        ? `Source: local FAQ (${reply.meta.faqId})`
        : reply.meta?.source === 'remote-ready-fallback'
          ? 'Source: remote fallback to local FAQ'
          : `Source: ${reply.meta?.source || 'assistant'}`;

    appendChatMessage('assistant', reply.text, meta);

    if (reply.meta?.source === 'remote-ready-fallback') {
      setRuntimeStage(
        'fallback',
        appConfig.statusCopy.chatbotRemoteFallback,
        appConfig.operatorGuidance.remoteFallback,
        'warning',
      );
    }
  } finally {
    setChatbotPending(false);
  }
}

function initChatbot() {
  createInitialMessages().forEach((message) => {
    appendChatMessage('assistant', message.text, `Mode presentation: local-first (${message.meta?.mode || 'local'})`);
  });

  appElements.chatbotForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const value = appElements.chatbotInput.value.trim();
    if (!value) return;

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
  setOperatorGuidance('Requesting camera access', appConfig.compatibility.cameraHelp);

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
      setOperatorGuidance('Point to marker', appConfig.operatorGuidance.markerSlow);
      startMarkerSearchTimer();
    } else {
      setRuntimeStage('scene_loading', appConfig.statusCopy.sceneLoading, appConfig.operatorGuidance.sceneDelayed, 'neutral');
      setOperatorGuidance('Preparing AR scene', appConfig.operatorGuidance.sceneDelayed);
      startSceneReadyTimer();
    }
  } catch (error) {
    runtimeState.cameraGranted = false;
    setPill(appElements.cameraStatePill, 'Camera denied', 'warning');
    setRuntimeStage('idle', appConfig.statusCopy.cameraDenied, appConfig.operatorGuidance.cameraDenied, 'warning');
    setOperatorGuidance('Camera denied', appConfig.operatorGuidance.cameraDenied);
    console.error(error);
  }
}

function enterArFlow() {
  setView(appConfig.views.ar_scan.id);
  scrollToActiveView();
  setFallbackModeLabel();

  if (!checkCompatibility()) {
    return;
  }

  void requestCameraAccess();
}

appElements.enterArButton.addEventListener('click', () => {
  enterArFlow();
});

appElements.introHelpButton.addEventListener('click', () => {
  appElements.introHelperCopy.hidden = !appElements.introHelperCopy.hidden;
});

appElements.backToIntroButton.addEventListener('click', () => {
  setView(appConfig.views.intro_minimal.id);
  scrollToActiveView();
});

appElements.openPostScanButton.addEventListener('click', () => {
  setView(appConfig.views.post_scan.id);
  scrollToActiveView();
});

appElements.backToScanButton.addEventListener('click', () => {
  setView(appConfig.views.ar_scan.id);
  scrollToActiveView();
});

appElements.restartDemoButton.addEventListener('click', () => {
  setView(appConfig.views.intro_minimal.id);
  scrollToActiveView();
});

appElements.toggleFallbackHelpButton.addEventListener('click', () => {
  appElements.fallbackHelpText.hidden = !appElements.fallbackHelpText.hidden;
});

appElements.marker?.addEventListener('markerFound', () => {
  clearTimer('markerSearch');
  clearTimer('markerLostCooldown');
  runtimeState.markerFound = true;
  setPill(appElements.markerStatePill, 'Marker found', 'ok');
  setRuntimeStage('found', appConfig.statusCopy.markerFound, 'Use hotspots in sequence for a concise narrative.', 'ok');
  setOperatorGuidance('Tracking locked', 'Continue feature narrative, then move audience to post-scan FAQ and offer CTA.');
});

appElements.marker?.addEventListener('markerLost', () => {
  runtimeState.markerFound = false;
  setPill(appElements.markerStatePill, 'Marker lost', 'warning');
  setRuntimeStage('lost', appConfig.statusCopy.markerLost, appConfig.operatorGuidance.markerLost, 'warning');
  setOperatorGuidance('Tracking temporarily lost', appConfig.operatorGuidance.markerLost);

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
    setOperatorGuidance('Scene ready, lock marker now', appConfig.operatorGuidance.markerSlow);
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
      setOperatorGuidance('Hotspot ready, marker not locked yet', appConfig.operatorGuidance.markerSlow);
    }
  });

  if (index === 0) {
    setHotspot(button.dataset.hotspotId);
  }
});

function initIntroHint() {
  appElements.introDeviceHint.textContent = isProbablyMobile()
    ? appConfig.compatibility.cameraHelp
    : appConfig.views.intro_minimal.desktopPreview;
}

initChatbot();
setChatbotPending(false);
setFallbackModeLabel();
setView(appConfig.views.intro_minimal.id);
initIntroHint();
setRuntimeStage('idle', appConfig.statusCopy.idle, appConfig.compatibility.cameraHelp, 'neutral');
setOperatorGuidance('Demo ready', `${appConfig.operatorGuidance.markerSlow} ${appConfig.operatorGuidance.devFallback}`);
