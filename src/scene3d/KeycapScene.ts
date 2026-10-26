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

/* Palette: graphite body, brand-blue fresnel, cyan transition, cool rim.
   Mirrored by scripts/generate-keycap-poster.mjs so the fallback poster
   shows the exact same shape and colors. */
export const KEYCAP_COLORS = {
  deep: "#17171f",
  blue: "#3d8bff",
  cyan: "#38e1ff",
  rim: "#8fbdff",
} as const;

/** Real keycap profile (Cherry/OEM-like): wide base, bottom chamfer,
    trapezoidal body, chamfered top lip. x = radius, y = height. */
const KEYCAP_PROFILE: Array<[number, number]> = [
  [0, 0],
  [1.62, 0],
  [1.58, 0.1],
  [1.18, 0.82],
  [1.02, 0.95],
  [1.0, 1.0],
  [0, 1.0],
];

/** Top face sits at y=1 with radius 1 → usable half-side is 1/√2 ≈ 0.7. */
const GLYPH_RAISE = 0.09;

/**
 * Keycap body: the profile lathed with only 4 segments around Y — the
 * cross-section is a square, so the result is a crisp low-poly keycap.
 * phiStart = π/4 puts flat faces (not edges) toward the camera.
 */
function makeKeycapBodyGeometry(): THREE.BufferGeometry {
  const points = KEYCAP_PROFILE.map(([x, y]) => new THREE.Vector2(x, y));
  const geometry = new THREE.LatheGeometry(points, 4, Math.PI / 4);
  const flat = geometry.toNonIndexed();
  geometry.dispose();
  flat.computeVertexNormals();
  return flat;
}

/**
 * Raised `>_` prompt glyph built from thin boxes lying on the top face.
 * Boxes read from afar — a stroked font decal would blur at hero scale.
 */
function makeGlyphGeometry(): THREE.BufferGeometry {
  const bars: Array<{ cx: number; cz: number; length: number; angle: number }> = [
    /* ">" — two bars meeting at the right point */
    { cx: -0.38, cz: -0.17, length: 0.5, angle: -Math.PI / 5 },
    { cx: -0.38, cz: 0.17, length: 0.5, angle: Math.PI / 5 },
    /* "_" — underscore bar */
    { cx: 0.35, cz: 0.22, length: 0.48, angle: 0 },
  ];
  const geometries = bars.map(({ cx, cz, length, angle }) => {
    const bar = new THREE.BoxGeometry(length, GLYPH_RAISE, 0.15);
    bar.rotateY(angle);
    bar.translate(cx, 1 + GLYPH_RAISE / 2 + 0.005, cz);
    return bar;
  });
  const merged = mergeGeometries(geometries);
  geometries.forEach((g) => g.dispose());
  return merged;
}

/** Minimal position/normal merge (all glyph boxes share both attributes). */
function mergeGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  for (const geometry of geometries) {
    const flat = geometry.index ? geometry.toNonIndexed() : geometry;
    positions.push(...(flat.getAttribute("position").array as Float32Array));
    normals.push(...(flat.getAttribute("normal").array as Float32Array));
  }
  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  merged.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  return merged;
}

/**
 * Graphite fresnel material: dark body kept off pure black by an ambient
 * floor, brand blue at glancing angles, cyan transition, cool rim.
 * uLift lightens a mesh (used for the raised glyph) without new shaders.
 */
function makeGraphiteMaterial(lift: THREE.Color = new THREE.Color(0, 0, 0)): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uDeep: { value: new THREE.Color(KEYCAP_COLORS.deep) },
      uBlue: { value: new THREE.Color(KEYCAP_COLORS.blue) },
      uCyan: { value: new THREE.Color(KEYCAP_COLORS.cyan) },
      uRim: { value: new THREE.Color(KEYCAP_COLORS.rim) },
      uLift: { value: lift },
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
      uniform vec3 uBlue;
      uniform vec3 uCyan;
      uniform vec3 uRim;
      uniform vec3 uLift;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        float facing = abs(dot(normalize(vNormal), normalize(vViewDir)));
        float fresnel = pow(1.0 - facing, 2.0);
        vec3 color = mix(uDeep, uBlue, smoothstep(0.15, 0.95, fresnel) * 0.85);
        color = mix(color, uCyan, smoothstep(0.55, 1.0, fresnel) * 0.35);
        float rim = smoothstep(0.82, 1.0, fresnel);
        color = mix(color, uRim, rim * 0.4);
        /* subtle top light so faces read even head-on */
        float top = clamp(normalize(vNormal).y * 0.5 + 0.5, 0.0, 1.0);
        color *= 0.75 + 0.45 * top;
        /* ambient floor: no face ever renders pure black */
        color = max(color, vec3(0.055, 0.055, 0.075));
        color += uLift;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

