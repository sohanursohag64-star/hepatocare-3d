import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Procedural anatomical liver.
 *
 * The organ's anterior silhouette is the same outline used by the 2D
 * illustration (SVG viewBox units). A "pillow" surface is wrapped around that
 * outline: the right lobe is thick and domed, the left lobe tapers to a thin
 * edge, and the posterior/inferior surface is flatter than the anterior one.
 */

// Outline in SVG coordinates (anterior view), matching LiverIllustration.
const OUTLINE: [number, number][][] = [
  // [start], then cubic segments [c1, c2, end]
  [[80, 215]],
  [[95, 150], [170, 108], [270, 104]],
  [[350, 100], [420, 112], [480, 140]],
  [[530, 162], [568, 188], [582, 212]],
  [[586, 221], [578, 227], [566, 229]],
  [[520, 237], [470, 251], [425, 270]],
  [[395, 283], [372, 297], [352, 313]],
  [[320, 341], [280, 372], [232, 386]],
  [[185, 400], [132, 386], [102, 352]],
  [[74, 320], [68, 262], [80, 215]],
];

/** SVG → model-space transform. */
const SVG_CENTER = { x: 327, y: 250 };
const SVG_SCALE = 1 / 125;
/** Polar origin inside the silhouette (between the lobes). */
const POLAR_ORIGIN = { x: 300, y: 238 };

export function svgToModel(x: number, y: number) {
  return { x: (x - SVG_CENTER.x) * SVG_SCALE, y: -(y - SVG_CENTER.y) * SVG_SCALE };
}

function buildOutlinePolygon(): THREE.Vector2[] {
  const shape = new THREE.Shape();
  const [[start], ...segments] = OUTLINE;
  shape.moveTo(start[0], start[1]);
  for (const [c1, c2, end] of segments) shape.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], end[0], end[1]);
  return shape.getSpacedPoints(600);
}

/** Distance from POLAR_ORIGIN to the outline along each of N angles (SVG units). */
function buildRadiusTable(samples: number): Float32Array {
  const poly = buildOutlinePolygon();
  const table = new Float32Array(samples);
  const o = POLAR_ORIGIN;
  for (let i = 0; i < samples; i++) {
    const a = (i / samples) * Math.PI * 2;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    let best = 0;
    for (let j = 0; j < poly.length - 1; j++) {
      const p = poly[j];
      const q = poly[j + 1];
      // Ray/segment intersection.
      const ex = q.x - p.x;
      const ey = q.y - p.y;
      const den = dx * ey - dy * ex;
      if (Math.abs(den) < 1e-9) continue;
      const t = ((p.x - o.x) * ey - (p.y - o.y) * ex) / den;
      const u = ((p.x - o.x) * dy - (p.y - o.y) * dx) / den;
      if (t > 0 && u >= 0 && u <= 1) best = Math.max(best, t);
    }
    table[i] = best;
  }
  return table;
}

const RADIUS_SAMPLES = 720;
let radiusTable: Float32Array | null = null;

function radiusAt(angle: number) {
  radiusTable ??= buildRadiusTable(RADIUS_SAMPLES);
  const twoPi = Math.PI * 2;
  const a = ((angle % twoPi) + twoPi) % twoPi;
  const f = (a / twoPi) * RADIUS_SAMPLES;
  const i0 = Math.floor(f) % RADIUS_SAMPLES;
  const i1 = (i0 + 1) % RADIUS_SAMPLES;
  const k = f - Math.floor(f);
  return radiusTable[i0] * (1 - k) + radiusTable[i1] * k;
}

/** Edge fullness: lower = boxier pillow, higher = more lens-like. */
const EDGE_POWER = 0.5;

/** Anterior / posterior thickness at a model-space point. */
function thickness(x: number, y: number) {
  // Model x spans roughly -2 (right lobe, viewer's left) … +2 (left lobe tip).
  const lobe = THREE.MathUtils.clamp((2.05 - x) / 3.9, 0, 1);
  const dome = THREE.MathUtils.clamp(0.75 + y * 0.35, 0.55, 1.15);
  const front = (0.12 + 0.72 * Math.pow(lobe, 0.85)) * dome;
  const back = front * 0.62;
  return { front, back };
}

/** Low-frequency organic undulation. */
function undulation(x: number, y: number) {
  return (
    0.035 * Math.sin(2.3 * x + 1.1) * Math.cos(1.9 * y - 0.4) +
    0.02 * Math.sin(4.1 * x - 2.7 * y + 0.8) +
    0.012 * Math.cos(6.3 * y + 3.1 * x)
  );
}

/**
 * Point on the liver surface (model space) for an SVG coordinate on the
 * anterior (front) or posterior (back) face.
 */
export function surfacePoint(svgX: number, svgY: number, face: "front" | "back" = "front") {
  const dx = svgX - POLAR_ORIGIN.x;
  const dy = svgY - POLAR_ORIGIN.y;
  const angle = Math.atan2(dy, dx);
  const s = THREE.MathUtils.clamp(Math.hypot(dx, dy) / radiusAt(angle), 0, 0.999);
  const phi = Math.acos(Math.pow(s, 1 / EDGE_POWER));
  const m = svgToModel(svgX, svgY);
  const t = thickness(m.x, m.y);
  const sinp = Math.sin(phi);
  const z =
    face === "front"
      ? t.front * Math.pow(sinp, 0.8) + undulation(m.x, m.y) * sinp
      : -t.back * Math.pow(sinp, 0.95);
  return new THREE.Vector3(m.x, m.y, z);
}

