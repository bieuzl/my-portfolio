import * as THREE from "three";

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
 * Studio-object keycap: rounded-square top, trapezoidal body wider at the
 * base (real keycap profile), flat facets for the low-poly read.
 * Fully procedural — zero binary assets, deterministic across loads.
 */
function buildKeycapGeometry(): THREE.BufferGeometry {
  const size = 1;
  const radius = 0.16;
  const shape = new THREE.Shape();
  const h = size / 2;
  shape.moveTo(-h + radius, -h);
  shape.lineTo(h - radius, -h);
  shape.absarc(h - radius, -h + radius, radius, -Math.PI / 2, 0);
  shape.lineTo(h, h - radius);
  shape.absarc(h - radius, h - radius, radius, 0, Math.PI / 2);
  shape.lineTo(-h + radius, h);
  shape.absarc(-h + radius, h - radius, radius, Math.PI / 2, Math.PI);
  shape.lineTo(-h, -h + radius);
  shape.absarc(-h + radius, -h + radius, radius, Math.PI, Math.PI * 1.5);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.58,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelSegments: 1,
    curveSegments: 3,
  });
  geometry.rotateX(-Math.PI / 2); // extrusion axis becomes +y

  /* Trapezoidal taper: base wider than the top, like a sculpted keycap. */
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const span = Math.max(box.max.y - box.min.y, 1e-6);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i++) {
    const y = position.getY(i);
    const t = (y - box.min.y) / span; // 0 at base, 1 at top
    const scale = 1.16 - 0.34 * t;
    position.setX(i, position.getX(i) * scale);
    position.setZ(i, position.getZ(i) * scale);
  }
  position.needsUpdate = true;

  /* flat facets: each plane catches its own hue */
  const flat = geometry.toNonIndexed();
  flat.computeVertexNormals();
  return flat;
}

/** Raised `>_` terminal glyph for the top face. */
function buildGlyph(topY: number): THREE.Group {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: new THREE.Color("#3d8bff") });

  const barGeo = new THREE.BoxGeometry(0.34, 0.055, 0.075);
  const angle = 0.63; // ~36°
  const meet = 0.1; // z-shift so both bar tips meet at one point (the ">")
  const chevronUp = new THREE.Mesh(barGeo, material);
  chevronUp.rotation.y = angle;
  chevronUp.position.z = meet;
  const chevronDown = new THREE.Mesh(barGeo, material);
  chevronDown.rotation.y = -angle;
  chevronDown.position.z = -meet;

  const chevron = new THREE.Group();
  chevron.add(chevronUp, chevronDown);
  chevron.position.x = -0.22;

  const underscore = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.055, 0.075), material);
  underscore.position.x = 0.28;

  group.add(chevron, underscore);
  group.position.y = topY + 0.028;
  return group;
}

/**
 * Graphite body with an electric-blue fresnel rim and a faint cyan
 * transition band. Ambient lift guarantees no face falls to pure black.
 */
function makeKeycapMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uDark: { value: new THREE.Color("#1c1c26") },
      uGraphite: { value: new THREE.Color("#32323e") },
      uCyan: { value: new THREE.Color("#38e1ff") },
      uBlue: { value: new THREE.Color("#3d8bff") },
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
      uniform vec3 uDark;
      uniform vec3 uGraphite;
      uniform vec3 uCyan;
      uniform vec3 uBlue;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vec3 n = normalize(vNormal);
        float facing = abs(dot(n, normalize(vViewDir)));
        float fresnel = pow(1.0 - facing, 2.2);
        /* top faces read lighter, sides darker — but never black */
        float top = clamp(n.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 color = mix(uDark, uGraphite, 0.5 + 0.5 * top);
        color = mix(color, uCyan, smoothstep(0.3, 0.75, fresnel) * 0.35);
        color = mix(color, uBlue, smoothstep(0.5, 1.0, fresnel));
        gl_FragColor = vec4(color, 1.0);
        /* uniforms enter in linear space (THREE.ColorManagement); without
           this chunk the raw linear values hit the canvas and read black */
        #include <colorspace_fragment>
      }
    `,
  });
}

/**
 * Mounts the keycap scene on a canvas. Never fails hard: the caller keeps
 * the static poster behind it, so a missing context just leaves the poster.
 */
export function mountKeycapScene(
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
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  const material = makeKeycapMaterial();
  const body = new THREE.Mesh(buildKeycapGeometry(), material);

  const keycap = new THREE.Group();
  keycap.add(body);
  body.geometry.computeBoundingBox();
  const bodyBox = body.geometry.boundingBox!;
  keycap.add(buildGlyph(bodyBox.max.y));

  /* Center and frame the keycap regardless of authored scale. */
  const box = new THREE.Box3().setFromObject(keycap);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fitDist = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
  keycap.position.sub(center);
  camera.position.set(0, size.y * 0.35, fitDist * 1.7);
  camera.lookAt(0, 0, 0);

  const pivot = new THREE.Group();
  pivot.add(keycap);
  scene.add(pivot);

  /* Centered behind the monumental word, slightly lifted. */
  const layoutPivot = () => {
    pivot.position.x = 0;
    pivot.position.y = size.y * 0.08;
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

  /* Ambient motion: slow turntable with a resting keycap tilt. */
  const baseTilt = 0.24;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let reducedMotion = options.reducedMotion;
  let running = false;
  let visible = true;
  const clock = new THREE.Clock();

  const renderFrame = () => {
    const t = clock.getElapsedTime();
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    pivot.rotation.y = t * 0.35 + pointer.x * 0.3;
    pivot.rotation.x = baseTilt + Math.sin(t * 0.25) * 0.06 + pointer.y * 0.15;
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
      keycap.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).geometry.dispose();
        }
      });
      material.dispose();
      renderer.dispose();
    },
  });
}
