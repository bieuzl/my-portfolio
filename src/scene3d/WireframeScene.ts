import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export interface WireframeSceneOptions {
  /** When true, renders one static frame and never starts the loop. */
  reducedMotion: boolean;
}

export interface WireframeSceneHandle {
  /** Normalized pointer (-1..1 on both axes) driving subtle parallax. */
  setPointer(nx: number, ny: number): void;
  setReducedMotion(value: boolean): void;
  dispose(): void;
}

/**
 * Wireframe sculpture: an irregular polyhedron drawn as fine luminous edges
 * with glowing vertices — a "mathematical crystal" instead of solid glass.
 *
 * Geometry: a subdivided icosahedron whose merged vertices are displaced by
 * a seeded pseudo-random field, so the silhouette is asymmetric but stable
 * between loads (and reproducible by scripts/generate-wireframe-poster.mjs,
 * which mirrors SEED/RADIAL_JITTER/TANGENTIAL_JITTER below).
 *
 * Depth cueing comes from scene fog tinted like the site background
 * (hsl(240 20% 5%) ≈ #0a0a14): edges farther from the camera melt into the
 * backdrop while near edges stay bright — no post-processing needed.
 */

const SEED = 7;
const RADIUS = 1.2;
const RADIAL_JITTER = 0.6;
const TANGENTIAL_JITTER = 0.12;

const EDGE_BLUE = new THREE.Color("#168bff");
const EDGE_CYAN = new THREE.Color("#35c8ff");
const EDGE_ICE = new THREE.Color("#8cebff");
const VERTEX_GLOW = "#8cebff";
const FOG_COLOR = 0x0a0a14;

/** Deterministic PRNG so the sculpture looks identical on every load. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Outer shell: icosahedron (detail 1 → 42 vertices, 80 triangular faces)
 * with merged vertices displaced radially + tangentially. Merging first is
 * what keeps the shell closed — PolyhedronGeometry ships duplicated corner
 * vertices that would otherwise split apart under displacement.
 */
function buildShellGeometry(): THREE.BufferGeometry {
  const geometry = mergeVertices(new THREE.IcosahedronGeometry(RADIUS, 1));
  const rand = mulberry32(SEED);
  const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < positions.count; i++) {
    v.fromBufferAttribute(positions, i);
    v.multiplyScalar(1 + (rand() - 0.5) * RADIAL_JITTER);
    v.x += (rand() - 0.5) * TANGENTIAL_JITTER;
    v.y += (rand() - 0.5) * TANGENTIAL_JITTER;
    v.z += (rand() - 0.5) * TANGENTIAL_JITTER;
    positions.setXYZ(i, v.x, v.y, v.z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

/** Inner core: a smaller, rougher polyhedron for layered depth. */
function buildCoreGeometry(): THREE.BufferGeometry {
  const geometry = mergeVertices(new THREE.IcosahedronGeometry(RADIUS * 0.45, 0));
  const rand = mulberry32(SEED + 14);
  const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < positions.count; i++) {
    v.fromBufferAttribute(positions, i);
    v.multiplyScalar(1 + (rand() - 0.5) * 0.7);
    positions.setXYZ(i, v.x, v.y, v.z);
  }
  return geometry;
}

/**
 * Edge lines with per-edge colors: mostly electric blue, a ciano minority,
 * a few ice-bright accents — the same palette as the poster generator.
 */
function buildEdges(
  geometry: THREE.BufferGeometry,
  seed: number,
): { edges: THREE.EdgesGeometry; colors: Float32Array } {
  const edges = new THREE.EdgesGeometry(geometry, 1);
  const rand = mulberry32(seed);
  const count = (edges.getAttribute("position") as THREE.BufferAttribute).count;
  const colors = new Float32Array(count * 3);
  for (let edge = 0; edge < count / 2; edge++) {
    const roll = rand();
    const color = roll < 0.62 ? EDGE_BLUE : roll < 0.9 ? EDGE_CYAN : EDGE_ICE;
    for (const endpoint of [0, 1]) {
      colors.set([color.r, color.g, color.b], (edge * 2 + endpoint) * 3);
    }
  }
  return { edges, colors };
}

function makeEdgeLines(
  geometry: THREE.BufferGeometry,
  seed: number,
  opacity: number,
): { lines: THREE.LineSegments; disposables: THREE.BufferGeometry[] } {
  const { edges, colors } = buildEdges(geometry, seed);
  edges.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity,
    fog: true,
  });
  const lines = new THREE.LineSegments(edges, material);
  return { lines, disposables: [edges] };
}

/** Luminous vertices: additive points, brightest at the shell corners. */
function makeVertexPoints(geometry: THREE.BufferGeometry): THREE.Points {
  const material = new THREE.PointsMaterial({
    color: VERTEX_GLOW,
    size: 0.055,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: true,
  });
  return new THREE.Points(geometry, material);
}

