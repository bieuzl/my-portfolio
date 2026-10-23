import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

const MODEL_URL = `${import.meta.env.BASE_URL}models/capybara.glb`;

/**
 * Iridescent fresnel material: deep indigo body shifting to violet and pink
 * at glancing angles, with a thin warm rim. Facet normals come from the
 * low-poly geometry, so the color breakup follows the sculpture's planes.
 */
function makeIridescentMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uDeep: { value: new THREE.Color("#1b1b3a") },
      uViolet: { value: new THREE.Color("#6d5df6") },
      uPink: { value: new THREE.Color("#ff6ea9") },
      uRim: { value: new THREE.Color("#ff3333") },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(mat3(modelMatrix) * normal);
        vViewDir = normalize(cameraPosition - worldPos.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uDeep;
      uniform vec3 uViolet;
      uniform vec3 uPink;
      uniform vec3 uRim;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        float facing = abs(dot(normalize(vNormal), normalize(vViewDir)));
        float fresnel = pow(1.0 - facing, 2.0);
        vec3 color = mix(uDeep, uViolet, smoothstep(0.0, 0.85, fresnel));
        color = mix(color, uPink, smoothstep(0.45, 1.0, fresnel));
        float rim = smoothstep(0.82, 1.0, fresnel);
        color = mix(color, uRim, rim * 0.35);
        /* subtle top light so facets read even head-on */
        float top = clamp(normalize(vNormal).y * 0.5 + 0.5, 0.0, 1.0);
        color *= 0.75 + 0.45 * top;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

/**
 * Mounts the capybara scene on a canvas. Resolves to null when the model
 * cannot be loaded, so the caller can keep showing its static poster.
 */
export async function mountCapybaraScene(
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

  const loader = new GLTFLoader();
  const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) => {
    loader.load(MODEL_URL, resolve, undefined, reject);
  }).catch(() => null);

  if (!gltf) {
    renderer.dispose();
    return null;
  }

  const model = gltf.scene;
  const material = makeIridescentMaterial();
  model.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      /* flat facets: drop smooth normals so each plane catches its own hue */
      mesh.geometry = mesh.geometry.toNonIndexed();
      mesh.geometry.computeVertexNormals();
      mesh.material = material;
    }
  });

  /* Center and frame the model regardless of its authored scale. */
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fitDist = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
  model.position.sub(center);
  camera.position.set(0, size.y * 0.08, fitDist * 1.8);
  camera.lookAt(0, 0, 0);
  scene.add(model);

  const pivot = new THREE.Group();
  scene.remove(model);
  pivot.add(model);
  scene.add(pivot);

  /* Asymmetric hero: on wide screens the sculpture stands right-of-center,
     leaving the left column to the typography; narrow screens keep it
     centered behind the copy. */
  const layoutPivot = () => {
    const aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1);
    pivot.position.x = aspect > 1 ? maxDim * 0.9 : 0;
  };
  layoutPivot();

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
    layoutPivot();
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  /* Dual-axis ambient tumble: steady turntable on Y, slow tilt sway on X. */
  const baseTilt = 0.06;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let reducedMotion = options.reducedMotion;
  let running = false;
  let visible = true;
  const clock = new THREE.Clock();

  const renderFrame = () => {
    const t = clock.getElapsedTime();
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    pivot.rotation.y = t * 0.5 + pointer.x * 0.35;
    pivot.rotation.x = baseTilt + Math.sin(t * 0.25) * 0.1 + pointer.y * 0.2;
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
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).geometry.dispose();
        }
      });
      material.dispose();
      renderer.dispose();
    },
  };
}
