import { useEffect, useRef, useState } from 'react';

type ThreeModule = typeof import('three');
type GLTFLoaderModule = typeof import('three/addons/loaders/GLTFLoader.js');

type ViewerState = 'loading' | 'ready' | 'error';

interface ModelDetailModalProps {
  open: boolean;
  modelUrl: string;
  title: string;
  onClose: () => void;
}

function disposeMaterial(material: import('three').Material) {
  const values = Object.values(material) as unknown[];
  values.forEach((value) => {
    if (
      typeof value === 'object' &&
      value !== null &&
      'isTexture' in value &&
      (value as import('three').Texture).isTexture
    ) {
      (value as import('three').Texture).dispose();
    }
  });
  material.dispose();
}

function disposeObject3D(threeModule: ThreeModule, root: import('three').Object3D) {
  root.traverse((node) => {
    if (!(node instanceof threeModule.Mesh)) return;

    node.geometry?.dispose();

    const material = node.material;
    if (Array.isArray(material)) {
      material.forEach((entry) => disposeMaterial(entry));
      return;
    }

    if (material) {
      disposeMaterial(material);
    }
  });
}

export function ModelDetailModal({ open, modelUrl, title, onClose }: ModelDetailModalProps) {
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const [viewerState, setViewerState] = useState<ViewerState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setViewerState('loading');
    setErrorMessage(null);
  }, [open, modelUrl]);

  useEffect(() => {
    if (!open || !canvasHostRef.current) return;

    const host = canvasHostRef.current;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let canceled = false;
    let frameId = 0;
    let loadedRoot: import('three').Object3D | null = null;
    let renderer: import('three').WebGLRenderer | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let removePointerListeners: (() => void) | null = null;
    let activeThreeModule: ThreeModule | null = null;

    const bootViewer = async () => {
      try {
        const [threeModule, gltfLoaderModule] = (await Promise.all([
          import('three'),
          import('three/addons/loaders/GLTFLoader.js'),
        ])) as [ThreeModule, GLTFLoaderModule];
        activeThreeModule = threeModule;

        if (canceled) return;

        const scene = new threeModule.Scene();
        scene.background = new threeModule.Color(0x08090b);

        const camera = new threeModule.PerspectiveCamera(45, 1, 0.01, 100);
        camera.position.set(0, 0.1, 2.2);

        renderer = new threeModule.WebGLRenderer({
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        });
        renderer.outputColorSpace = threeModule.SRGBColorSpace;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.domElement.style.touchAction = 'none';
        renderer.domElement.style.display = 'block';
        host.appendChild(renderer.domElement);

        const ambient = new threeModule.HemisphereLight(0xffffff, 0x7b7b7b, 1.2);
        const directional = new threeModule.DirectionalLight(0xffffff, 1.1);
        directional.position.set(1.2, 1.6, 1.1);
        scene.add(ambient, directional);

        const pivot = new threeModule.Group();
        scene.add(pivot);

        const resize = () => {
          if (!renderer) return;
          const width = Math.max(host.clientWidth, 1);
          const height = Math.max(host.clientHeight, 1);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
        };

        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);

        let dragging = false;
        let lastX = 0;
        let lastY = 0;

        const onPointerDown = (event: PointerEvent) => {
          if (!renderer) return;
          dragging = true;
          lastX = event.clientX;
          lastY = event.clientY;
          renderer.domElement.setPointerCapture(event.pointerId);
        };

        const onPointerMove = (event: PointerEvent) => {
          if (!dragging) return;

          const deltaX = event.clientX - lastX;
          const deltaY = event.clientY - lastY;
          lastX = event.clientX;
          lastY = event.clientY;

          pivot.rotation.y += deltaX * 0.008;
          pivot.rotation.x = threeModule.MathUtils.clamp(pivot.rotation.x + deltaY * 0.004, -0.95, 0.95);
        };

        const onPointerUp = (event: PointerEvent) => {
          if (!renderer) return;
          dragging = false;
          try {
            renderer.domElement.releasePointerCapture(event.pointerId);
          } catch {
            // no-op
          }
        };

        renderer.domElement.addEventListener('pointerdown', onPointerDown);
        renderer.domElement.addEventListener('pointermove', onPointerMove);
        renderer.domElement.addEventListener('pointerup', onPointerUp);
        renderer.domElement.addEventListener('pointercancel', onPointerUp);
        removePointerListeners = () => {
          if (!renderer) return;
          renderer.domElement.removeEventListener('pointerdown', onPointerDown);
          renderer.domElement.removeEventListener('pointermove', onPointerMove);
          renderer.domElement.removeEventListener('pointerup', onPointerUp);
          renderer.domElement.removeEventListener('pointercancel', onPointerUp);
        };

        const animate = () => {
          if (!renderer) return;
          frameId = window.requestAnimationFrame(animate);
          renderer.render(scene, camera);
        };
        animate();

        const loader = new gltfLoaderModule.GLTFLoader();
        loader.load(
          modelUrl,
          (gltf) => {
            if (canceled) return;

            const root = gltf.scene ?? gltf.scenes?.[0];
            if (!root) {
              setViewerState('error');
              setErrorMessage('3D model root is missing.');
              return;
            }

            loadedRoot = root;

            const box = new threeModule.Box3().setFromObject(root);
            const center = box.getCenter(new threeModule.Vector3());
            root.position.sub(center);

            const centeredBox = new threeModule.Box3().setFromObject(root);
            const sphere = centeredBox.getBoundingSphere(new threeModule.Sphere());
            const radius = Math.max(sphere.radius, 0.001);
            const fovRad = threeModule.MathUtils.degToRad(camera.fov);
            const fitDistance = (radius * 1.25) / Math.sin(fovRad / 2);

            camera.position.set(0, radius * 0.18, fitDistance);
            camera.near = Math.max(fitDistance / 200, 0.01);
            camera.far = Math.max(fitDistance * 25, 50);
            camera.lookAt(0, 0, 0);
            camera.updateProjectionMatrix();

            pivot.add(root);

            setViewerState('ready');
          },
          undefined,
          (error) => {
            if (canceled) return;
            setViewerState('error');
            const message = error instanceof Error ? error.message : String(error ?? 'Unknown model load error');
            setErrorMessage(`Failed to load model: ${message}`);
          },
        );
      } catch (error) {
        if (canceled) return;
        setViewerState('error');
        const message = error instanceof Error ? error.message : String(error ?? 'Unknown viewer init error');
        setErrorMessage(`Failed to initialize detail viewer: ${message}`);
      }
    };

    void bootViewer();

    return () => {
      canceled = true;
      document.body.style.overflow = previousBodyOverflow;
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      removePointerListeners?.();

      if (loadedRoot) {
        if (activeThreeModule) {
          disposeObject3D(activeThreeModule, loadedRoot);
        }
      }

      renderer?.dispose();
      if (renderer && host.contains(renderer.domElement)) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [open, modelUrl]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/80">
      <div
        className="h-full w-full px-2 sm:flex sm:items-center sm:justify-center sm:p-4"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 0.5rem)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)',
        }}
      >
        <div className="mx-auto flex h-full w-full max-w-4xl flex-col rounded-[24px] border border-white/25 bg-black/80 p-3 shadow-apple backdrop-blur-xl sm:h-[min(92dvh,880px)] sm:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.12em] text-white/60">3D Detail Viewer</p>
              <h2 className="mt-1 truncate text-xl font-semibold text-white sm:text-2xl">{title}</h2>
              <p className="mt-1 text-sm text-white/70 sm:text-base">Drag to rotate model</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 min-w-20 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 text-base font-medium text-white transition hover:bg-white/20"
            >
              Close
            </button>
          </div>

          <div className="mt-3 min-h-0 flex-1">
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/20 bg-black">
              <div ref={canvasHostRef} className="h-full w-full" />
              {viewerState === 'loading' && (
                <div className="absolute inset-0 grid place-items-center bg-black/50 text-sm text-white/80">
                  Loading 3D model…
                </div>
              )}
              {viewerState === 'error' && (
                <div className="absolute inset-0 grid place-items-center p-4 text-center text-sm text-white/85">
                  {errorMessage ?? '3D model failed to load.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
