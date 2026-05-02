import './style.css';
import { appConfig, assetManifest, chatbotContent, productContent } from './config/content';
import { createAppMarkup } from './lib/arScene';
import { createInitialMessages, getChatbotReply } from './lib/chatbot';

const app = document.querySelector('#app');
app.innerHTML = createAppMarkup();

document.title = appConfig.appName;

const arStage = document.querySelector('#ar-stage');
const enterArButton = document.querySelector('#enter-ar-btn');
const trackingStatus = document.querySelector('#tracking-status');
const supportCopy = document.querySelector('#support-copy');
const compatBanner = document.querySelector('#compat-banner');
const hotspotTitle = document.querySelector('#hotspot-title');
const hotspotSummary = document.querySelector('#hotspot-summary');
const marker = document.querySelector('#main-marker');
const scene = document.querySelector('#ar-scene');
const cameraStatePill = document.querySelector('#camera-state-pill');
const markerStatePill = document.querySelector('#marker-state-pill');
const modelStatePill = document.querySelector('#model-state-pill');
const heroModel = document.querySelector('#hero-model');
const heroFallback = document.querySelector('#hero-fallback');
const chatbotLog = document.querySelector('#chatbot-log');
const chatbotEmpty = document.querySelector('#chatbot-empty');
const chatbotForm = document.querySelector('#chatbot-form');
const chatbotInput = document.querySelector('#chatbot-input');

const hotspotMap = new Map(productContent.hotspots.map((item) => [item.id, item]));

const runtimeState = {
  arStageOpen: false,
  markerFound: false,
  cameraGranted: false,
  modelReady: assetManifest.model.mode !== 'gltf',
  fallbackActive: assetManifest.model.mode !== 'gltf',
};

function updateTrackingStatus(message) {
  trackingStatus.textContent = message;
}

function updateSupportCopy(message) {
  supportCopy.textContent = message;
}

function setPill(element, label, tone = 'neutral') {
  element.textContent = label;
  element.dataset.tone = tone;
}

function setCompatibilityMessage(message) {
  compatBanner.textContent = message;
  compatBanner.hidden = false;
}

function hideCompatibilityMessage() {
  compatBanner.hidden = true;
}

function setHotspot(id) {
  const active = hotspotMap.get(id);
  if (!active) return;
  hotspotTitle.textContent = active.title;
  hotspotSummary.textContent = active.summary;

  document.querySelectorAll('[data-hotspot-id]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.hotspotId === id);
  });
}

