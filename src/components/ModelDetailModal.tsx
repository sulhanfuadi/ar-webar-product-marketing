import { useCallback, useEffect, useRef, useState } from 'react';

type ThreeModule = typeof import('three');
type GLTFLoaderModule = typeof import('three/addons/loaders/GLTFLoader.js');
type OrbitControlsModule = typeof import('three/addons/controls/OrbitControls.js');
type OrbitControlsInstance = import('three/addons/controls/OrbitControls.js').OrbitControls;
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
  const resetViewRef = useRef<(() => void) | null>(null);
  const [viewerState, setViewerState] = useState<ViewerState>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    if (!open) return;
    setViewerState('loading');
    setErrorMessage(null);
  }, [open, modelUrl]);

  const handleRetry = useCallback(() => {
    setViewerState('loading');
    setErrorMessage(null);
    setReloadNonce((value) => value + 1);
  }, []);

  const handleResetView = useCallback(() => {
    resetViewRef.current?.();
  }, []);

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
    let controls: OrbitControlsInstance | null = null;
    let activeThreeModule: ThreeModule | null = null;
    let camera: import('three').PerspectiveCamera | null = null;
    let initialCameraPosition: import('three').Vector3 | null = null;
    let initialTargetPosition: import('three').Vector3 | null = null;

    const bootViewer = async () => {
      try {
        const [threeModule, gltfLoaderModule, orbitControlsModule] = (await Promise.all([
          import('three'),
          import('three/addons/loaders/GLTFLoader.js'),
          import('three/addons/controls/OrbitControls.js'),
        ])) as [ThreeModule, GLTFLoaderModule, OrbitControlsModule];

        if (canceled) return;
        activeThreeModule = threeModule;

        const scene = new threeModule.Scene();
        scene.background = new threeModule.Color(0x07090c);

        camera = new threeModule.PerspectiveCamera(44, 1, 0.01, 300);
        camera.position.set(0, 0.12, 2.4);

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

        controls = new orbitControlsModule.OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableRotate = true;
        controls.enableZoom = true;
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.rotateSpeed = 0.68;
        controls.zoomSpeed = 0.92;
        controls.minPolarAngle = 0.25;
        controls.maxPolarAngle = Math.PI - 0.28;
        controls.touches = {
          ONE: threeModule.TOUCH.ROTATE,
          TWO: threeModule.TOUCH.DOLLY_ROTATE,
        };

        const ambient = new threeModule.HemisphereLight(0xffffff, 0x666666, 1.15);
        const directional = new threeModule.DirectionalLight(0xffffff, 1.2);
        directional.position.set(1.8, 2.1, 1.4);
        const fill = new threeModule.DirectionalLight(0xffffff, 0.45);
        fill.position.set(-1.6, 0.9, -1.2);
        scene.add(ambient, directional, fill);

        const pivot = new threeModule.Group();
        scene.add(pivot);

        const resize = () => {
          if (!renderer || !camera) return;
          const width = Math.max(host.clientWidth, 1);
          const height = Math.max(host.clientHeight, 1);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
        };

        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(host);

        const animate = () => {
          if (!renderer || !camera) return;
          frameId = window.requestAnimationFrame(animate);
          controls?.update();
          renderer.render(scene, camera);
        };
        animate();

        const loader = new gltfLoaderModule.GLTFLoader();
        loader.load(
          modelUrl,
          (gltf) => {
            if (canceled || !camera || !controls) return;

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
            const aspect = Math.max(host.clientWidth, 1) / Math.max(host.clientHeight, 1);
            const verticalFov = threeModule.MathUtils.degToRad(camera.fov);
            const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * aspect);

            const fitHeightDistance = radius / Math.sin(verticalFov / 2);
            const fitWidthDistance = radius / Math.sin(horizontalFov / 2);
            const fitDistance = Math.max(fitHeightDistance, fitWidthDistance) * 1.14;

            camera.position.set(0, radius * 0.16, fitDistance);
            camera.near = Math.max(fitDistance / 200, 0.01);
            camera.far = Math.max(fitDistance * 30, 80);
            camera.updateProjectionMatrix();

            controls.target.set(0, 0, 0);
            controls.minDistance = Math.max(fitDistance * 0.52, radius * 0.7);
            controls.maxDistance = Math.max(fitDistance * 2.2, controls.minDistance + 0.3);
            controls.update();

            initialCameraPosition = camera.position.clone();
            initialTargetPosition = controls.target.clone();
            resetViewRef.current = () => {
              if (!camera || !controls || !initialCameraPosition || !initialTargetPosition) return;
              camera.position.copy(initialCameraPosition);
              controls.target.copy(initialTargetPosition);
              controls.update();
            };

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
      resetViewRef.current = null;
      document.body.style.overflow = previousBodyOverflow;
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      controls?.dispose();

      if (loadedRoot && activeThreeModule) {
        disposeObject3D(activeThreeModule, loadedRoot);
      }

      renderer?.dispose();
      if (renderer && host.contains(renderer.domElement)) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [open, modelUrl, reloadNonce]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/85">
      <div
        className="h-full w-full"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 0.5rem)',
          paddingRight: 'max(env(safe-area-inset-right), 0.5rem)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)',
          paddingLeft: 'max(env(safe-area-inset-left), 0.5rem)',
        }}
      >
        <div className="mx-auto flex h-full w-full max-w-5xl flex-col rounded-[24px] border border-white/25 bg-black/85 p-3 shadow-apple backdrop-blur-xl sm:h-[min(94dvh,920px)] sm:p-4">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.12em] text-white/60">3D Detail Viewer</p>
              <h2 className="mt-1 truncate text-xl font-semibold text-white sm:text-2xl">{title}</h2>
              <p className="mt-1 text-sm text-white/70 sm:text-base">Rotate and pinch to zoom the model</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleResetView}
                className="inline-flex h-10 min-w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 px-3 text-sm font-medium text-white transition hover:bg-white/20"
              >
                Reset View
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 min-w-20 items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 text-base font-medium text-white transition hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </header>

          <div className="mt-3 min-h-0 flex-1">
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/20 bg-black">
              <div ref={canvasHostRef} className="h-full w-full" />
              {viewerState === 'loading' && (
                <div className="absolute inset-0 grid place-items-center bg-black/50 p-4 text-center text-sm text-white/85">
                  Loading 3D model…
                </div>
              )}
              {viewerState === 'error' && (
                <div className="absolute inset-0 grid place-items-center p-4">
                  <div className="max-w-sm rounded-2xl border border-apple-dangerStroke bg-black/70 p-4 text-center text-sm text-white/90">
                    <p className="font-semibold">3D model failed to load</p>
                    <p className="mt-1 text-white/75">{errorMessage ?? 'Unable to load detail model.'}</p>
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="mt-3 inline-flex h-10 items-center justify-center rounded-full bg-apple-accent px-4 text-sm font-medium text-white transition hover:brightness-105"
                    >
                      Retry Load
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
