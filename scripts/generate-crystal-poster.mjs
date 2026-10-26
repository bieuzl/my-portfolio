/**
 * Generates public/models/crystal-poster.svg — a static frame of the hero
 * crystal sculpture rendered with the same geometry math as
 * src/scene3d/CrystalScene.ts (painter's algorithm, no WebGL needed).
 * Transmission can't be faked on flat polygons, so faces get a dark-glass
 * base, a cyan fresnel edge and a normal-driven iridescent hue shift.
 *
 * Run: node scripts/generate-crystal-poster.mjs
 */
import * as THREE from "three";
import { writeFileSync } from "node:fs";

const SIZE = 800;

/* Mirrors BLADES in src/scene3d/CrystalScene.ts — keep the two in sync. */
const BLADES = [
  { radius: 1.05, tube: 0.4, arc: 2.0, scale: [1, 1.5, 0.5], position: [-0.36, 0.05, 0], rotation: [0.1, 0.35, -0.08] },
  { radius: 0.85, tube: 0.34, arc: 1.7, mirror: true, scale: [1, 1.3, 0.5], position: [0.44, -0.16, 0.08], rotation: [-0.08, -0.35, 0.1] },
  { radius: 0.5, tube: 0.2, arc: 1.5, scale: [1, 1.25, 0.5], position: [0.04, 0.3, 0.45], rotation: [0.35, 0.15, -0.3] },
];

function makeBladeGeometry(spec) {
  const geometry = new THREE.TorusGeometry(spec.radius, spec.tube, 5, 26, spec.arc);
  /* center the arc on its bulge axis so the blade stands upright */
  geometry.rotateZ((spec.mirror ? Math.PI : 0) - spec.arc / 2);
  geometry.scale(...spec.scale);
  geometry.rotateX(spec.rotation[0]);
  geometry.rotateY(spec.rotation[1]);
  geometry.rotateZ(spec.rotation[2]);
  geometry.translate(...spec.position);
  return geometry.toNonIndexed();
}

const GLASS_DEEP = new THREE.Color("#16264a");
const GLASS_MID = new THREE.Color("#34507e");
const CYAN = new THREE.Color("#38e1ff");
const ICE = new THREE.Color("#a8d8ff");
const LIGHT_DIR = new THREE.Vector3(2.5, 3, 4).normalize();

function smoothstep(a, b, x) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

function faceColor(normal, viewDir) {
  const facing = Math.abs(normal.dot(viewDir));
  const fresnel = Math.pow(1 - facing, 1.4);
  const top = Math.min(Math.max(normal.y * 0.5 + 0.5, 0), 1);
  const color = GLASS_DEEP.clone().lerp(GLASS_MID, top);
  color.lerp(CYAN, smoothstep(0.3, 0.85, fresnel) * 0.9);
  color.lerp(ICE, smoothstep(0.7, 1, fresnel) * 0.7);
  /* iridescent drift: hue wanders with facet orientation */
  color.offsetHSL((normal.x * 0.6 + normal.z * 0.4) * 0.08, 0.12, fresnel * 0.08);
  /* fake specular sparkle on facets facing the key light */
  const spec = Math.pow(Math.max(normal.dot(LIGHT_DIR), 0), 12);
  color.lerp(new THREE.Color("#eaf6ff"), spec * 0.9);
  const to255 = (x) => Math.round(Math.min(Math.max(x, 0), 1) * 255);
  return `rgb(${to255(color.r)},${to255(color.g)},${to255(color.b)})`;
}

const parts = BLADES.map((spec) => makeBladeGeometry(spec));

const box = new THREE.Box3();
for (const geometry of parts) {
  box.union(
    new THREE.Box3().setFromBufferAttribute(geometry.getAttribute("position")),
  );
}
const size = box.getSize(new THREE.Vector3());
const center = box.getCenter(new THREE.Vector3());

const pose = new THREE.Matrix4()
  .makeRotationY(0.6)
  .multiply(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));

const maxDim = Math.max(size.x, size.y, size.z);
const fov = THREE.MathUtils.degToRad(32);
const fitDist = maxDim / (2 * Math.tan(fov / 2));
const camPos = new THREE.Vector3(0, size.y * 0.35, fitDist * 1.5);
const forward = camPos.clone().negate().normalize();
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
for (const geometry of parts) {
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
    faces.push({ depth, color: faceColor(normal, viewDir), points: tri.map(project) });
  }
}

faces.sort((f1, f2) => f2.depth - f1.depth); // far first

const polygons = faces
  .map(
    (f) =>
      `  <polygon points="${f.points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}" fill="${f.color}"/>`,
  )
  .join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="Abstract crystal sculpture with blue iridescent facets">
${polygons}
</svg>
`;

writeFileSync(new URL("../public/models/crystal-poster.svg", import.meta.url), svg);
console.log(`crystal-poster.svg written (${faces.length} visible faces)`);
