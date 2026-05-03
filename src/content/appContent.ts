import type { ActiveProductResolution, ThemeTokens } from '../types/app';
import { products } from './products';

export { productIds, products } from './products';

export const routes = {
  intro: '/',
  scan: '/scan',
  afterScan: '/after-scan',
} as const;

export const themeTokens: ThemeTokens = {
  base: '#f5f5f7',
  surface: '#ffffff',
  text: '#1d1d1f',
  muted: '#6e6e73',
  stroke: '#d2d2d7',
  accent: '#0071e3',
};

export const defaultProductId = 'apple-iphone';

const productAliases: Record<string, string> = {
  iphone: 'apple-iphone',
  'apple-iphone': 'apple-iphone',

  macbook: 'apple-macbook',
  'mac-book': 'apple-macbook',
  'apple-macbook': 'apple-macbook',

  airpods: 'apple-airpods',
  'air-pods': 'apple-airpods',
  'apple-airpods': 'apple-airpods',

  ipad: 'apple-ipad',
  'apple-ipad': 'apple-ipad',

  watch: 'apple-watch',
  applewatch: 'apple-watch',
  'apple-watch': 'apple-watch',
};

function resolveProductId(rawValue: string | null) {
  const normalized = rawValue?.trim().toLowerCase() || null;
  if (!normalized) return null;

  return productAliases[normalized] || normalized;
}

export function getActiveProduct(searchParams: URLSearchParams): ActiveProductResolution {
  const rawValue = searchParams.get('product');
  const resolvedProductId = resolveProductId(rawValue);

  if (!resolvedProductId) {
    return {
      productId: defaultProductId,
      product: products[defaultProductId],
      requestedProductId: null,
      usedFallback: true,
      fallbackReason: 'missing',
    };
  }

  const product = products[resolvedProductId];
  if (product) {
    return {
      productId: resolvedProductId,
      product,
      requestedProductId: resolvedProductId,
      usedFallback: false,
      fallbackReason: null,
    };
  }

  return {
    productId: defaultProductId,
    product: products[defaultProductId],
    requestedProductId: resolvedProductId,
    usedFallback: true,
    fallbackReason: 'invalid',
  };
}

export function toProductPath(path: string, productId: string) {
  const query = new URLSearchParams({ product: productId });
  return `${path}?${query.toString()}`;
}

export function buildProductSearch(productId: string) {
  const query = new URLSearchParams({ product: productId });
  return `?${query.toString()}`;
}

export const operatorGuidance = {
  markerSlow: 'Flatten poster, reduce glare, and keep full marker in frame.',
  markerLost: 'Hold device steady, then re-center marker for lock recovery.',
  cameraDenied: 'Enable camera permission for this origin and reopen scan.',
  sceneDelayed: 'Wait a few seconds or refresh if camera feed remains delayed.',
} as const;

export const appMeta = {
  appName: 'Apple Devices Smart Poster AR Demo',
  supportedMobile: 'Chrome Android / Safari iPhone',
};
