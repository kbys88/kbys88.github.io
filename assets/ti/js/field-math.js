// Pure helpers for the point field and the page. No DOM, no WebGL: node can
// import this file (see field-math.test.mjs). Point sets are flat Float32Arrays,
// x y z interleaved.

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* ---------- point sets ---------- */

/** Decode a little-endian Int16 point file (x y z interleaved, +-32767 = +-scale). */
export function decodePoints(buf, scale) {
  const q = new Int16Array(buf);
  const out = new Float32Array(q.length);
  const k = scale / 32767;
  for (let i = 0; i < q.length; i++) out[i] = q[i] * k;
  return out;
}

/** Keep every `step`-th point (points are triples, so triples stay together). */
export function subsample(points, step) {
  const n = Math.floor(points.length / 3);
  const m = Math.ceil(n / step);
  const out = new Float32Array(m * 3);
  for (let j = 0; j < m; j++) {
    const s = j * step * 3;
    out[j * 3] = points[s];
    out[j * 3 + 1] = points[s + 1];
    out[j * 3 + 2] = points[s + 2];
  }
  return out;
}

/**
 * Ensemble layout: k performers on an arc. Point i is taken from sets[i % k]
 * (same index i), scaled .55 and moved to that performer's slot on the arc.
 */
export function ensemble(sets, k, count) {
  const out = new Float32Array(count * 3);
  const slotX = new Float32Array(k);
  const slotZ = new Float32Array(k);
  for (let s = 0; s < k; s++) {
    const a = k > 1 ? (s / (k - 1) - .5) * 1.6 : 0;
    slotX[s] = Math.sin(a) * 2.2;
    slotZ[s] = -Math.cos(a) * 2.2 + 1.2;
  }
  for (let i = 0; i < count; i++) {
    const s = i % k;
    const src = sets[s];
    const n = Math.floor(src.length / 3);
    const j = (i % n) * 3;
    out[i * 3] = src[j] * .55 + slotX[s];
    out[i * 3 + 1] = src[j + 1] * .55;
    out[i * 3 + 2] = src[j + 2] * .55 + slotZ[s];
  }
  return out;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sample `count` points from the lit pixels (alpha > 127) of a w*h alpha mask.
 * x in [-aspect, aspect], y in [-1, 1] (up is +y), z a small jitter. Enough lit
 * pixels: sampled without replacement; fewer: every pixel once, then repeats.
 * Sorted by y, then x, so a morph from a similarly sorted set travels coherently.
 * An empty mask gives zeros.
 */
export function glyphPoints(alpha, w, h, count, seed) {
  const out = new Float32Array(count * 3);
  const lit = [];
  for (let p = 0; p < w * h; p++) if (alpha[p] > 127) lit.push(p);
  if (!lit.length || count <= 0) return out;

  const rnd = mulberry32(seed);
  const pick = new Uint32Array(count);
  if (lit.length >= count) {
    for (let i = 0; i < count; i++) {            // partial Fisher-Yates
      const j = i + Math.floor(rnd() * (lit.length - i));
      const t = lit[i]; lit[i] = lit[j]; lit[j] = t;
      pick[i] = lit[i];
    }
  } else {
    for (let i = 0; i < count; i++) {
      pick[i] = i < lit.length ? lit[i] : lit[Math.floor(rnd() * lit.length)];
    }
  }

  const aspect = w / h;
  const xs = new Float32Array(count);
  const ys = new Float32Array(count);
  const zs = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const px = pick[i] % w;
    const py = (pick[i] / w) | 0;
    xs[i] = ((px + rnd()) / w * 2 - 1) * aspect;  // jitter inside the pixel cell
    ys[i] = 1 - (py + rnd()) / h * 2;
    zs[i] = (rnd() - .5) * .04;
  }
  const order = new Uint32Array(count);
  for (let i = 0; i < count; i++) order[i] = i;
  order.sort((a, b) => ys[a] - ys[b] || xs[a] - xs[b]);
  for (let i = 0; i < count; i++) {
    const s = order[i];
    out[i * 3] = xs[s];
    out[i * 3 + 1] = ys[s];
    out[i * 3 + 2] = zs[s];
  }
  return out;
}

