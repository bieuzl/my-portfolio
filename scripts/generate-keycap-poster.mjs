/**
 * Generates public/models/keycap-poster.svg — a static frame of the hero
 * keycap rendered with the same geometry math and palette as
 * src/scene3d/KeycapScene.ts (painter's algorithm, no WebGL needed).
 *
 * Run: node scripts/generate-keycap-poster.mjs
 */
import * as THREE from "three";
import { writeFileSync } from "node:fs";

const SIZE = 800;

/* Mirrors src/scene3d/KeycapScene.ts — keep the two in sync. */
const COLORS = { deep: "#17171f", blue: "#3d8bff", cyan: "#38e1ff", rim: "#8fbdff" };
const GLYPH_LIFT = new THREE.Color("#5f83c4");
const KEYCAP_PROFILE = [
  [0, 0],
  [1.62, 0],
  [1.58, 0.1],
  [1.18, 0.82],
  [1.02, 0.95],
  [1.0, 1.0],
  [0, 1.0],
];
const GLYPH_RAISE = 0.09;

function makeKeycapBodyGeometry() {
  const points = KEYCAP_PROFILE.map(([x, y]) => new THREE.Vector2(x, y));
  const geometry = new THREE.LatheGeometry(points, 4, Math.PI / 4);
  const flat = geometry.toNonIndexed();
  flat.computeVertexNormals();
  return flat;
}

function makeGlyphGeometry() {
  const bars = [
    { cx: -0.38, cz: -0.17, length: 0.5, angle: -Math.PI / 5 },
    { cx: -0.38, cz: 0.17, length: 0.5, angle: Math.PI / 5 },
    { cx: 0.35, cz: 0.22, length: 0.48, angle: 0 },
  ];
  const positions = [];
  for (const { cx, cz, length, angle } of bars) {
    const bar = new THREE.BoxGeometry(length, GLYPH_RAISE, 0.15);
    bar.rotateY(angle);
    bar.translate(cx, 1 + GLYPH_RAISE / 2 + 0.005, cz);
    const flat = bar.toNonIndexed();
    positions.push(...flat.getAttribute("position").array);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

/* Mirrors the graphite fresnel shader. */
const DEEP = new THREE.Color(COLORS.deep);
const BLUE = new THREE.Color(COLORS.blue);
const CYAN = new THREE.Color(COLORS.cyan);
const RIM = new THREE.Color(COLORS.rim);
const AMBIENT_FLOOR = new THREE.Color(0.055, 0.055, 0.075);

function smoothstep(a, b, x) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

function faceColor(normal, viewDir, lift) {
  const facing = Math.abs(normal.dot(viewDir));
  const fresnel = Math.pow(1 - facing, 2);
  const color = DEEP.clone().lerp(BLUE, smoothstep(0.15, 0.95, fresnel) * 0.85);
  color.lerp(CYAN, smoothstep(0.55, 1, fresnel) * 0.35);
  color.lerp(RIM, smoothstep(0.82, 1, fresnel) * 0.4);
  const top = Math.min(Math.max(normal.y * 0.5 + 0.5, 0), 1);
  color.multiplyScalar(0.75 + 0.45 * top);
  color.r = Math.max(color.r, AMBIENT_FLOOR.r);
  color.g = Math.max(color.g, AMBIENT_FLOOR.g);
  color.b = Math.max(color.b, AMBIENT_FLOOR.b);
  color.add(lift);
  const to255 = (x) => Math.round(Math.min(Math.max(x, 0), 1) * 255);
  return `rgb(${to255(color.r)},${to255(color.g)},${to255(color.b)})`;
}

/* Assemble the model in its poster pose (matches the scene's tilt). */
const parts = [
  { geometry: makeKeycapBodyGeometry(), lift: new THREE.Color(0, 0, 0) },
  { geometry: makeGlyphGeometry(), lift: GLYPH_LIFT },
];

const bodyBox = new THREE.Box3().setFromBufferAttribute(
  parts[0].geometry.getAttribute("position"),
);
const size = bodyBox.getSize(new THREE.Vector3());
const center = bodyBox.getCenter(new THREE.Vector3());

const pose = new THREE.Matrix4()
  .makeRotationY(0.55)
  .multiply(new THREE.Matrix4().makeRotationX(0.21))
  .multiply(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

const maxDim = Math.max(size.x, size.y, size.z);
const fov = THREE.MathUtils.degToRad(32);
const fitDist = maxDim / (2 * Math.tan(fov / 2));
const camPos = new THREE.Vector3(0, size.y * 1.05, fitDist * 1.35);
const forward = camPos.clone().negate().normalize();
const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
const up = new THREE.Vector3().crossVectors(right, forward).normalize();
const tanHalf = Math.tan(fov / 2);

const faces = [];
for (const { geometry, lift } of parts) {
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
    const project = (p) => {
      const rel = p.clone().sub(camPos);
      const x = rel.dot(right) / (rel.dot(forward) * tanHalf);
      const y = rel.dot(up) / (rel.dot(forward) * tanHalf);
      return [SIZE / 2 + (x * SIZE) / 2, SIZE / 2 - (y * SIZE) / 2];
    };
    faces.push({ depth, color: faceColor(normal, viewDir, lift), points: tri.map(project) });
  }
}

faces.sort((f1, f2) => f2.depth - f1.depth); // far first

const polygons = faces
  .map(
    (f) =>
      `  <polygon points="${f.points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}" fill="${f.color}"/>`,
  )
  .join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="Mechanical keyboard keycap with a raised prompt glyph">
${polygons}
</svg>
`;

writeFileSync(new URL("../public/models/keycap-poster.svg", import.meta.url), svg);
console.log(`keycap-poster.svg written (${faces.length} visible faces)`);
