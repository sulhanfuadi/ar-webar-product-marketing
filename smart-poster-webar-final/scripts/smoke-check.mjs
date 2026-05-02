import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  'src/config/content.js',
  'src/lib/arScene.js',
  'src/lib/chatbot.js',
  'src/main.js',
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
const requiredSnippets = [
  'productName',
  'cta:',
  'marker:',
  'patternUrl',
  'fallbackMode',
  'chatbotContent',
  'quickQuestions',
  'faq:',
];

const missingSnippets = requiredSnippets.filter((snippet) => !configText.includes(snippet));
if (missingSnippets.length) {
  console.error('Config missing snippets:\n' + missingSnippets.join('\n'));
  process.exit(1);
}

console.log('Smoke check passed: final WebAR config, chatbot, and assets are present.');
