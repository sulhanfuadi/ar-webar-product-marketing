import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { ModelLoadState, ProductArModelConfig } from '../types/app';

type ThreeModule = typeof import('three');
type GLTFLoaderModule = {
  GLTFLoader: new () => {
    load: (
      url: string,
      onLoad: (gltf: { scene?: import('three').Object3D; scenes?: import('three').Object3D[] }) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (error: unknown) => void,
    ) => void;
  };
};

interface UseMindArOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  imageTargetSrc: string;
  fallbackImageTargetSrc?: string;
  productArModel?: ProductArModelConfig;
  onStage: (stage: 'requesting_camera' | 'ready' | 'searching' | 'found' | 'lost' | 'error') => void;
  onCameraGranted: (granted: boolean) => void;
  onMarkerLocked: (locked: boolean) => void;
  onError?: (message: string | null) => void;
  onModelLoadState?: (state: ModelLoadState) => void;
  onModelError?: (message: string | null) => void;
  enabled: boolean;
  bootNonce: number;
}

const MINDAR_MODULE_SPECIFIERS = ['mindar-image-three'];
const THREE_MODULE_SPECIFIERS = ['three'];
const GLTF_LOADER_SPECIFIERS = ['three/addons/loaders/GLTFLoader.js'];

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string) {
  return Promise.race<T>([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs);
    }),
  ]);
}

function normalizeRuntimeError(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error ?? 'Unknown runtime failure');
  const message = raw.toLowerCase();

  if (message.includes('notallowederror') || message.includes('permission') || message.includes('denied')) {
    return 'Camera permission was denied. Open browser site settings, allow camera, then retry.';
  }

  if (message.includes('secure camera runtime') || message.includes('secure context')) {
    return 'Camera requires secure HTTPS context. Reopen this page from a valid HTTPS URL.';
  }

  if (message.includes('script load') || message.includes('module load') || message.includes('failed to fetch dynamically imported module')) {
    return 'AR engine module failed to load. Check network/adblock/shields or import map access, then retry.';
  }

  if (message.includes('timed out')) {
    return 'AR startup timed out. Retry camera and keep only one browser tab active.';
  }

  return `AR runtime failed: ${raw}`;
}

function normalizeModelError(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error ?? 'Unknown model load failure');
  const message = raw.toLowerCase();

  if (message.includes('timed out')) {
    return '3D model failed to load in time. Check connection, then retry scan.';
  }

  if (message.includes('404') || message.includes('not found')) {
    return '3D model file was not found on this deployment. Redeploy with model asset included.';
  }

  return `3D model failed to load: ${raw}`;
}

function ensureGlobalMindAR(moduleValue: unknown) {
  const moduleRecord = moduleValue as Record<string, unknown>;
  const defaultRecord = moduleRecord?.default as Record<string, unknown> | undefined;

  const maybeCtor = moduleRecord?.MindARThree ?? defaultRecord?.MindARThree;

  if (!maybeCtor) {
    throw new Error('MindAR module loaded but MindARThree export is missing');
  }

  if (!window.MINDAR) {
    window.MINDAR = {} as NonNullable<Window['MINDAR']>;
  }

  if (!window.MINDAR.IMAGE) {
    window.MINDAR.IMAGE = {} as NonNullable<NonNullable<Window['MINDAR']>['IMAGE']>;
  }

  const imageNamespace = window.MINDAR.IMAGE as NonNullable<NonNullable<Window['MINDAR']>['IMAGE']>;
  imageNamespace.MindARThree = maybeCtor as typeof imageNamespace.MindARThree;
}