/**
 * Mounts the wireframe sculpture on a canvas: an irregular polyhedron of
 * fine blue edges and glowing vertices over a transparent background, with
 * slow continuous spin, gentle bobbing and pointer parallax. Poking the
 * sculpture kicks its spin, like flicking a desk toy. Without WebGL the
 * caller keeps the static poster (public/models/wireframe-poster.svg).
 */
export async function mountWireframeScene(
  canvas: HTMLCanvasElement,
  options: WireframeSceneOptions,
): Promise<WireframeSceneHandle | null> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  const shellGeometry = buildShellGeometry();
  const coreGeometry = buildCoreGeometry();

  const model = new THREE.Group();
  const shell = makeEdgeLines(shellGeometry, SEED + 1, 0.8);
  const core = makeEdgeLines(coreGeometry, SEED + 2, 0.42);
  const vertices = makeVertexPoints(shellGeometry);
  core.lines.rotation.set(0.5, 0.9, 0.2);
  model.add(shell.lines, core.lines, vertices);

  const pivot = new THREE.Group();
  pivot.add(model);
  scene.add(pivot);

  /* Center and frame the sculpture regardless of the viewport. */
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fitDist = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
  model.position.sub(center);
  const modelBaseY = model.position.y;
  const camDist = fitDist * 1.15;
  camera.position.set(0, size.y * 0.15, camDist);
  camera.lookAt(0, 0, 0);

  /* Distant edges dissolve into the site background color. */
  scene.fog = new THREE.Fog(FOG_COLOR, camDist - maxDim * 0.4, camDist + maxDim * 1.1);

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

  /* Free 360° drag rotation in any direction + momentum inertia. */
  const WORLD_Y = new THREE.Vector3(0, 1, 0);
  const WORLD_X = new THREE.Vector3(1, 0, 0);
  let isDragging = false;
  let activePointerId: number | null = null;
  let lastX = 0;
  let lastY = 0;
  let dragDistance = 0;
  let velYaw = 0;
  let velPitch = 0;

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    isDragging = true;
    activePointerId = e.pointerId;
    lastX = e.clientX;
    lastY = e.clientY;
    dragDistance = 0;
    velYaw = 0;
    velPitch = 0;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // ignore if unsupported in test environment
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging || e.pointerId !== activePointerId) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    dragDistance += Math.hypot(dx, dy);

    const yawDelta = dx * 0.009;
    const pitchDelta = dy * 0.009;
    model.rotateOnWorldAxis(WORLD_Y, yawDelta);
    model.rotateOnWorldAxis(WORLD_X, pitchDelta);
    core.lines.rotation.y -= yawDelta * 0.6;
    core.lines.rotation.x -= pitchDelta * 0.6;

    velYaw = yawDelta;
    velPitch = pitchDelta;

    if (reducedMotion) {
      renderer.render(scene, camera);
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isDragging || e.pointerId !== activePointerId) return;
    isDragging = false;
    activePointerId = null;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    if (dragDistance < 4) {
      // Simple click/tap without dragging gives a playful spin impulse
      velYaw += 0.06;
    }
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let reducedMotion = options.reducedMotion;
  let running = false;
  let visible = true;
  const clock = new THREE.Clock();

  const renderFrame = () => {
    const t = clock.getElapsedTime();
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    if (!isDragging) {
      velYaw *= 0.95;
      velPitch *= 0.95;
      const yawStep = 0.0035 + velYaw;
      const pitchStep = velPitch;
      model.rotateOnWorldAxis(WORLD_Y, yawStep);
      if (Math.abs(pitchStep) > 0.00001) {
        model.rotateOnWorldAxis(WORLD_X, pitchStep);
      }
      core.lines.rotation.y -= yawStep * 0.6;
      core.lines.rotation.x -= pitchStep * 0.6;
    }

    pivot.rotation.y = pointer.x * 0.35;
    pivot.rotation.x = Math.sin(t * 0.22) * 0.08 + pointer.y * 0.25;
    pivot.rotation.z = Math.sin(t * 0.16) * 0.04;
    model.position.y = modelBaseY + Math.sin(t * 0.7) * 0.05;
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
    pivot.rotation.y = 0.6;
    renderer.render(scene, camera);
  } else {
    start();
  }

  return {
    setPointer(nx, ny) {
      pointer.tx = THREE.MathUtils.clamp(nx, -1, 1);
      pointer.ty = THREE.MathUtils.clamp(ny, -1, 1);
    },
    setReducedMotion(value) {
      reducedMotion = value;
      if (value) {
        stop();
        pivot.rotation.y = 0.6;
        renderer.render(scene, camera);
      } else {
        start();
      }
    },
    dispose() {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      for (const geometry of [...shell.disposables, ...core.disposables]) {
        geometry.dispose();
      }
      shellGeometry.dispose();
      coreGeometry.dispose();
      (shell.lines.material as THREE.Material).dispose();
      (core.lines.material as THREE.Material).dispose();
      (vertices.material as THREE.Material).dispose();
      renderer.dispose();
    },
  };
}
