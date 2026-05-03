import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';
import { loadImage } from 'canvas';
import { OfflineCompiler } from '@zenith-xperience/mindar-offline-compiler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const sourceRoot = path.resolve(projectRoot, '../resources/products');
const targetRoot = path.resolve(projectRoot, 'public/assets/markers/products');

const productSources = {
  'apple-iphone': 'iphone.png',
  'apple-macbook': 'macbook.png',
  'apple-airpods': 'airpods.png',
  'apple-ipad': 'ipad.png',
  'apple-watch': 'apple-watch.png',
};

async function ensureFile(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(`Missing file: ${filePath}`);
  }
}

async function generateProductTarget(productId, filename) {
  const sourceImagePath = path.join(sourceRoot, filename);
  const productDir = path.join(targetRoot, productId);
  const targetMindPath = path.join(productDir, 'target.mind');
  const referencePath = path.join(productDir, 'reference.png');

  await ensureFile(sourceImagePath);
  await fs.mkdir(productDir, { recursive: true });

  const image = await loadImage(sourceImagePath);
  const compiler = new OfflineCompiler();

  process.stdout.write(`Compiling ${productId}...\n`);
  await compiler.compileImageTargets([image], () => {});
  const mindData = compiler.exportData();

  await fs.writeFile(targetMindPath, Buffer.from(mindData));
  await fs.copyFile(sourceImagePath, referencePath);

  const stats = await fs.stat(targetMindPath);
  process.stdout.write(`Done ${productId}: ${stats.size} bytes -> ${targetMindPath}\n`);
}

async function main() {
  process.stdout.write(`Source root: ${sourceRoot}\n`);
  process.stdout.write(`Target root: ${targetRoot}\n\n`);

  for (const [productId, filename] of Object.entries(productSources)) {
    await generateProductTarget(productId, filename);
  }

  process.stdout.write('\nAll product markers generated successfully.\n');
}

main().catch((error) => {
  console.error('Marker generation failed:', error.message);
  process.exitCode = 1;
});