/**
 * Per-point eased progress. Point i of n starts at i/n * spread and has the
 * remaining (1 - spread) of t to arrive; smoothstep-eased. 0 at t=0, 1 at t=1.
 */
export function stagger(t, i, n, spread = .45) {
  const delay = n > 1 ? (i / (n - 1)) * spread : 0;
  const u = clamp01((t - delay) / (1 - spread));
  return u * u * (3 - 2 * u);
}

/** Share of a morph over which point departures are staggered (field.js shader uses it too). */
export const MORPH_SPREAD = .45;

// one point's eased morph progress: delay = (seed + head-first bias from its start height) * spread
const morphProgress = (t, fromY, s, spread) => stagger(t, .5 * s + .5 * (1 - clamp01((fromY + 1) / 2)), 2, spread);

/** Decode an Int8 normal file (nx ny nz interleaved, +-127 = +-1). */
export function decodeNormals(buf) {
  const q = new Int8Array(buf);
  const out = new Float32Array(q.length);
  for (let i = 0; i < q.length; i++) out[i] = q[i] / 127;
  return out;
}

/** Normals for ensemble(): point i takes sets[i % k] at index i, like the positions (no scaling). */
export function ensembleNormals(sets, k, count) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const src = sets[i % k];
    const j = (i % Math.floor(src.length / 3)) * 3;
    out.set(src.subarray(j, j + 3), i * 3);
  }
  return out;
}

/**
 * Normals of a morph at time t: the CPU mirror of the shader's normal mix, normalised
 * ((0, 0, 1) where opposite normals cancel). The progress comes from `from` (positions),
 * so call it before blendPoints() overwrites them. `out` may be `nFrom`. Returns `out`.
 */
export function blendNormals(out, nFrom, nTo, from, seed, t, spread = MORPH_SPREAD) {
  const n = Math.floor(Math.min(out.length, nFrom.length, nTo.length, from.length) / 3);
  for (let i = 0; i < n; i++) {
    const j = i * 3;
    const e = morphProgress(t, from[j + 1], seed[i], spread);
    const x = nFrom[j] + (nTo[j] - nFrom[j]) * e;
    const y = nFrom[j + 1] + (nTo[j + 1] - nFrom[j + 1]) * e;
    const z = nFrom[j + 2] + (nTo[j + 2] - nFrom[j + 2]) * e;
    const len = Math.hypot(x, y, z);
    out[j] = len > 1e-4 ? x / len : 0;
    out[j + 1] = len > 1e-4 ? y / len : 0;
    out[j + 2] = len > 1e-4 ? z / len : 1;
  }
  return out;
}

/**
 * Point positions of a morph at time t (0..1): the CPU mirror of the vertex shader in
 * field.js, used to start a new morph from where an interrupted one is. Point delay =
 * (seed + head-first bias from from.y) * spread, smoothstep travel (stagger), plus a lift
 * off the path (outward/upward) of sin(pi * progress) * lift * (.5 + seed).
 * `out` may be `from`. Returns `out`.
 */
export function blendPoints(out, from, to, seed, t, lift, spread = MORPH_SPREAD) {
  const n = Math.floor(Math.min(out.length, from.length, to.length) / 3);
  for (let i = 0; i < n; i++) {
    const j = i * 3;
    const s = seed[i];
    const fx = from[j], fy = from[j + 1], fz = from[j + 2];
    const e = morphProgress(t, fy, s, spread);
    const x = fx + (to[j] - fx) * e;
    const y = fy + (to[j + 1] - fy) * e;
    const z = fz + (to[j + 2] - fz) * e;
    const l = Math.sin(Math.PI * e) * lift * (.5 + s);
    out[j] = x + (x * .6 + Math.cos(s * 81.7) * .4) * l;
    out[j + 1] = y + (.55 + .45 * Math.sin(s * 53.1)) * l;
    out[j + 2] = z + (z * .6 + Math.sin(s * 81.7) * .4) * l;
  }
  return out;
}

/**
 * Fit glyph points in place: centred on the origin, `height` units tall unless that would
 * make them wider than `maxWidth`, z multiplied by `zScale`. Returns `points`.
 */
