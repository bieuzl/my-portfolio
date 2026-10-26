import * as THREE from "three";

/**
 * Estúdio procedural escuro com tiras de luz (softboxes): o vidro reflete
 * streaks brancos e azul-gelo bem definidos, em vez do cinza uniforme de um
 * ambiente claro. Zero assets — tudo gerado em runtime.
 */
function createStudioEnvironment(): THREE.Scene {
  const env = new THREE.Scene();
  env.background = new THREE.Color(0x000000);
  const strip = (
    w: number,
    h: number,
    color: number,
    intensity: number,
    position: [number, number, number],
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, 0.1),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensity),
      }),
    );
    mesh.position.set(...position);
    mesh.lookAt(0, 0, 0);
    env.add(mesh);
  };
  strip(2, 10, 0xffffff, 14, [-6, 2, 4]); // softbox vertical esquerda
  strip(1.2, 9, 0x9cc8ff, 9, [6, 0, 3]); // tira azul-gelo direita
  strip(8, 2, 0xffffff, 10, [0, 6, 2]); // luz de topo
  strip(3, 1, 0x66d9ff, 5, [0, -4, -5]); // rim cyan inferior traseira
  strip(1, 6, 0xffffff, 7, [2, 0, -6]); // tira traseira para refração
  strip(5, 7, 0xbcd8ff, 1.6, [0, 0, 8]); // softbox frontal ampla e suave
  return env;
}

export interface CrystalOptions {
  /** When true, renders one static frame and never starts the loop. */
  reducedMotion: boolean;
}

export interface CrystalHandle {
  /** Normalized pointer (-1..1 on both axes) driving subtle parallax. */
  setPointer(nx: number, ny: number): void;
  setReducedMotion(value: boolean): void;
  dispose(): void;
}

/**
 * Metade da escultura (sign = 1 direita, -1 esquerda), 100% paramétrica:
 * um perfil octogonal chanfrado varrido verticalmente. A aresta interna é
 * CÔNCAVA (recua no meio), a externa é CONVEXA, e topo/base têm facetas
 * angulares. As superfícies curvas dão normais contínuas — é o que faz o
 * estúdio aparecer como streaks de vidro, e não como painéis cinza chapados.
 */
