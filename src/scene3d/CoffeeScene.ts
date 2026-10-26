import * as THREE from "three";
import { makeFresnelMaterial } from "./fresnel";

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

/** Coffee surface: deep navy, a touch lighter than the page background. */
const COFFEE_COLOR = "#101d33";

/** Cup silhouette (x = radius, y = height): outer wall up to the rim, then
    the inner wall back down to the coffee well — one continuous lathe. */
const CUP_PROFILE: Array<[number, number]> = [
  [0, 0.06],
  [0.5, 0.06],
  [0.56, 0.1],
  [0.78, 0.55],
  [0.86, 1.0],
  [0.86, 1.06],
  [0.8, 1.06],
  [0.74, 0.62],
  [0.24, 0.3],
  [0, 0.3],
];

/** Saucer: flat disc with a soft upturned lip. */
const SAUCER_PROFILE: Array<[number, number]> = [
  [0, 0],
  [1.05, 0],
  [1.22, 0.05],
  [1.26, 0.1],
  [1.1, 0.12],
  [0.62, 0.1],
  [0, 0.08],
];

const STEAM_WISPS: Array<{ x: number; z: number; phase: number; height: number }> = [
  { x: -0.28, z: 0.05, phase: 0.0, height: 1.5 },
  { x: 0.02, z: -0.06, phase: 2.1, height: 1.8 },
  { x: 0.3, z: 0.08, phase: 4.2, height: 1.4 },
];

/**
 * Steam wisp: a vertical ribbon displaced by a travelling sine (vertex) and
 * cut by rising value noise (fragment). uBoost fattens and brightens the
 * ribbon while a poke charge is draining.
 */
