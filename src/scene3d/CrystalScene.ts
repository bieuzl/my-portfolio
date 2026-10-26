import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export interface SceneOptions {
  /** When true, renders one static frame and never starts the loop. */
  reducedMotion: boolean;
}

export interface SceneHandle {
  /** Normalized pointer (-1..1 on both axes) driving subtle parallax. */
  setPointer(nx: number, ny: number): void;
  setReducedMotion(value: boolean): void;
  dispose(): void;
}

/**
 * Crystal blades: flattened torus arcs with a 5-sided tube — the low radial
 * count turns the sweep into a faceted prism, so every face catches the
 * environment like a cut gem. Mirrored by scripts/generate-crystal-poster.mjs.
 */
interface BladeSpec {
  radius: number;
  tube: number;
  arc: number;
  /** true mirrors the blade (arc bulges left, like a "(" facing a ")"). */
  mirror?: boolean;
  scale: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
}

const BLADES: BladeSpec[] = [
  /* main fin, bulging right, standing tall on the left */
  {
    radius: 1.05,
    tube: 0.4,
    arc: 2.0,
    scale: [1, 1.5, 0.5],
    position: [-0.36, 0.05, 0],
    rotation: [0.1, 0.35, -0.08],
  },
  /* mirrored partner, smaller and lower — asymmetry keeps it sculptural */
  {
    radius: 0.85,
    tube: 0.34,
    arc: 1.7,
    mirror: true,
    scale: [1, 1.3, 0.5],
    position: [0.44, -0.16, 0.08],
    rotation: [-0.08, -0.35, 0.1],
  },
  /* small shard floating between the two, slightly toward the camera */
  {
    radius: 0.5,
    tube: 0.2,
    arc: 1.5,
    scale: [1, 1.25, 0.5],
    position: [0.04, 0.3, 0.45],
    rotation: [0.35, 0.15, -0.3],
  },
];

function makeBladeGeometry(spec: BladeSpec): THREE.BufferGeometry {
  const geometry = new THREE.TorusGeometry(spec.radius, spec.tube, 5, 26, spec.arc);
  /* center the arc on its bulge axis so the blade stands upright */
  geometry.rotateZ((spec.mirror ? Math.PI : 0) - spec.arc / 2);
  geometry.scale(...spec.scale);
  geometry.rotateX(spec.rotation[0]);
  geometry.rotateY(spec.rotation[1]);
  geometry.rotateZ(spec.rotation[2]);
  geometry.translate(...spec.position);
  return geometry;
}

/**
 * Crystal material: fully transmissive physical glass with iridescence and
 * chromatic dispersion — the blue/cyan flare along the facets comes from
 * the studio environment refracting through the blades, not from paint.
 */
function makeCrystalMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.1,
    transmission: 1,
    thickness: 1.6,
    ior: 1.52,
    attenuationColor: new THREE.Color("#2f6fd0"),
    attenuationDistance: 1.1,
    iridescence: 1,
    iridescenceIOR: 1.9,
    iridescenceThicknessRange: [120, 900],
    dispersion: 6,
    clearcoat: 0.35,
    clearcoatRoughness: 0.18,
    envMapIntensity: 0.8,
    specularIntensity: 0.9,
    flatShading: true,
  });
}

/**
 * Mounts the crystal sculpture on a canvas: two mirrored glass blades and a
 * shard, lit by a procedural studio environment (no HDR asset needed). Slow
 * continuous spin, pointer parallax, and a poke that kicks the spin. Fully
 * procedural — the caller falls back to the static poster only when WebGL
 * itself is unavailable.
 */
export async function mountCrystalScene(
  canvas: HTMLCanvasElement,
  options: SceneOptions,
): Promise<SceneHandle | null> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();

  /* Procedural studio HDRI: RoomEnvironment through PMREM gives the glass
     real reflections and refraction sources without shipping an asset. */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.06).texture;
  scene.environment = envTexture;
  /* dim the studio so the glass reads deep blue, not blown-out white */
  scene.environmentIntensity = 0.45;

  /* crisp key light + cyan kicker for the brand-colored edge sparkle */
  const keyLight = new THREE.DirectionalLight(0xdfeaff, 2.2);
  keyLight.position.set(2.5, 3, 4);
  const kicker = new THREE.PointLight(0x38e1ff, 6, 20);
  kicker.position.set(-3, -1.5, 2.5);
  scene.add(keyLight, kicker);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  const material = makeCrystalMaterial();
  const model = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  for (const spec of BLADES) {
    const geometry = makeBladeGeometry(spec);
    geometries.push(geometry);
    model.add(new THREE.Mesh(geometry, material));
  }

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
  camera.position.set(0, size.y * 0.3, fitDist * 1.12);
  camera.lookAt(0, 0, 0);

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

  /* Poke: clicking the crystal kicks the spin, like flicking a desk toy. */
  let spin = 0;
  let spinKick = 0;
  const onPoke = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    spinKick += 2.4;
  };
  canvas.addEventListener("pointerdown", onPoke);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let reducedMotion = options.reducedMotion;
  let running = false;
  let visible = true;
  const clock = new THREE.Clock();

  const renderFrame = () => {
    const t = clock.getElapsedTime();
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    spinKick *= 0.94;
    spin += 0.0035 + spinKick * 0.02;
    pivot.rotation.y = spin + pointer.x * 0.35;
    pivot.rotation.x = Math.sin(t * 0.22) * 0.08 + pointer.y * 0.14;
    pivot.rotation.z = Math.sin(t * 0.16) * 0.05;
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
      canvas.removeEventListener("pointerdown", onPoke);
      for (const geometry of geometries) geometry.dispose();
      material.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