function createHalfGeometry(sign: 1 | -1): THREE.BufferGeometry {
  const HEIGHT = 3.6;
  const HALF_DEPTH = 0.34;
  const BEVEL = 0.07;
  const RINGS = 72;

  // perfil transversal (u = posição interna→externa 0..1, z = profundidade)
  const profile: Array<[number, number]> = [
    [BEVEL, -HALF_DEPTH],
    [1 - BEVEL, -HALF_DEPTH],
    [1, -HALF_DEPTH + BEVEL],
    [1, HALF_DEPTH - BEVEL],
    [1 - BEVEL, HALF_DEPTH],
    [BEVEL, HALF_DEPTH],
    [0, HALF_DEPTH - BEVEL],
    [0, -HALF_DEPTH + BEVEL],
  ];
  const P = profile.length;

  const positions: number[] = [];
  const indices: number[] = [];

  for (let ring = 0; ring <= RINGS; ring++) {
    const v = ring / RINGS; // 0 base → 1 topo
    const bow = Math.sin(v * Math.PI); // 0 nas pontas, 1 no meio
    const innerX = 0.3 + 0.55 * bow; // aresta interna côncava
    const outerX = 1.25 + 0.25 * bow; // aresta externa convexa
    const y = (v - 0.5) * HEIGHT;
    for (const [u, z] of profile) {
      const x = innerX + (outerX - innerX) * u;
      // facetas angulares: topo sobe para fora, base desce para fora
      const yFacet = y + (x - 0.9) * 0.22 * (2 * v - 1);
      positions.push(sign * x, yFacet, z);
    }
  }

  for (let ring = 0; ring < RINGS; ring++) {
    for (let j = 0; j < P; j++) {
      const a = ring * P + j;
      const b = ring * P + ((j + 1) % P);
      const c = (ring + 1) * P + j;
      const d = (ring + 1) * P + ((j + 1) % P);
      if (sign === 1) {
        indices.push(a, c, b, b, c, d);
      } else {
        indices.push(a, b, c, b, d, c); // espelhado: winding invertido
      }
    }
  }

  // tampas (fan) na base e no topo
  const capCenter = (ring: number) => {
    const idx = positions.length / 3;
    let x = 0;
    let y = 0;
    let z = 0;
    for (let j = 0; j < P; j++) {
      x += positions[(ring * P + j) * 3];
      y += positions[(ring * P + j) * 3 + 1];
      z += positions[(ring * P + j) * 3 + 2];
    }
    positions.push(x / P, y / P, z / P);
    return idx;
  };
  const bottom = capCenter(0);
  const top = capCenter(RINGS);
  for (let j = 0; j < P; j++) {
    const a = j;
    const b = (j + 1) % P;
    const c = RINGS * P + j;
    const d = RINGS * P + ((j + 1) % P);
    if (sign === 1) {
      indices.push(bottom, b, a, top, c, d);
    } else {
      indices.push(bottom, a, b, top, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Escultura cristalina do hero: duas metades prismáticas espelhadas em vidro
 * óptico (transmission + dispersão azulada), arestas azul-gelo, ambiente de
 * estúdio para reflexos reais. Movimento lento e controlado: oscilação
 * suave em Y que preserva a silhueta frontal, sem tombos nem inclinações.
 */
export function mountCrystalScene(
  canvas: HTMLCanvasElement,
  options: CrystalOptions,
): Promise<CrystalHandle> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  /* Fundo preto explícito (o painel já é preto): sem isso o transmission
     pass do Three compõe sobre branco e o vidro sai cinza leitoso. */
  scene.background = new THREE.Color(0x000000);

  /* Estúdio procedural (sem assets): reflete como tiras claras nas facetas. */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = createStudioEnvironment();
  const envTarget = pmrem.fromScene(envScene, 0.03);
  scene.environment = envTarget.texture;

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.03,
    transmission: 1,
    thickness: 0.9,
    ior: 1.46,
    dispersion: 1.4,
    attenuationColor: new THREE.Color(0x9cc8ff),
    attenuationDistance: 2.8,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.6,
  });
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xbfe2ff,
    transparent: true,
    opacity: 0.28,
  });

  const inner = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  for (const sign of [1, -1] as const) {
    const geometry = createHalfGeometry(sign);
    geometries.push(geometry);
    inner.add(new THREE.Mesh(geometry, glass));
    const edges = new THREE.EdgesGeometry(geometry, 32);
    geometries.push(edges);
    inner.add(new THREE.LineSegments(edges, edgeMaterial));
  }

  /* Centralização pelo centro geométrico real do PAR (não por CSS): o grupo
     interno é deslocado pelo negativo do centro da bounding box, então o
     pivô externo gira exatamente em torno do centro visual da escultura. */
  const bounds = new THREE.Box3().setFromObject(inner);
  const center = bounds.getCenter(new THREE.Vector3());
  inner.position.copy(center.negate());

  const pivot = new THREE.Group();
  pivot.add(inner);
  scene.add(pivot);

  const keyLight = new THREE.DirectionalLight(0xdfefff, 0.8);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x7fb8ff, 0.6);
  rimLight.position.set(-4, -2, -3);
  scene.add(rimLight);


  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const size = bounds.getSize(new THREE.Vector3());
  const radius = Math.max(size.x, size.y, size.z) / 2;
  const fitDist = radius / Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
  camera.position.set(0, 0, fitDist * 1.35);
  camera.lookAt(0, 0, 0);

  let width = 0;
  let height = 0;
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h || (w === width && h === height)) return;
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
  let reducedMotion = options.reducedMotion;
  let running = false;
  let visible = true;
  const clock = new THREE.Clock();

  const renderFrame = () => {
    const t = clock.getElapsedTime();
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    /* Oscilação lenta e simétrica — a peça nunca "tomba" nem fica torta. */
    pivot.rotation.y = Math.sin(t * 0.22) * 0.38 + pointer.x * 0.2;
    pivot.rotation.x = pointer.y * 0.12;
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
      envScene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
      geometries.forEach((g) => g.dispose());
      glass.dispose();
      edgeMaterial.dispose();
      envTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  });
}