function makeSteamMaterial(phase: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uBoost: { value: 0 },
      uPhase: { value: phase },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uBoost;
      uniform float uPhase;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 p = position;
        /* sway grows with height: the base stays anchored to the cup */
        float sway = sin(uv.y * 4.5 + uTime * 1.6 + uPhase)
                   + 0.5 * sin(uv.y * 9.0 - uTime * 2.3 + uPhase * 1.7);
        p.x += sway * 0.09 * uv.y * (1.0 + uBoost * 0.9);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uBoost;
      uniform float uPhase;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      void main() {
        /* noise scrolls downward in uv space => the steam reads as rising */
        vec2 q = vUv;
        q.y = q.y * 1.6 - uTime * 0.22 + uPhase;
        float n = 0.65 * noise(q * vec2(3.0, 4.0))
                + 0.35 * noise(q * vec2(7.0, 9.0) + uTime * 0.1);
        float ribbon = 1.0 - abs(vUv.x - 0.5) * 2.0;
        float vertical = smoothstep(0.02, 0.22, vUv.y)
                       * (1.0 - smoothstep(0.5, 1.0, vUv.y));
        float alpha = smoothstep(0.3, 0.72, n * ribbon) * vertical;
        alpha *= 0.42 + uBoost * 0.45;
        vec3 color = mix(vec3(0.24, 0.55, 1.0), vec3(0.55, 0.88, 1.0), vUv.y);
        gl_FragColor = vec4(color, alpha);
        #include <colorspace_fragment>
      }
    `,
  });
}

/**
 * Mounts the Java-cup scene on a canvas: a graphite coffee cup on a saucer
 * with animated steam wisps. Poking the cup wobbles it and sends a puff of
 * steam. Fully procedural — always resolves to a live handle; the caller
 * only falls back to the static poster when WebGL itself is unavailable.
 */
export async function mountCoffeeScene(
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

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  const cupMaterial = makeFresnelMaterial();
  const coffeeMaterial = new THREE.MeshBasicMaterial({ color: COFFEE_COLOR });

  const cupPoints = CUP_PROFILE.map(([x, y]) => new THREE.Vector2(x, y));
  const cup = new THREE.Mesh(new THREE.LatheGeometry(cupPoints, 48), cupMaterial);

  const saucerPoints = SAUCER_PROFILE.map(([x, y]) => new THREE.Vector2(x, y));
  const saucer = new THREE.Mesh(new THREE.LatheGeometry(saucerPoints, 48), cupMaterial);

  /* Java-style ear handle: a 280° torus arc whose ends bury themselves in
     the cup wall, bulge pointing outward. */
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.075, 12, 32, THREE.MathUtils.degToRad(280)),
    cupMaterial,
  );
  handle.position.set(0.86, 0.62, 0);
  handle.rotation.z = THREE.MathUtils.degToRad(-140);

  const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.72, 40), coffeeMaterial);
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 0.92;

  const model = new THREE.Group();
  model.add(cup, saucer, handle, coffee);

  /* Steam rises straight up from the cup's center — it lives outside the
     turntable pivot so the cup spinning never drags the wisps sideways. */
  const steam = new THREE.Group();
  const steamMaterials: THREE.ShaderMaterial[] = [];
  const steamMeshes: THREE.Mesh[] = [];
  for (const wisp of STEAM_WISPS) {
    const geometry = new THREE.PlaneGeometry(0.55, wisp.height, 1, 32);
    /* base of the ribbon sits at the group origin */
    geometry.translate(0, wisp.height / 2, 0);
    const material = makeSteamMaterial(wisp.phase);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(wisp.x, 1.06, wisp.z);
    steamMaterials.push(material);
    steamMeshes.push(mesh);
    steam.add(mesh);
  }

  const pivot = new THREE.Group();
  pivot.add(model);
  scene.add(pivot, steam);

  /* Frame cup + saucer + steam with headroom, seen slightly from above so
     the coffee disc and the rim ellipse read as a cup, not a cylinder. */
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fitDist = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
  model.position.sub(center);
  steam.position.y = -center.y;
  const modelBaseY = model.position.y;
  camera.position.set(0, size.y * 1.0, fitDist * 1.35);
  camera.lookAt(0, 0.3, 0);

  /* Yaw-billboard each wisp toward the fixed camera once. */
  for (const mesh of steamMeshes) {
    mesh.rotation.y = Math.atan2(
      camera.position.x - mesh.position.x,
      camera.position.z - mesh.position.z,
    );
  }

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

  /* Poke interaction: pointer down kicks a wobble spring and charges the
     steam; the charge drains back over the next seconds. */
  let poke = 0;
  let pokeVelocity = 0;
  let steamBoost = 0;
  const onPoke = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pokeVelocity += 0.5;
    steamBoost = 1;
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
    pokeVelocity += -poke * 0.1;
    pokeVelocity *= 0.86;
    poke += pokeVelocity;
    steamBoost += (0 - steamBoost) * 0.02;
    pivot.rotation.y = t * 0.28 + pointer.x * 0.3;
    pivot.rotation.z = poke * 0.06;
    pivot.rotation.x = pointer.y * 0.12;
    /* gentle float so the cup feels weightless next to the monument */
    model.position.y = modelBaseY + Math.sin(t * 0.8) * 0.05;
    steam.position.y = -center.y + Math.sin(t * 0.8) * 0.05;
    for (const material of steamMaterials) {
      material.uniforms.uTime.value = t;
      material.uniforms.uBoost.value = steamBoost;
    }
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

  return {
    setPointer(nx, ny) {
      pointer.tx = THREE.MathUtils.clamp(nx, -1, 1);
      pointer.ty = THREE.MathUtils.clamp(ny, -1, 1);
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
      canvas.removeEventListener("pointerdown", onPoke);
      cup.geometry.dispose();
      saucer.geometry.dispose();
      handle.geometry.dispose();
      coffee.geometry.dispose();
      for (const mesh of steamMeshes) mesh.geometry.dispose();
      for (const material of steamMaterials) material.dispose();
      cupMaterial.dispose();
      coffeeMaterial.dispose();
      renderer.dispose();
    },
  };
}
