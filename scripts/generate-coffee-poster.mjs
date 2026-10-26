/**
 * Generates public/models/coffee-poster.svg — a static frame of the hero
 * Java cup rendered with the same geometry math and palette as
 * src/scene3d/CoffeeScene.ts (painter's algorithm, no WebGL needed), plus
 * hand-drawn steam strokes where the live scene puts its shader wisps.
 *
 * Run: node scripts/generate-coffee-poster.mjs
 */
import * as THREE from "three";
import { writeFileSync } from "node:fs";

const SIZE = 800;

/* Mirrors src/scene3d/CoffeeScene.ts — keep the two in sync. */
const CUP_PROFILE = [
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
const SAUCER_PROFILE = [
  [0, 0],
  [1.05, 0],
  [1.22, 0.05],
  [1.26, 0.1],
  [1.1, 0.12],
  [0.62, 0.1],
  [0, 0.08],
];
const COFFEE_COLOR = "#101d33";

function makeCupGeometry() {
  const points = CUP_PROFILE.map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(points, 48).toNonIndexed();
}

function makeSaucerGeometry() {
  const points = SAUCER_PROFILE.map(([x, y]) => new THREE.Vector2(x, y));
  return new THREE.LatheGeometry(points, 48).toNonIndexed();
}

function makeHandleGeometry() {
  const geometry = new THREE.TorusGeometry(
    0.34,
    0.075,
    12,
    32,
    THREE.MathUtils.degToRad(280),
  );
  geometry.rotateZ(THREE.MathUtils.degToRad(-140));
  geometry.translate(0.86, 0.62, 0);
  return geometry.toNonIndexed();
}

function makeCoffeeGeometry() {
  const geometry = new THREE.CircleGeometry(0.72, 40);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, 0.92, 0);
  return geometry.toNonIndexed();
}

/* Mirrors the shared fresnel shader (src/scene3d/fresnel.ts). */
const DARK = new THREE.Color("#1c1c26");
const GRAPHITE = new THREE.Color("#32323e");
const CYAN = new THREE.Color("#38e1ff");
const BLUE = new THREE.Color("#3d8bff");

function smoothstep(a, b, x) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

function faceColor(normal, viewDir) {
  const facing = Math.abs(normal.dot(viewDir));
  const fresnel = Math.pow(1 - facing, 2.2);
  const top = Math.min(Math.max(normal.y * 0.5 + 0.5, 0), 1);
  const color = DARK.clone().lerp(GRAPHITE, 0.5 + 0.5 * top);
  color.lerp(CYAN, smoothstep(0.3, 0.75, fresnel) * 0.35);
  color.lerp(BLUE, smoothstep(0.5, 1, fresnel));
  const to255 = (x) => Math.round(Math.min(Math.max(x, 0), 1) * 255);
  return `rgb(${to255(color.r)},${to255(color.g)},${to255(color.b)})`;
}

/* Assemble the model in its poster pose (matches the scene's framing). */
const parts = [
  { geometry: makeCupGeometry(), color: null },
  { geometry: makeSaucerGeometry(), color: null },
  { geometry: makeHandleGeometry(), color: null },
  { geometry: makeCoffeeGeometry(), color: COFFEE_COLOR },
];

const box = new THREE.Box3();
for (const { geometry } of parts) {
  box.union(
    new THREE.Box3().setFromBufferAttribute(geometry.getAttribute("position")),
  );
}
const size = box.getSize(new THREE.Vector3());
const center = box.getCenter(new THREE.Vector3());

const pose = new THREE.Matrix4()
  .makeRotationY(0.4)
  .multiply(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

const maxDim = Math.max(size.x, size.y, size.z);
const fov = THREE.MathUtils.degToRad(32);
const fitDist = maxDim / (2 * Math.tan(fov / 2));
const camPos = new THREE.Vector3(0, size.y * 1.0, fitDist * 1.35);
const lookAt = new THREE.Vector3(0, 0.3, 0);
const forward = lookAt.clone().sub(camPos).normalize();
const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
const up = new THREE.Vector3().crossVectors(right, forward).normalize();
const tanHalf = Math.tan(fov / 2);

const project = (p) => {
  const rel = p.clone().sub(camPos);
  const x = rel.dot(right) / (rel.dot(forward) * tanHalf);
  const y = rel.dot(up) / (rel.dot(forward) * tanHalf);
  return [SIZE / 2 + (x * SIZE) / 2, SIZE / 2 - (y * SIZE) / 2];
};

const faces = [];
for (const { geometry, color } of parts) {
  const positions = geometry.getAttribute("position");
  for (let i = 0; i < positions.count; i += 3) {
    const tri = [0, 1, 2].map((k) =>
      new THREE.Vector3().fromBufferAttribute(positions, i + k).applyMatrix4(pose),
    );
    const [a, b, c] = tri;
    const normal = new THREE.Vector3()
      .crossVectors(b.clone().sub(a), c.clone().sub(a))
      .normalize();
    const centroid = a.clone().add(b).add(c).multiplyScalar(1 / 3);
    const viewDir = camPos.clone().sub(centroid).normalize();
    if (normal.dot(viewDir) <= 0) continue; // back face
    const depth = tri.reduce((sum, p) => sum + p.clone().sub(camPos).dot(forward), 0) / 3;
    faces.push({
      depth,
      color: color ?? faceColor(normal, viewDir),
      points: tri.map(project),
    });
  }
}

faces.sort((f1, f2) => f2.depth - f1.depth); // far first

const polygons = faces
  .map(
    (f) =>
      `  <polygon points="${f.points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}" fill="${f.color}"/>`,
  )
  .join("\n");

/* Steam strokes above the rim, standing in for the live shader wisps. */
const rimTop = project(new THREE.Vector3(0, 1.06 - center.y, 0).applyMatrix4(new THREE.Matrix4()));
const steamPaths = [-58, 0, 58]
  .map((dx, i) => {
    const x = rimTop[0] + dx;
    const y = rimTop[1] - 26;
    const sway = i % 2 === 0 ? 1 : -1;
    return `    <path d="M ${x.toFixed(1)} ${y.toFixed(1)} c ${18 * sway} -34, ${-20 * sway} -52, ${4 * sway} -84 c ${16 * sway} -22, ${-12 * sway} -38, ${2 * sway} -62"/>`;
  })
  .join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="Java-style coffee cup with rising steam">
  <defs>
    <linearGradient id="steamGrad" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#3d8bff" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#38e1ff" stop-opacity="0"/>
    </linearGradient>
  </defs>
${polygons}
  <g fill="none" stroke="url(#steamGrad)" stroke-width="11" stroke-linecap="round">
${steamPaths}
  </g>
</svg>
`;

writeFileSync(new URL("../public/models/coffee-poster.svg", import.meta.url), svg);
console.log(`coffee-poster.svg written (${faces.length} visible faces)`);
