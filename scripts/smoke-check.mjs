import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  'src/config/content.js',
  'src/lib/arScene.js',
  'src/lib/chatbot.js',
  'src/main.js',
  'README.md',
  'docs/operator-runbook.md',
  'docs/mobile-qa-matrix.md',
  'docs/known-limitations.md',
  'docs/release-checklist.md',
  'public/assets/poster/poster-preview.svg',
  'public/assets/poster/poster-marker-guide.svg',
  'public/assets/markers/custom-marker-reference.svg',
  'public/assets/markers/custom-marker-placeholder.patt',
  'public/assets/branding/brand-thumb.svg',
  'public/assets/models/phone-demo.glb',
];

const missing = files.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error('Missing required files:\n' + missing.join('\n'));
  process.exit(1);
}

const configText = fs.readFileSync(path.join(root, 'src/config/content.js'), 'utf8');
const requiredConfigSnippets = [
  'intro_minimal',
  'ar_scan',
  'post_scan',
  'appleInspired',
  "mode: 'local'",
  'Presentation FAQ Assistant',
  'knownLimitations',
  'markerSearchTimeoutMs',
];
const missingConfigSnippets = requiredConfigSnippets.filter((snippet) => !configText.includes(snippet));
if (missingConfigSnippets.length) {
  console.error('Config missing snippets:\n' + missingConfigSnippets.join('\n'));
  process.exit(1);
}

const sceneText = fs.readFileSync(path.join(root, 'src/lib/arScene.js'), 'utf8');
const requiredSceneSnippets = [
  'data-view="intro_minimal"',
  'data-view="ar_scan"',
  'data-view="post_scan"',
  'enter-ar-btn',
  'main-marker',
  'chatbot-panel',
];
const missingSceneSnippets = requiredSceneSnippets.filter((snippet) => !sceneText.includes(snippet));
if (missingSceneSnippets.length) {
  console.error('Scene missing snippets:\n' + missingSceneSnippets.join('\n'));
  process.exit(1);
}

const runtimeText = fs.readFileSync(path.join(root, 'src/main.js'), 'utf8');
const requiredRuntimeSnippets = [
  'setRuntimeStage',
  'setChatbotPending',
  'setView',
  'startMarkerSearchTimer',
  'checkCompatibility',
];
const missingRuntimeSnippets = requiredRuntimeSnippets.filter((snippet) => !runtimeText.includes(snippet));
if (missingRuntimeSnippets.length) {
  console.error('Runtime missing snippets:\n' + missingRuntimeSnippets.join('\n'));
  process.exit(1);
}

const readmeText = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const requiredReadmeSnippets = ['Apple-inspired', 'minimal intro', 'post-scan', 'Handoff documents'];
const missingReadmeSnippets = requiredReadmeSnippets.filter((snippet) => !readmeText.includes(snippet));
if (missingReadmeSnippets.length) {
  console.error('README missing snippets:\n' + missingReadmeSnippets.join('\n'));
  process.exit(1);
}

console.log('Smoke check passed: three-view Apple-inspired flow, AR scan runtime, and local-first FAQ support are present.');