export function fitGlyph(points, height, maxWidth, zScale = 1) {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (let j = 0; j < points.length; j += 3) {
    x0 = Math.min(x0, points[j]); x1 = Math.max(x1, points[j]);
    y0 = Math.min(y0, points[j + 1]); y1 = Math.max(y1, points[j + 1]);
  }
  if (!(x1 >= x0)) return points;
  const k = Math.min(height / Math.max(y1 - y0, 1e-6), maxWidth / Math.max(x1 - x0, 1e-6));
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  for (let j = 0; j < points.length; j += 3) {
    points[j] = (points[j] - cx) * k;
    points[j + 1] = (points[j + 1] - cy) * k;
    points[j + 2] *= zScale;
  }
  return points;
}

/** Shift a point set in place so its mean x and z are 0 (y untouched). Returns it. */
export function centreXZ(points) {
  const n = Math.floor(points.length / 3);
  let mx = 0, mz = 0;
  for (let j = 0; j < n * 3; j += 3) { mx += points[j]; mz += points[j + 2]; }
  for (let j = 0; j < n * 3; j += 3) { points[j] -= mx / n; points[j + 2] -= mz / n; }
  return points;
}

/**
 * Pack the pointer trail for the shader into `out` (8 vec4, newest first): slot 0 is the
 * cursor {x, y, s, j}, then up to 7 samples {x, y, at, s, j}. xy = toPlane(x, y) (figure-
 * plane units); z = strength: the cursor's s, a sample's s * (1 - age / life)^2 (0 past
 * life or when missing); w = 1 if joined to the next, older entry. Returns the strongest
 * sample strength.
 */
export function packTrail(out, cursor, samples, now, life, toPlane) {
  let top = 0;
  for (let k = 0; k < 8; k++) {
    const e = k ? samples[k - 1] : cursor;
    const age = !e ? life : k ? now - e.at : 0;
    const s = age < life ? e.s * (k ? (1 - age / life) ** 2 : 1) : 0;
    const [x, y] = e ? toPlane(e.x, e.y) : [0, 0];
    out.set([x, y, s, e?.j ? 1 : 0], k * 4);
    if (k) top = Math.max(top, s);
  }
  return top;
}

/**
 * Field camera: fills `proj` (column-major mat4: perspective with tan(fov / 2) = tanHalf,
 * times a shift that puts the figure centre at screen y = cy CSS px and x offset offX
 * units) and returns the camera distance at which one unit there spans ppu CSS px.
 */
export function camera(proj, vw, vh, cy, ppu, offX, tanHalf) {
  const D = vh / 2 / (ppu * tanHalf);
  const ty = (vh / 2 - cy) / ppu;
  const fy = 1 / tanHalf, fx = fy * vh / vw, n = .1, far = 100;
  const A = (far + n) / (n - far), B = 2 * far * n / (n - far);
  proj.set([fx, 0, 0, 0, 0, fy, 0, 0, 0, 0, A, -1, fx * offX, fy * ty, -D * A + B, D]);
  return D;
}

/** Rx(tiltX) * Ry(yaw) into `out` (column-major mat3). Returns `out`. */
export function rotation(out, yaw, tiltX) {
  const ca = Math.cos(tiltX), sa = Math.sin(tiltX), cb = Math.cos(yaw), sb = Math.sin(yaw);
  out.set([cb, sa * sb, -ca * sb, 0, ca, sa, sb, -sa * cb, ca * cb]);
  return out;
}

/* ---------- page ---------- */

/** 'ja' or 'en': ?lang= wins, then the stored choice, then English. */
export function pickLang(search, stored) {
  const q = new URLSearchParams(search ?? '').get('lang');
  if (q === 'ja' || q === 'en') return q;
  if (stored === 'ja' || stored === 'en') return stored;
  return 'en';
}

/**
 * Statement lines: 0 while a line is still low in the viewport, 1 once its
 * centre has risen to the upper middle (~45% of the viewport height).
 * Lines that have scrolled past stay at 1.
 */
export function revealProgress(top, height, vh) {
  const centre = top + height / 2;
  const start = vh * .9;
  const end = vh * .45;
  return clamp01((start - centre) / (start - end));
}

/** True for ?motion=reduce or when the prefers-reduced-motion query matches. */
export function reducedMotion(search, mediaMatches) {
  return new URLSearchParams(search ?? '').get('motion') === 'reduce' || !!mediaMatches;
}