function openArStage() {
  if (runtimeState.arStageOpen) return;
  runtimeState.arStageOpen = true;
  arStage.hidden = false;
  document.body.classList.add('ar-active');
  updateTrackingStatus(productContent.states.loading);
  updateSupportCopy(productContent.instruction.body);
  arStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function isMobileLike() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function checkCompatibility() {
  const secureContextOk = window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const mediaOk = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  const mobileOk = isMobileLike();

  if (!secureContextOk || !mediaOk || !mobileOk) {
    setCompatibilityMessage(`${productContent.states.incompatible} ${appConfig.support.secureContextHint} ${appConfig.support.mobileHint}`);
    updateTrackingStatus(productContent.states.incompatible);
    updateSupportCopy(`${appConfig.support.recommendedBrowsers}. ${appConfig.support.secureContextHint}`);
    return false;
  }

  hideCompatibilityMessage();
  return true;
}

function activateProceduralFallback(reasonMessage = productContent.states.modelFailed) {
  runtimeState.fallbackActive = true;
  runtimeState.modelReady = false;
  if (heroFallback) {
    heroFallback.setAttribute('visible', 'true');
  }
  setPill(modelStatePill, 'Model fallback active', 'warning');
  updateTrackingStatus(reasonMessage);
}

function initModelHandling() {
  if (assetManifest.model.mode !== 'gltf' || !heroModel) {
    setPill(modelStatePill, 'Model procedural', 'ok');
    return;
  }

  setPill(modelStatePill, 'Model loading', 'neutral');

  heroModel.addEventListener('model-loaded', () => {
    runtimeState.modelReady = true;
    runtimeState.fallbackActive = false;
    if (heroFallback) {
      heroFallback.setAttribute('visible', 'false');
    }
    setPill(modelStatePill, 'Model ready', 'ok');
  });

  heroModel.addEventListener('model-error', () => {
    activateProceduralFallback();
  });
}

function appendChatMessage(role, text, meta = '') {
  const item = document.createElement('article');
  item.className = `chat-message chat-message-${role}`;
  item.innerHTML = `
    <p class="chat-role">${role === 'assistant' ? chatbotContent.personaName : 'Anda'}</p>
    <p class="chat-text"></p>
    ${meta ? `<p class="chat-meta">${meta}</p>` : ''}
  `;
  item.querySelector('.chat-text').textContent = text;
  chatbotLog.appendChild(item);
  chatbotEmpty.hidden = true;
  chatbotLog.scrollTop = chatbotLog.scrollHeight;
}

function askChatbot(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;

  appendChatMessage('user', cleanQuestion);
  const reply = getChatbotReply(cleanQuestion);
  appendChatMessage('assistant', reply.answer, reply.matchedQuestion ? `Topik: ${reply.matchedQuestion}` : 'Jawaban umum');
}

function initChatbot() {
  createInitialMessages().forEach((message) => appendChatMessage(message.role, message.text));

  chatbotForm.addEventListener('submit', (event) => {
    event.preventDefault();
    askChatbot(chatbotInput.value);
    chatbotInput.value = '';
    chatbotInput.focus();
  });

  document.querySelectorAll('[data-chatbot-question]').forEach((button) => {
    button.addEventListener('click', () => {
      askChatbot(button.dataset.chatbotQuestion || '');
    });
  });
}

enterArButton.addEventListener('click', async () => {
  openArStage();

  if (!checkCompatibility()) {
    setPill(cameraStatePill, 'Camera unsupported', 'warning');
    setPill(markerStatePill, 'Marker waiting', 'warning');
    return;
  }

  setPill(cameraStatePill, 'Camera requesting', 'neutral');
  setPill(markerStatePill, 'Marker pending', 'neutral');
  updateSupportCopy(appConfig.support.markerHint);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    stream.getTracks().forEach((track) => track.stop());
    runtimeState.cameraGranted = true;
    setPill(cameraStatePill, 'Camera granted', 'ok');
    setPill(markerStatePill, 'Marker searching', 'warning');
    updateTrackingStatus(productContent.states.cameraGranted);
    updateSupportCopy(`${appConfig.support.mobileHint} ${appConfig.support.markerHint}`);

    if (scene?.components?.arjs) {
      updateTrackingStatus(productContent.states.arReady);
    }
  } catch (error) {
    runtimeState.cameraGranted = false;
    setPill(cameraStatePill, 'Camera denied', 'warning');
    updateTrackingStatus(productContent.states.cameraDenied);
    updateSupportCopy(appConfig.support.secureContextHint);
    console.error(error);
  }
});

marker?.addEventListener('markerFound', () => {
  runtimeState.markerFound = true;
  setPill(markerStatePill, 'Marker found', 'ok');
  updateTrackingStatus(productContent.states.markerFound);
  updateSupportCopy('Tap hotspot yang aktif untuk menjelaskan fitur unggulan saat presentasi berlangsung.');
});

marker?.addEventListener('markerLost', () => {
  runtimeState.markerFound = false;
  setPill(markerStatePill, 'Marker lost', 'warning');
  updateTrackingStatus(productContent.states.markerLost);
  updateSupportCopy(appConfig.support.markerHint);
});

scene?.addEventListener('loaded', () => {
  setPill(markerStatePill, 'Marker ready', 'neutral');
  initModelHandling();
});

document.querySelectorAll('[data-hotspot-id]').forEach((button, index) => {
  button.addEventListener('click', () => {
    setHotspot(button.dataset.hotspotId);
    if (!runtimeState.markerFound) {
      updateTrackingStatus(productContent.states.markerSearching);
    }
  });

  if (index === 0) {
    setHotspot(button.dataset.hotspotId);
  }
});

initChatbot();
checkCompatibility();