async function loadThreeModule() {
  let lastError: unknown = null;

  for (const moduleSpecifier of THREE_MODULE_SPECIFIERS) {
    try {
      const moduleValue = await import(/* @vite-ignore */ moduleSpecifier);
      return moduleValue as ThreeModule;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Unable to load Three.js module');
}

async function loadGLTFLoaderModule() {
  let lastError: unknown = null;

  for (const moduleSpecifier of GLTF_LOADER_SPECIFIERS) {
    try {
      const moduleValue = await import(/* @vite-ignore */ moduleSpecifier);
      return moduleValue as GLTFLoaderModule;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Unable to load GLTFLoader module');
}

function enforceCameraFill(container: HTMLDivElement | null) {
  if (!container) return;

  const mediaNodes = container.querySelectorAll<HTMLElement>('video, canvas');
  mediaNodes.forEach((node) => {
    node.style.position = 'absolute';
    node.style.inset = '0';
    node.style.width = '100%';
    node.style.height = '100%';
    node.style.objectFit = 'cover';
  });
}

async function loadMindARModule() {
  if (window.MINDAR?.IMAGE?.MindARThree) {
    return;
  }

  let lastError: unknown = null;

  for (const moduleSpecifier of MINDAR_MODULE_SPECIFIERS) {
    try {
      const moduleValue = await import(/* @vite-ignore */ moduleSpecifier);
      ensureGlobalMindAR(moduleValue);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Unable to load MindAR module');
}

export function useMindArRuntime({
  containerRef,
  imageTargetSrc,
  fallbackImageTargetSrc,
  productArModel,
  onStage,
  onCameraGranted,
  onMarkerLocked,
  onError,
  onModelLoadState,
  onModelError,
  enabled,
  bootNonce,
}: UseMindArOptions) {
  const runtimeRef = useRef<{ stop: (() => void) | null; cleanup: (() => void) | null }>({ stop: null, cleanup: null });
  const [isBooting, setIsBooting] = useState(false);

  const status = useMemo(() => ({ isBooting }), [isBooting]);

  useEffect(() => {
    if (!enabled || !containerRef.current) {
      onModelLoadState?.('idle');
      onModelError?.(null);
      return;
    }

    let canceled = false;

    const boot = async () => {
      setIsBooting(true);
      onError?.(null);
      onModelError?.(null);
      onModelLoadState?.('idle');
      onStage('requesting_camera');
      let permissionGranted = false;

      const buildRuntime = (
        targetSrc: string,
        threeModule: ThreeModule,
        gltfLoaderModule: GLTFLoaderModule | null,
        arModel: ProductArModelConfig | undefined,
      ) => {
        if (!containerRef.current || !window.MINDAR?.IMAGE?.MindARThree) {
          throw new Error('MindAR runtime unavailable');
        }

        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
          container: containerRef.current,
          imageTargetSrc: targetSrc,
          uiLoading: 'no',
          uiScanning: 'no',
          maxTrack: 1,
        });

        const { renderer, scene, camera } = mindarThree;

        const lightA = new threeModule.HemisphereLight(0xffffff, 0xb2b2b2, 1.2);
        const lightB = new threeModule.DirectionalLight(0xffffff, 0.9);
        lightB.position.set(0, 1, 1);
        scene.add(lightA, lightB);

        const anchor = mindarThree.addAnchor(0);
        if (arModel && gltfLoaderModule) {
          const tryLoadModel = async () => {
            try {
              onModelLoadState?.('loading');
              onModelError?.(null);
              const loader = new gltfLoaderModule.GLTFLoader();
              const loadedModel = await withTimeout(
                new Promise<import('three').Object3D>((resolve, reject) => {
                  loader.load(
                    arModel.url,
                    (gltf) => {
                      const root = gltf.scene ?? gltf.scenes?.[0];
                      if (!root) {
                        reject(new Error('GLB scene root is missing'));
                        return;
                      }
                      resolve(root);
                    },
                    undefined,
                    (error) => reject(error),
                  );
                }),
                25000,
                'GLB model load',
              );

              if (canceled) {
                return;
              }

              loadedModel.scale.set(arModel.scale[0], arModel.scale[1], arModel.scale[2]);
              loadedModel.position.set(arModel.position[0], arModel.position[1], arModel.position[2]);
              loadedModel.rotation.set(arModel.rotation[0], arModel.rotation[1], arModel.rotation[2]);

              anchor.group.add(loadedModel);
              onModelLoadState?.('ready');
              onModelError?.(null);
            } catch (error) {
              console.warn('GLB model load failed.', error);
              onModelLoadState?.('error');
              onModelError?.(normalizeModelError(error));
            }
          };

          void tryLoadModel();
        } else if (!arModel) {
          onModelLoadState?.('error');
          onModelError?.('3D model path is not configured for this product.');
        } else {
          onModelLoadState?.('error');
          onModelError?.('3D loader module is unavailable in this runtime.');
        }

        anchor.onTargetFound = () => {
          onMarkerLocked(true);
          onStage('found');
        };

        anchor.onTargetLost = () => {
          onMarkerLocked(false);
          onStage('lost');
        };

        return { mindarThree, renderer, scene, camera };
      };

      try {
        if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
          throw new Error('Browser does not support secure camera runtime');
        }

        const permissionStream = await withTimeout(
          navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }),
          10000,
          'Camera permission request',
        );
        permissionGranted = true;
        permissionStream.getTracks().forEach((track) => track.stop());
        onCameraGranted(true);
        onStage('ready');

        await withTimeout(loadMindARModule(), 9000, 'MindAR module load');
        const threeModule = await withTimeout(loadThreeModule(), 5000, 'Three.js module load');
        const gltfLoaderModule = await withTimeout(loadGLTFLoaderModule(), 5000, 'GLTFLoader module load').catch(() => null);

        if (canceled || !containerRef.current || !window.MINDAR?.IMAGE?.MindARThree) return;

        let runtime = buildRuntime(imageTargetSrc, threeModule, gltfLoaderModule, productArModel);

        try {
          await withTimeout(runtime.mindarThree.start(), 12000, 'MindAR start');
        } catch (primaryError) {
          runtime.mindarThree.stop();
          runtime.renderer.setAnimationLoop(null);

          if (!fallbackImageTargetSrc || fallbackImageTargetSrc === imageTargetSrc) {
            throw primaryError;
          }

          runtime = buildRuntime(fallbackImageTargetSrc, threeModule, gltfLoaderModule, productArModel);
          await withTimeout(runtime.mindarThree.start(), 12000, 'MindAR fallback start');
        }

        if (canceled) {
          runtime.mindarThree.stop();
          return;
        }

        onCameraGranted(true);
        onStage('searching');

        enforceCameraFill(containerRef.current);
        [120, 300, 600, 1000].forEach((delayMs) => {
          window.setTimeout(() => enforceCameraFill(containerRef.current), delayMs);
        });

        runtime.renderer.setAnimationLoop(() => {
          runtime.renderer.render(runtime.scene, runtime.camera);
        });

        runtimeRef.current.stop = () => {
          runtime.renderer.setAnimationLoop(null);
          runtime.mindarThree.stop();
        };

        runtimeRef.current.cleanup = () => {
          while (containerRef.current?.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
        };
      } catch (error) {
        if (!permissionGranted) {
          onCameraGranted(false);
        }

        onModelLoadState?.('idle');
        onModelError?.(null);
        onError?.(normalizeRuntimeError(error));
        onStage('error');
      } finally {
        setIsBooting(false);
      }
    };

    void boot();

    return () => {
      canceled = true;
      runtimeRef.current.stop?.();
      runtimeRef.current.cleanup?.();
      runtimeRef.current.stop = null;
      runtimeRef.current.cleanup = null;
    };
  }, [
    bootNonce,
    containerRef,
    enabled,
    fallbackImageTargetSrc,
    imageTargetSrc,
    onCameraGranted,
    onError,
    onModelError,
    onModelLoadState,
    onMarkerLocked,
    onStage,
    productArModel,
  ]);

  return status;
}
