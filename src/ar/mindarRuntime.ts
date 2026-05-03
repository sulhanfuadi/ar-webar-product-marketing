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
  enabled: boolean;
}

const MINDAR_SCRIPT = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js';

function loadMindARScript() {
  if (window.MINDAR?.IMAGE?.MindARThree) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-mindar="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('MindAR script failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.src = MINDAR_SCRIPT;
    script.async = true;
    script.dataset.mindar = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('MindAR script failed to load'));
    document.head.appendChild(script);
  });
}

export function useMindArRuntime({
  containerRef,
  imageTargetSrc,
  fallbackImageTargetSrc,
  onStage,
  onCameraGranted,
  onMarkerLocked,
  enabled,
}: UseMindArOptions) {
  const runtimeRef = useRef<{ stop: (() => void) | null; cleanup: (() => void) | null }>({ stop: null, cleanup: null });
  const [isBooting, setIsBooting] = useState(false);

  const status = useMemo(() => ({ isBooting }), [isBooting]);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    let canceled = false;

    const boot = async () => {
      setIsBooting(true);
      onStage('requesting_camera');

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
        await loadMindARScript();
        if (canceled || !containerRef.current || !window.MINDAR?.IMAGE?.MindARThree) return;

        let runtime = buildRuntime(imageTargetSrc);

        try {
          await runtime.mindarThree.start();
        } catch (primaryError) {
          runtime.mindarThree.stop();
          runtime.renderer.setAnimationLoop(null);

          if (!fallbackImageTargetSrc || fallbackImageTargetSrc === imageTargetSrc) {
            throw primaryError;
          }

          runtime = buildRuntime(fallbackImageTargetSrc);
          await runtime.mindarThree.start();
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
      } catch {
        onCameraGranted(false);
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
  }, [containerRef, enabled, fallbackImageTargetSrc, imageTargetSrc, onCameraGranted, onMarkerLocked, onStage]);

  return status;
}
