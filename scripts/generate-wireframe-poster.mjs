/**
 * Generates public/models/wireframe-poster.svg — a static frame of the hero
 * wireframe sculpture using the same geometry math as
 * src/scene3d/WireframeScene.ts (SEED, jitters, edge palette and fog
 * depth-fade are mirrored — keep the two in sync).
 *
 * Run: node scripts/generate-wireframe-poster.mjs
 */
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { writeFileSync } from "node:fs";

const SIZE = 800;

const SEED = 7;
const RADIUS = 1.2;
const RADIAL_JITTER = 0.6;
const TANGENTIAL_JITTER = 0.12;

const EDGE_BLUE = new THREE.Color("#168bff");
const EDGE_CYAN = new THREE.Color("#35c8ff");
const EDGE_ICE = new THREE.Color("#8cebff");
const FOG = new THREE.Color("#0a0a14");

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildShellGeometry() {
  const geometry = mergeVertices(new THREE.IcosahedronGeometry(RADIUS, 1));
  const rand = mulberry32(SEED);
  const positions = geometry.getAttribute("position");
  const v = new THREE.Vector3();
  for (let i = 0; i < positions.count; i++) {
    v.fromBufferAttribute(positions, i);
    v.multiplyScalar(1 + (rand() - 0.5) * RADIAL_JITTER);
    v.x += (rand() - 0.5) * TANGENTIAL_JITTER;
    v.y += (rand() - 0.5) * TANGENTIAL_JITTER;
    v.z += (rand() - 0.5) * TANGENTIAL_JITTER;
    positions.setXYZ(i, v.x, v.y, v.z);
  }
  return geometry;
}

function buildCoreGeometry() {
  const geometry = mergeVertices(new THREE.IcosahedronGeometry(RADIUS * 0.45, 0));
  const rand = mulberry32(SEED + 14);
  const positions = geometry.getAttribute("position");
  const v = new THREE.Vector3();
  for (let i = 0; i < positions.count; i++) {
    v.fromBufferAttribute(positions, i);
    v.multiplyScalar(1 + (rand() - 0.5) * 0.7);
    positions.setXYZ(i, v.x, v.y, v.z);
  }
  return geometry;
}

function buildEdges(geometry, seed) {
  const edges = new THREE.EdgesGeometry(geometry, 1);
  const rand = mulberry32(seed);
  const positions = edges.getAttribute("position");
  const segments = [];
  for (let i = 0; i < positions.count; i += 2) {
    const roll = rand();
    const color = roll < 0.62 ? EDGE_BLUE : roll < 0.9 ? EDGE_CYAN : EDGE_ICE;
    segments.push({
      a: new THREE.Vector3().fromBufferAttribute(positions, i),
      b: new THREE.Vector3().fromBufferAttribute(positions, i + 1),
      color,
    });
  }
  return segments;
}

/* scene pose: pivot rotated like the reduced-motion still, model centered */
const shellGeometry = buildShellGeometry();
const coreGeometry = buildCoreGeometry();

const box = new THREE.Box3().setFromBufferAttribute(shellGeometry.getAttribute("position"));
box.union(new THREE.Box3().setFromBufferAttribute(coreGeometry.getAttribute("position")));
const size = box.getSize(new THREE.Vector3());
const center = box.getCenter(new THREE.Vector3());

const shellPose = new THREE.Matrix4()
  .makeRotationY(0.6)
  .multiply(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z));
const corePose = new THREE.Matrix4()
  .makeRotationY(0.6)
  .multiply(new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z))
  .multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0.5, 0.9, 0.2)));

const shellEdges = buildEdges(shellGeometry, SEED + 1).map((e) => ({
  ...e,
  a: e.a.applyMatrix4(shellPose),
  b: e.b.applyMatrix4(shellPose),
  opacity: 0.8,
  width: 1.6,
}));
const coreEdges = buildEdges(coreGeometry, SEED + 2).map((e) => ({
  ...e,
  a: e.a.applyMatrix4(corePose),
  b: e.b.applyMatrix4(corePose),
  opacity: 0.42,
  width: 1.1,
}));

const vertexPositions = [];
{
  const positions = shellGeometry.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    vertexPositions.push(
      new THREE.Vector3().fromBufferAttribute(positions, i).applyMatrix4(shellPose),
    );
  }
}

const maxDim = Math.max(size.x, size.y, size.z);
const fov = THREE.MathUtils.degToRad(32);
const fitDist = maxDim / (2 * Math.tan(fov / 2));
const camDist = fitDist * 1.15;
const camPos = new THREE.Vector3(0, size.y * 0.15, camDist);
const fogNear = camDist - maxDim * 0.4;
const fogFar = camDist + maxDim * 1.1;

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

const depthOf = (p) => p.clone().sub(camPos).dot(forward);
const fogFactor = (depth) =>
  Math.min(Math.max((fogFar - depth) / (fogFar - fogNear), 0), 1);

const to255 = (x) => Math.round(Math.min(Math.max(x, 0), 1) * 255);
const rgb = (c) => `rgb(${to255(c.r)},${to255(c.g)},${to255(c.b)})`;

const lines = [...shellEdges, ...coreEdges]
  .map((e) => {
    const depth = (depthOf(e.a) + depthOf(e.b)) / 2;
    const f = fogFactor(depth);
    const color = e.color.clone().lerp(FOG, 1 - f);
    const [x1, y1] = project(e.a);
    const [x2, y2] = project(e.b);
    return { depth, svg: `  <line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${rgb(color)}" stroke-width="${e.width}" stroke-opacity="${(e.opacity * (0.35 + 0.65 * f)).toFixed(2)}" stroke-linecap="round"/>` };
  })
  .sort((e1, e2) => e2.depth - e1.depth); // far first

const dots = vertexPositions
  .map((p) => {
    const depth = depthOf(p);
    const f = fogFactor(depth);
    const color = new THREE.Color(EDGE_ICE).lerp(FOG, 1 - f);
    const [x, y] = project(p);
    const r = 1.4 + 1.6 * f;
    return { depth, svg: `  <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${rgb(color)}" fill-opacity="${(0.35 + 0.6 * f).toFixed(2)}"/>` };
  })
  .sort((d1, d2) => d2.depth - d1.depth);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" role="img" aria-label="Abstract wireframe polyhedron with blue and cyan luminous edges">
${lines.map((l) => l.svg).join("\n")}
${dots.map((d) => d.svg).join("\n")}
</svg>
`;

writeFileSync(new URL("../public/models/wireframe-poster.svg", import.meta.url), svg);
console.log(
  `wireframe-poster.svg written (${lines.length} edges, ${dots.length} vertices)`,
);
