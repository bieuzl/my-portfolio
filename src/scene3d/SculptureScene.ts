import * as THREE from "three";

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

interface ExplodingModule {
  group: THREE.Group;
  direction: THREE.Vector3;
  baseDistance: number;
  explodeDistance: number;
  phaseOffset: number;
}

/**
 * Modular exploded-view 3D engineering structure for the Projects section.
 *
 * Visual concept: a precision-machined architectural system composed of a
 * central kernel, orthogonal datum axes, concentric technical frames and six
 * modular plates/blocks that rhythmically separate along their structural
 * axes (exploded view) and reassemble — evoking software architecture,
 * modularity and systems engineering.
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
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 7.2);
  camera.lookAt(0, 0, 0);

  /* Studio lighting for crisp facet shading and rim highlights */
  const keyLight = new THREE.DirectionalLight(0x8cebff, 2.4);
  keyLight.position.set(4, 5, 6);
  const rimLight = new THREE.DirectionalLight(0x2563eb, 1.8);
  rimLight.position.set(-5, -4, -3);
  const fillLight = new THREE.AmbientLight(0x1e293b, 1.1);
  scene.add(keyLight, rimLight, fillLight);

  const disposables: Array<{ dispose(): void }> = [];

  const solidMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#111c33"),
    emissive: new THREE.Color("#070d19"),
    metalness: 0.85,
    roughness: 0.24,
    flatShading: true,
    transparent: true,
    opacity: 0.78,
  });
  const coreMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#1d4ed8"),
    emissive: new THREE.Color("#0f296b"),
    metalness: 0.75,
    roughness: 0.2,
    flatShading: true,
  });
  const edgePrimaryMat = new THREE.LineBasicMaterial({
    color: new THREE.Color("#5aa2ff"),
    transparent: true,
    opacity: 0.88,
  });
  const edgeCyanMat = new THREE.LineBasicMaterial({
    color: new THREE.Color("#38e1ff"),
    transparent: true,
    opacity: 0.75,
  });
  const axisLineMat = new THREE.LineBasicMaterial({
    color: new THREE.Color("#38bdf8"),
    transparent: true,
    opacity: 0.35,
  });
  disposables.push(solidMat, coreMat, edgePrimaryMat, edgeCyanMat, axisLineMat);

  const root = new THREE.Group();
  /* Isometric engineering tilt */
  root.rotation.set(0.48, -0.62, 0.12);
  scene.add(root);

  /* 1. Central Kernel (Octahedral core + wireframe cage) */
  const kernelGeo = new THREE.OctahedronGeometry(0.42, 0);
  const kernelEdges = new THREE.EdgesGeometry(kernelGeo);
  disposables.push(kernelGeo, kernelEdges);
  const kernelMesh = new THREE.Mesh(kernelGeo, coreMat);
  const kernelWire = new THREE.LineSegments(kernelEdges, edgeCyanMat);
  const kernelGroup = new THREE.Group();
  kernelGroup.add(kernelMesh, kernelWire);
  root.add(kernelGroup);

  /* 2. Orthogonal Datum Reference Axes (X, Y, Z guide rails) */
  const axisSpan = 1.65;
  const axisPositions = new Float32Array([
    -axisSpan, 0, 0, axisSpan, 0, 0,
    0, -axisSpan, 0, 0, axisSpan, 0,
    0, 0, -axisSpan, 0, 0, axisSpan,
  ]);
  const axisGeo = new THREE.BufferGeometry();
  axisGeo.setAttribute("position", new THREE.BufferAttribute(axisPositions, 3));
  disposables.push(axisGeo);
  const axisLines = new THREE.LineSegments(axisGeo, axisLineMat);
  root.add(axisLines);

  /* Reference datum points at the ends of each axis */
  const datumPointsGeo = new THREE.BufferGeometry();
  datumPointsGeo.setAttribute("position", new THREE.BufferAttribute(axisPositions, 3));
  const datumPointsMat = new THREE.PointsMaterial({
    color: 0x8cebff,
    size: 0.06,
    transparent: true,
    opacity: 0.85,
  });
  disposables.push(datumPointsGeo, datumPointsMat);
  root.add(new THREE.Points(datumPointsGeo, datumPointsMat));

  /* 3. Six Modular Architectural Plates/Blocks along ±X, ±Y, ±Z */
  const modules: ExplodingModule[] = [];
  const directions: Array<{ dir: [number, number, number]; size: [number, number, number]; phase: number }> = [
    { dir: [1, 0, 0], size: [0.22, 0.72, 0.72], phase: 0 },
    { dir: [-1, 0, 0], size: [0.22, 0.72, 0.72], phase: 0.15 },
    { dir: [0, 1, 0], size: [0.72, 0.22, 0.72], phase: 0.35 },
    { dir: [0, -1, 0], size: [0.72, 0.22, 0.72], phase: 0.5 },
    { dir: [0, 0, 1], size: [0.64, 0.64, 0.22], phase: 0.7 },
    { dir: [0, 0, -1], size: [0.64, 0.64, 0.22], phase: 0.85 },
  ];

  for (const spec of directions) {
    const boxGeo = new THREE.BoxGeometry(spec.size[0], spec.size[1], spec.size[2]);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    disposables.push(boxGeo, boxEdges);

    const mesh = new THREE.Mesh(boxGeo, solidMat);
    const wire = new THREE.LineSegments(boxEdges, edgePrimaryMat);

    const modGroup = new THREE.Group();
    modGroup.add(mesh, wire);
    root.add(modGroup);

    modules.push({
      group: modGroup,
      direction: new THREE.Vector3(...spec.dir),
      baseDistance: 0.52,
      explodeDistance: 0.62,
      phaseOffset: spec.phase,
    });
  }

  /* 4. Two Concentric Technical Structural Frames */
  const ring1Geo = new THREE.RingGeometry(1.18, 1.24, 6);
  const ring1Edges = new THREE.EdgesGeometry(ring1Geo);
  const ring2Geo = new THREE.RingGeometry(1.36, 1.4, 8);
  const ring2Edges = new THREE.EdgesGeometry(ring2Geo);
  disposables.push(ring1Geo, ring1Edges, ring2Geo, ring2Edges);

  const frame1 = new THREE.LineSegments(ring1Edges, edgeCyanMat);
  frame1.rotation.x = Math.PI / 2;
  const frame2 = new THREE.LineSegments(ring2Edges, axisLineMat);
  frame2.rotation.y = Math.PI / 4;
  root.add(frame1, frame2);

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

  const applyModulePositions = (t: number, staticFactor?: number) => {
    for (const mod of modules) {
      const wave =
        staticFactor !== undefined
          ? staticFactor
          : 0.5 + 0.5 * Math.sin(t * 1.15 - mod.phaseOffset * 1.4 + scrollProgress * Math.PI);
      /* Smoothstep easing for intentional engineering assembly/disassembly */
      const smooth = wave * wave * (3 - 2 * wave);
      const dist = mod.baseDistance + smooth * mod.explodeDistance;
      mod.group.position.copy(mod.direction).multiplyScalar(dist);
    }
  };

  const renderFrame = () => {
    const t = clock.getElapsedTime();
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    applyModulePositions(t);

    kernelGroup.rotation.y = -t * 0.45;
    kernelGroup.rotation.x = t * 0.3;
    frame1.rotation.z = t * 0.22;
    frame2.rotation.z = -t * 0.18;

    root.rotation.y = -0.62 + t * 0.22 + scrollProgress * 1.4 + pointer.x * 0.25;
    root.rotation.x = 0.48 + Math.sin(t * 0.25) * 0.06 + pointer.y * 0.18;

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
    applyModulePositions(0, 0.55);
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
        applyModulePositions(0, 0.55);
        renderer.render(scene, camera);
      } else {
        start();
      }
    },
    dispose() {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      for (const item of disposables) {
        item.dispose();
      }
      renderer.dispose();
    },
  });
}
