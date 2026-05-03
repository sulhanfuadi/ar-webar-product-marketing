import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import * as THREE from 'three';

interface UseMindArOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  imageTargetSrc: string;
  fallbackImageTargetSrc?: string;
  onStage: (stage: 'requesting_camera' | 'ready' | 'searching' | 'found' | 'lost' | 'error') => void;
  onCameraGranted: (granted: boolean) => void;
  onMarkerLocked: (locked: boolean) => void;
  onError?: (message: string | null) => void;
  enabled: boolean;
  bootNonce: number;
}

const MINDAR_MODULE_SPECIFIERS = ['mindar-image-three'];

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
  onStage,
  onCameraGranted,
  onMarkerLocked,
  onError,
  enabled,
  bootNonce,
}: UseMindArOptions) {
  const runtimeRef = useRef<{ stop: (() => void) | null; cleanup: (() => void) | null }>({ stop: null, cleanup: null });
  const [isBooting, setIsBooting] = useState(false);

  const status = useMemo(() => ({ isBooting }), [isBooting]);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    let canceled = false;

    const boot = async () => {
      setIsBooting(true);
      onError?.(null);
      onStage('requesting_camera');
      let permissionGranted = false;

      const buildRuntime = (targetSrc: string) => {
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

        const lightA = new THREE.HemisphereLight(0xffffff, 0xb2b2b2, 1.2);
        const lightB = new THREE.DirectionalLight(0xffffff, 0.9);
        lightB.position.set(0, 1, 1);
        scene.add(lightA, lightB);

        const anchor = mindarThree.addAnchor(0);
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 1.1, 0.06),
          new THREE.MeshStandardMaterial({ color: 0x1d1d1f, roughness: 0.3, metalness: 0.2 }),
        );
        const screen = new THREE.Mesh(
          new THREE.BoxGeometry(0.53, 0.95, 0.01),
          new THREE.MeshStandardMaterial({ color: 0x9ec9f7, roughness: 0.45, metalness: 0.0 }),
        );
        screen.position.z = 0.035;
        anchor.group.add(body);
        anchor.group.add(screen);

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
        if (canceled || !containerRef.current || !window.MINDAR?.IMAGE?.MindARThree) return;

        let runtime = buildRuntime(imageTargetSrc);

        try {
          await withTimeout(runtime.mindarThree.start(), 12000, 'MindAR start');
        } catch (primaryError) {
          runtime.mindarThree.stop();
          runtime.renderer.setAnimationLoop(null);

          if (!fallbackImageTargetSrc || fallbackImageTargetSrc === imageTargetSrc) {
            throw primaryError;
          }

          runtime = buildRuntime(fallbackImageTargetSrc);
          await withTimeout(runtime.mindarThree.start(), 12000, 'MindAR fallback start');
        }

        if (canceled) {
          runtime.mindarThree.stop();
          return;
        }

        onCameraGranted(true);
        onStage('searching');

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
    onMarkerLocked,
    onStage,
  ]);

  return status;
}
