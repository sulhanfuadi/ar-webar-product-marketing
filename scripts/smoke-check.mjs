import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const mustExist = [
  'src/main.tsx',
  'src/App.tsx',
  'src/index.css',
  'src/content/appContent.ts',
  'src/content/products/appleMacbook.ts',
  'src/content/products/shared.ts',
  'src/state/ScanSessionContext.tsx',
  'src/ar/mindarRuntime.ts',
  'src/pages/ScanPage.tsx',
  'src/components/ScanActionPanel.tsx',
  'scripts/generate-mvp-marker.mjs',
  'public/assets/markers/mvp/macbook-air/reference.png',
  'public/assets/markers/mvp/macbook-air/target.mind',
  'README.md',
  'docs/release-checklist.md',
  'docs/mobile-qa-matrix.md',
  'docs/operator-runbook.md',
  'docs/known-limitations.md',
  'vercel.json',
];

const missing = mustExist.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error('Missing required files:\n' + missing.join('\n'));
  process.exit(1);
}

const appText = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8');
const appSnippets = ['routes.root', 'routes.scan', '<Routes>', '<Route'];
const missingApp = appSnippets.filter((snippet) => !appText.includes(snippet));
if (missingApp.length) {
  console.error('App route snippets missing:\n' + missingApp.join('\n'));
  process.exit(1);
}

if (appText.includes('routes.afterScan')) {
  console.error('App routes still reference after-scan path in scan-first mode');
  process.exit(1);
}

const runtimeText = fs.readFileSync(path.join(root, 'src/ar/mindarRuntime.ts'), 'utf8');
const runtimeSnippets = ['MindARThree', 'requesting_camera', 'onTargetFound', 'onTargetLost'];
const missingRuntime = runtimeSnippets.filter((snippet) => !runtimeText.includes(snippet));
if (missingRuntime.length) {
  console.error('MindAR runtime snippets missing:\n' + missingRuntime.join('\n'));
  process.exit(1);
}

const contentText = fs.readFileSync(path.join(root, 'src/content/appContent.ts'), 'utf8');
const contentSnippets = ['mvpProduct', 'appleMacbook', 'Product Scan-First AR MVP'];
const missingContent = contentSnippets.filter((snippet) => !contentText.includes(snippet));
if (missingContent.length) {
  console.error('MVP content snippets missing:\n' + missingContent.join('\n'));
  process.exit(1);
}

const scanPageText = fs.readFileSync(path.join(root, 'src/pages/ScanPage.tsx'), 'utf8');
const scanPageSnippets = ['mvpProduct.scanTarget.mindTargetUrl', 'runtime.stage === \'found\'', 'ScanActionPanel'];
const missingScanPage = scanPageSnippets.filter((snippet) => !scanPageText.includes(snippet));
if (missingScanPage.length) {
  console.error('Scan page MVP snippets missing:\n' + missingScanPage.join('\n'));
  process.exit(1);
}

if (scanPageText.includes('afterScan') || scanPageText.includes('useSearchParams') || scanPageText.includes('getActiveProduct')) {
  console.error('Scan page must not include legacy product-query logic in single-marker MVP mode');
  process.exit(1);
}

const actionPanelText = fs.readFileSync(path.join(root, 'src/components/ScanActionPanel.tsx'), 'utf8');
const ctaSnippets = ['product.actions.map', 'product.mediaPreviews.map', 'scanPanel.actionsHeading', 'scanPanel.mediaHeading'];
const missingCta = ctaSnippets.filter((snippet) => !actionPanelText.includes(snippet));
if (missingCta.length) {
  console.error('In-scan action panel snippets missing:\n' + missingCta.join('\n'));
  process.exit(1);
}

const sharedText = fs.readFileSync(path.join(root, 'src/content/products/shared.ts'), 'utf8');
if (!sharedText.includes('/assets/markers/mvp/macbook-air/target.mind')) {
  console.error('Shared marker contract missing MVP target path');
  process.exit(1);
}

const macbookText = fs.readFileSync(path.join(root, 'src/content/products/appleMacbook.ts'), 'utf8');
const macbookSnippets = [
  'https://www.apple.com/macbook-air/',
  'https://www.apple.com/shop/buy-mac/macbook-air',
  'wa.me/6285291105501',
];
const missingMacbook = macbookSnippets.filter((snippet) => !macbookText.includes(snippet));
if (missingMacbook.length) {
  console.error('MacBook MVP snippets missing:\n' + missingMacbook.join('\n'));
  process.exit(1);
}

const vercelText = fs.readFileSync(path.join(root, 'vercel.json'), 'utf8');
if (!vercelText.includes('rewrites')) {
  console.error('vercel.json must include SPA rewrites for route-based flow');
  process.exit(1);
}

console.log('Smoke check passed: scan-first single-marker MVP flow is present.');
