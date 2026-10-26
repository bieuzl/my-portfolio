import * as THREE from "three";
import { makeFresnelMaterial } from "./fresnel";

export interface SceneOptions {
  /** When true, renders one static frame and never starts the loop. */
  reducedMotion: boolean;
}

export interface SceneHandle {
  /** Normalized pointer (-1..1 on both axes) driving subtle parallax. */
  setPointer(nx: number, ny: number): void;
  /** 0..1 progress of the host section travelling through the viewport. */
  setScroll(progress: number): void;
  setReducedMotion(value: boolean): void;
  dispose(): void;
}

/**
 * Small decorative torus knot for the Projects section — a detail, not a
 * centerpiece. Slow ambient tumble, extra rotation tied to scroll progress,
 * gentle pointer parallax. Fully procedural: zero binary assets.
 */
export function mountSculptureScene(
  canvas: HTMLCanvasElement,
  options: SceneOptions,
): Promise<SceneHandle> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

  /* low segment counts + non-indexed = crisp flat facets */
  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 14, 2, 3).toNonIndexed();
  geometry.computeVertexNormals();
  /* Centraliza os vértices na origem: o bounding sphere do torus knot não é
     exatamente centrado em (0,0,0), o que deslocava o objeto no canvas. */
  geometry.center();
  const material = makeFresnelMaterial();
  const knot = new THREE.Mesh(geometry, material);

  /* frame the knot regardless of authored scale */
  geometry.computeBoundingSphere();
  const radius = geometry.boundingSphere!.radius;
  const fitDist = radius / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
  camera.position.set(0, 0, fitDist * 1.45);
  camera.lookAt(0, 0, 0);

  const pivot = new THREE.Group();
  pivot.add(knot);
  scene.add(pivot);

  let width = 0;
  let height = 0;
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === width && h === height) return;
    width = w;
    height = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let scrollProgress = 0;
  let reducedMotion = options.reducedMotion;
  let running = false;
  let visible = true;
  const clock = new THREE.Clock();

  const renderFrame = () => {
    const t = clock.getElapsedTime();
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    pivot.rotation.y = t * 0.3 + scrollProgress * Math.PI * 2 + pointer.x * 0.25;
    /* Base X = 0: sem inclinação fixa — o nó fica reto e centrado; restam
       apenas a oscilação ambiente sutil e a paralaxe do ponteiro. */
    pivot.rotation.x = Math.sin(t * 0.2) * 0.05 + pointer.y * 0.18;
    pivot.rotation.z = 0;
    renderer.render(scene, camera);
  };

  const loop = () => {
    if (visible && !reducedMotion) renderFrame();
  };

  const start = () => {
    if (running || reducedMotion) return;
    running = true;
    renderer.setAnimationLoop(loop);
  };
  const stop = () => {
    running = false;
    renderer.setAnimationLoop(null);
  };

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  visibilityObserver.observe(canvas);

  if (reducedMotion) {
    resize();
    renderer.render(scene, camera);
  } else {
    start();
  }

  return Promise.resolve({
    setPointer(nx, ny) {
      pointer.tx = THREE.MathUtils.clamp(nx, -1, 1);
      pointer.ty = THREE.MathUtils.clamp(ny, -1, 1);
    },
    setScroll(progress) {
      scrollProgress = THREE.MathUtils.clamp(progress, 0, 1);
      if (reducedMotion) return;
      if (!running) renderFrame();
    },
    setReducedMotion(value) {
      reducedMotion = value;
      if (value) {
        stop();
        renderer.render(scene, camera);
      } else {
        start();
      }
    },
    dispose() {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  });
}
