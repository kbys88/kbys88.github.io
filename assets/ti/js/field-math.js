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