/**
 * Mounts the keycap scene on a canvas. Fully procedural — it always
 * resolves to a live handle; the caller only falls back to the static
 * poster when WebGL itself is unavailable.
 */
export async function mountKeycapScene(
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

  const bodyMaterial = makeGraphiteMaterial();
  const glyphMaterial = makeGraphiteMaterial(new THREE.Color("#5f83c4"));
  const body = new THREE.Mesh(makeKeycapBodyGeometry(), bodyMaterial);
  const glyph = new THREE.Mesh(makeGlyphGeometry(), glyphMaterial);

  const model = new THREE.Group();
  model.add(body, glyph);

  /* Center and frame the sculpture regardless of the viewport. */
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const fitDist = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
  model.position.sub(center);
  const modelBaseY = model.position.y;
  /* Slightly elevated camera: seen a touch from above, the trapezoidal
     profile and the raised glyph read unmistakably as a keycap. */
  camera.position.set(0, size.y * 1.05, fitDist * 1.35);
  camera.lookAt(0, 0, 0);

  const pivot = new THREE.Group();
  pivot.add(model);
  scene.add(pivot);

  /* Press interaction: pointer down squashes the cap like a real key and
     charges the glyph glow; a spring eases both back on release. */
  const glyphBaseLift = (glyphMaterial.uniforms.uLift as { value: THREE.Color }).value.clone();
  const glyphHotLift = new THREE.Color("#bfe4ff");
  let pressed = false;
  let press = 0;
  let pressVelocity = 0;
  const onPressStart = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pressed = true;
  };
  const onPressEnd = () => {
    pressed = false;
  };
  canvas.addEventListener("pointerdown", onPressStart);
  window.addEventListener("pointerup", onPressEnd);
  window.addEventListener("pointercancel", onPressEnd);

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

  /* Real-keycap tilt (~12°) plus ambient turntable and pointer parallax. */
  const baseTilt = 0.21;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let reducedMotion = options.reducedMotion;
  let running = false;
  let visible = true;
  const clock = new THREE.Clock();

  const renderFrame = () => {
    const t = clock.getElapsedTime();
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    pressVelocity += ((pressed ? 1 : 0) - press) * 0.22;
    pressVelocity *= 0.68;
    press += pressVelocity;
    pivot.rotation.y = t * 0.35 + pointer.x * 0.35;
    pivot.rotation.x = baseTilt + Math.sin(t * 0.25) * 0.06 + pointer.y * 0.15;
    /* key travel: cap dips and squashes sideways as it bottoms out */
    model.position.y = modelBaseY - 0.14 * press;
    model.scale.set(1 + 0.05 * press, 1 - 0.16 * press, 1 + 0.05 * press);
    (glyphMaterial.uniforms.uLift as { value: THREE.Color }).value
      .copy(glyphBaseLift)
      .lerp(glyphHotLift, THREE.MathUtils.clamp(press, 0, 1));
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
    pivot.rotation.x = baseTilt;
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
        pivot.rotation.x = baseTilt;
        renderer.render(scene, camera);
      } else {
        start();
      }
    },
    dispose() {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPressStart);
      window.removeEventListener("pointerup", onPressEnd);
      window.removeEventListener("pointercancel", onPressEnd);
      body.geometry.dispose();
      glyph.geometry.dispose();
      bodyMaterial.dispose();
      glyphMaterial.dispose();
      renderer.dispose();
    },
  };
}