export function createLiverGeometry(angularSegments = 220, latitudeSegments = 96) {
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const dark = new THREE.Color("#4a1416");
  const mid = new THREE.Color("#9a342e");
  const light = new THREE.Color("#d06b5b");
  const tmp = new THREE.Color();

  for (let j = 0; j <= latitudeSegments; j++) {
    // phi from -π/2 (posterior pole) to +π/2 (anterior pole)
    const phi = -Math.PI / 2 + (j / latitudeSegments) * Math.PI;
    const cosp = Math.max(0, Math.cos(phi));
    const sinp = Math.sin(phi);
    const radial = Math.pow(cosp, EDGE_POWER);

    for (let i = 0; i <= angularSegments; i++) {
      const theta = (i / angularSegments) * Math.PI * 2;
      const r = radiusAt(theta) * radial;
      const sx = POLAR_ORIGIN.x + Math.cos(theta) * r;
      const sy = POLAR_ORIGIN.y + Math.sin(theta) * r;
      const m = svgToModel(sx, sy);
      const t = thickness(m.x, m.y);

      let z: number;
      if (sinp >= 0) z = t.front * Math.pow(sinp, 0.8) + undulation(m.x, m.y) * sinp;
      else z = -t.back * Math.pow(-sinp, 0.95);

      positions.push(m.x, m.y, z);

      // Colour: lighter on the domed anterior surface, darker toward edges and back.
      const frontness = (sinp + 1) / 2;
      const variation = 0.5 + 0.5 * Math.sin(3.7 * m.x + 2.9 * m.y) * Math.cos(2.1 * m.y - 1.3 * m.x);
      tmp.copy(dark).lerp(mid, Math.min(1, frontness * 1.35));
      tmp.lerp(light, Math.max(0, frontness - 0.55) * 0.9 * (0.6 + 0.4 * variation));
      colors.push(tmp.r, tmp.g, tmp.b);
    }
  }

  const row = angularSegments + 1;
  for (let j = 0; j < latitudeSegments; j++) {
    for (let i = 0; i < angularSegments; i++) {
      const a = j * row + i;
      const b = a + 1;
      const c = a + row;
      const d = c + 1;
      indices.push(a, b, d, a, d, c);
    }
  }

  let geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  // Weld the seam and the collapsed poles so normals are smooth everywhere.
  geometry = mergeVertices(geometry, 1e-4);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

/** Smooth tube through SVG-space control points at a given depth. */
export function createVesselGeometry(points: [number, number, number][], radius: number, segments = 48) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([sx, sy, z]) => {
      const m = svgToModel(sx, sy);
      return new THREE.Vector3(m.x, m.y, z);
    }),
  );
  return new THREE.TubeGeometry(curve, segments, radius, 20, false);
}

// ---------------------------------------------------------------------------
// Illustrative "condition" shapes, used as morph targets by the Liver Story
// section. These are stylised educational visuals, not diagnostic depictions.
// ---------------------------------------------------------------------------

function hash3(x: number, y: number, z: number) {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return h - Math.floor(h);
}

/** Distance to the nearest random feature point (Worley / cellular noise). */
function cellular(x: number, y: number, z: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  let best = 9;
  for (let i = -1; i <= 1; i++)
    for (let j = -1; j <= 1; j++)
      for (let k = -1; k <= 1; k++) {
        const cx = xi + i;
        const cy = yi + j;
        const cz = zi + k;
        const px = cx + hash3(cx, cy, cz);
        const py = cy + hash3(cy, cz, cx);
        const pz = cz + hash3(cz, cx, cy);
        const d = Math.hypot(px - x, py - y, pz - z);
        if (d < best) best = d;
      }
  return best;
}

/**
 * Adds two morph targets to a liver geometry:
 *  0 — "fatty": softly enlarged, rounder edges.
 *  1 — "cirrhosis": smaller, with a firm, nodular surface.
 */
export function addConditionMorphs(geometry: THREE.BufferGeometry) {
  const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
  const nrm = geometry.getAttribute("normal") as THREE.BufferAttribute;
  const count = pos.count;
  const fatty = new Float32Array(count * 3);
  const nodular = new Float32Array(count * 3);
  const freq = 5.5;

  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const nx = nrm.getX(i);
    const ny = nrm.getY(i);
    const nz = nrm.getZ(i);

    // Fatty: inflate along the normal, a little more on the thick right lobe.
    const inflate = 0.05 + 0.04 * THREE.MathUtils.clamp((0.5 - x) / 2.5, 0, 1);
    fatty[i * 3] = x + nx * inflate;
    fatty[i * 3 + 1] = y + ny * inflate;
    fatty[i * 3 + 2] = z + nz * inflate * 1.4;

    // Cirrhosis: shrink slightly, then raise rounded nodules from cellular noise.
    const f1 = cellular(x * freq, y * freq, z * freq);
    const bump = Math.pow(THREE.MathUtils.clamp(1 - f1 / 0.62, 0, 1), 1.6) * 0.06;
    const shrink = -0.035;
    nodular[i * 3] = x * 0.94 + nx * (bump + shrink);
    nodular[i * 3 + 1] = y * 0.94 + ny * (bump + shrink);
    nodular[i * 3 + 2] = z * 0.92 + nz * (bump + shrink);
  }

  const normalsFor = (positions: Float32Array) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setIndex(geometry.getIndex());
    g.computeVertexNormals();
    const n = g.getAttribute("normal") as THREE.BufferAttribute;
    g.setIndex(null);
    g.dispose();
    return n;
  };

  geometry.morphAttributes.position = [
    new THREE.BufferAttribute(fatty, 3),
    new THREE.BufferAttribute(nodular, 3),
  ];
  geometry.morphAttributes.normal = [normalsFor(fatty), normalsFor(nodular)];
  geometry.morphTargetsRelative = false;
  return geometry;
}
