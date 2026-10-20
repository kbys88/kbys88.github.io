import test from 'node:test';
import assert from 'node:assert/strict';
import {
  decodePoints, subsample, ensemble, glyphPoints, stagger, blendPoints,
  fitGlyph, centreXZ, packTrail, camera, rotation,
  decodeNormals, ensembleNormals, blendNormals,
  pickLang, revealProgress, reducedMotion,
} from './field-math.js';

const close = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) <= eps, `${a} != ${b}`);

/* ---------- decodePoints ---------- */

test('decodePoints: Int16 round-trip, +-32767 maps to +-scale', () => {
  const buf = new Int16Array([32767, -32767, 0]).buffer;
  const out = decodePoints(buf, 2);
  assert.ok(out instanceof Float32Array);
  assert.equal(out.length, 3);
  assert.deepEqual(Array.from(out), [2, -2, 0]);
});

test('decodePoints: length is the number of Int16 values', () => {
  const buf = new Int16Array(30).buffer;
  assert.equal(decodePoints(buf, 1).length, 30);
});

/* ---------- subsample ---------- */

test('subsample: keeps every step-th point (triples stay together)', () => {
  const pts = Float32Array.from({ length: 30 }, (_, i) => i); // 10 points
  const out = subsample(pts, 2);
  assert.equal(out.length, 15);
  assert.deepEqual(Array.from(out.slice(0, 6)), [0, 1, 2, 6, 7, 8]);
});

test('subsample: step 1 is identity, ragged length rounds up', () => {
  const pts = Float32Array.from({ length: 30 }, (_, i) => i);
  assert.deepEqual(Array.from(subsample(pts, 1)), Array.from(pts));
  assert.equal(subsample(pts, 3).length, 12); // points 0,3,6,9
});

/* ---------- ensemble ---------- */

function makeSets(k, count) {
  // set s: every point is (s, 0, 0) so the slot a point came from is readable
  return Array.from({ length: k }, (_, s) => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) a[i * 3] = s;
    return a;
  });
}
const arcX = (slot, k) => Math.sin((slot / (k - 1) - .5) * 1.6) * 2.2;
const arcZ = (slot, k) => -Math.cos((slot / (k - 1) - .5) * 1.6) * 2.2 + 1.2;

test('ensemble: point i comes from sets[i % k], scaled .55 and offset to its arc slot', () => {
  const k = 4, count = 40;
  const out = ensemble(makeSets(k, count), k, count);
  assert.equal(out.length, count * 3);
  for (let i = 0; i < count; i++) {
    const slot = i % k;
    close(out[i * 3], slot * .55 + arcX(slot, k), 1e-5);
    close(out[i * 3 + 1], 0, 1e-6);
    close(out[i * 3 + 2], arcZ(slot, k), 1e-5);
  }
});

test('ensemble: stays inside the arc bounds', () => {
  const k = 5, count = 100;
  const sets = Array.from({ length: k }, () => Float32Array.from({ length: count * 3 }, () => Math.random() * 2 - 1));
  const out = ensemble(sets, k, count);
  for (let i = 0; i < count; i++) {
    assert.ok(Math.abs(out[i * 3]) <= 2.2 + .55 + 1e-6);
    assert.ok(Math.abs(out[i * 3 + 1]) <= .55 + 1e-6);
    assert.ok(out[i * 3 + 2] >= -1.1 - .55 && out[i * 3 + 2] <= 1.2 + .55 + 1e-6);
  }
});

test('ensemble: a single performer sits at the arc centre, no NaN', () => {
  const out = ensemble(makeSets(1, 8), 1, 8);
  for (const v of out) assert.ok(Number.isFinite(v));
  close(out[0], 0, 1e-6);
  close(out[2], -2.2 + 1.2, 1e-6);
});

/* ---------- glyphPoints ---------- */

function squareAlpha(w, h, x0, y0, x1, y1) {
  const a = new Uint8ClampedArray(w * h);
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) a[y * w + x] = 255;
  return a;
}

test('glyphPoints: count, y in [-1,1], x in [-aspect,aspect]', () => {
  const alpha = squareAlpha(10, 10, 2, 2, 8, 8);
  const out = glyphPoints(alpha, 10, 10, 500, 7);
  assert.equal(out.length, 1500);
  for (let i = 0; i < 500; i++) {
    assert.ok(out[i * 3 + 1] >= -1 && out[i * 3 + 1] <= 1, 'y');
    assert.ok(out[i * 3] >= -1 && out[i * 3] <= 1, 'x');
    assert.ok(Math.abs(out[i * 3 + 2]) < .1, 'z is a small jitter');
  }
});

test('glyphPoints: only samples lit pixels, x scales with aspect', () => {
  const w = 20, h = 10;
  const alpha = squareAlpha(w, h, 10, 0, 20, 10); // right half lit
  const out = glyphPoints(alpha, w, h, 300, 1);
  for (let i = 0; i < 300; i++) {
    assert.ok(out[i * 3] >= 0 && out[i * 3] <= 2, 'right half, aspect 2');
  }
});

test('glyphPoints: sorted by y then x, and deterministic per seed', () => {
  const alpha = squareAlpha(10, 10, 0, 0, 10, 10);
  const a = glyphPoints(alpha, 10, 10, 200, 3);
  const b = glyphPoints(alpha, 10, 10, 200, 3);
  const c = glyphPoints(alpha, 10, 10, 200, 4);
  assert.deepEqual(Array.from(a), Array.from(b));
  assert.notDeepEqual(Array.from(a), Array.from(c));
  for (let i = 1; i < 200; i++) {
    const y0 = a[(i - 1) * 3 + 1], y1 = a[i * 3 + 1];
    assert.ok(y0 <= y1);
    if (y0 === y1) assert.ok(a[(i - 1) * 3] <= a[i * 3]);
  }
});

test('glyphPoints: fewer lit pixels than count samples with replacement', () => {
  const alpha = squareAlpha(10, 10, 4, 4, 6, 6); // 4 lit pixels
  const out = glyphPoints(alpha, 10, 10, 64, 1);
  assert.equal(out.length, 192);
  for (let i = 0; i < 64; i++) assert.ok(Math.abs(out[i * 3]) < .25 && Math.abs(out[i * 3 + 1]) < .25);
});

test('glyphPoints: an empty glyph returns zeros instead of throwing', () => {
  const out = glyphPoints(new Uint8ClampedArray(100), 10, 10, 8, 1);
  assert.equal(out.length, 24);
  assert.ok(out.every((v) => v === 0));
});

/* ---------- stagger ---------- */

test('stagger: 0 at t=0, 1 at t=1, for every point', () => {
  for (const n of [1, 2, 17, 1000]) {
    for (const i of [0, Math.floor(n / 2), n - 1]) {
      assert.equal(stagger(0, i, n), 0);
      assert.equal(stagger(1, i, n), 1);
    }
  }
});

test('stagger: monotonic in t, later points start later', () => {
  const n = 100;
  for (const i of [0, 40, 99]) {
    let prev = -1;
    for (let s = 0; s <= 100; s++) {
      const v = stagger(s / 100, i, n);
      assert.ok(v >= prev - 1e-12 && v >= 0 && v <= 1);
      prev = v;
    }
  }
  assert.ok(stagger(.3, 0, n) > stagger(.3, 99, n));
  assert.equal(stagger(.2, 99, n, .45) <= stagger(.2, 0, n, .45), true);
});

/* ---------- blendPoints ---------- */

// two points: a head (y = 1) and a foot (y = -1), both travelling +2 in x, same seed
const pair = () => ({
  from: Float32Array.from([0, 1, 0, 0, -1, 0]),
  to: Float32Array.from([2, 1, 0, 2, -1, 0]),
  seed: Float32Array.from([.5, .5]),
});

test('blendPoints: from at t=0, to at t=1, with or without lift', () => {
  const { from, to, seed } = pair();
  for (const lift of [0, .25]) {
    const a = blendPoints(new Float32Array(6), from, to, seed, 0, lift);
    const b = blendPoints(new Float32Array(6), from, to, seed, 1, lift);
    for (let j = 0; j < 6; j++) {
      close(a[j], from[j], 1e-6);
      close(b[j], to[j], 1e-6);
    }
  }
});

test('blendPoints: the head leaves first; no lift keeps points on the straight path', () => {
  const { from, to, seed } = pair();
  const out = blendPoints(new Float32Array(6), from, to, seed, .4, 0);
  assert.ok(out[0] > out[3], 'head is further along x than the foot');
  close(out[1], 1, 1e-6);
  close(out[4], -1, 1e-6);
  assert.ok(out[0] > 0 && out[0] < 2);
});

test('blendPoints: mid-flight lift raises points off the path, by at most 1.5 * lift', () => {
  const { from, to, seed } = pair();
  const flat = blendPoints(new Float32Array(6), from, to, seed, .5, 0);
  const lifted = blendPoints(new Float32Array(6), from, to, seed, .5, .25);
  assert.ok(lifted[1] - flat[1] > .01, 'lifted upward');
  // |direction| <= sqrt(1.6^2 + 1 + 1.6^2) with |x|, |z| <= 2 here; amplitude <= 1.5 * lift
  for (let j = 0; j < 6; j++) assert.ok(Math.abs(lifted[j] - flat[j]) <= .25 * 1.5 * 1.6 + 1e-6);
});

test('blendPoints: out may be from (in place), and the result matches', () => {
  const { from, to, seed } = pair();
  const ref = blendPoints(new Float32Array(6), from, to, seed, .63, .25);
  const same = blendPoints(from, from, to, seed, .63, .25);
  assert.equal(same, from);
  for (let j = 0; j < 6; j++) close(same[j], ref[j], 1e-6);
});

/* ---------- normals ---------- */

test('decodeNormals: Int8 +-127 maps to +-1', () => {
  const out = decodeNormals(new Int8Array([127, -127, 0, 64, -1, 127]).buffer);
  assert.ok(out instanceof Float32Array);
  assert.equal(out.length, 6);
  close(out[0], 1); close(out[1], -1); close(out[2], 0); close(out[3], 64 / 127); close(out[4], -1 / 127);
});

test('ensembleNormals: point i takes sets[i % k] at index i, unscaled', () => {
  const k = 3, count = 12;
  const sets = Array.from({ length: k }, (_, s) => Float32Array.from({ length: count * 3 }, (_, j) => (j % 3 === 0 ? s : 0)));
  const out = ensembleNormals(sets, k, count);
  assert.equal(out.length, count * 3);
  for (let i = 0; i < count; i++) assert.equal(out[i * 3], i % k);
  const short = ensembleNormals([Float32Array.from([0, 0, 1])], 1, 4); // fewer points than count: wraps
  assert.deepEqual(Array.from(short), [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
});

test('blendNormals: from at t=0, to at t=1, unit length, head first like the positions', () => {
  const from = Float32Array.from([0, 1, 0, 0, -1, 0]);           // a head and a foot
  const nFrom = Float32Array.from([1, 0, 0, 1, 0, 0]);
  const nTo = Float32Array.from([0, 1, 0, 0, 1, 0]);
  const seed = Float32Array.from([.5, .5]);
  const a = blendNormals(new Float32Array(6), nFrom, nTo, from, seed, 0);
  const b = blendNormals(new Float32Array(6), nFrom, nTo, from, seed, 1);
  for (let j = 0; j < 6; j++) { close(a[j], nFrom[j]); close(b[j], nTo[j]); }
  const m = blendNormals(new Float32Array(6), nFrom, nTo, from, seed, .4);
  close(Math.hypot(m[0], m[1], m[2]), 1); close(Math.hypot(m[3], m[4], m[5]), 1);
  assert.ok(m[1] > m[4], 'the head has turned further toward the target');
});

test('blendNormals: opposite normals stay finite; in place works', () => {
  const from = Float32Array.from([0, 0, 0]);
  const seed = Float32Array.from([0]);
  // seed 0, y 0: the point's delay is .25 * spread, so t = .5 lands near the half-way blend
  for (const t of [.45, .5, .55, .6]) {
    const n = blendNormals(new Float32Array(3), Float32Array.from([0, 0, 1]), Float32Array.from([0, 0, -1]), from, seed, t);
    assert.ok(n.every(Number.isFinite));
    close(Math.hypot(n[0], n[1], n[2]), 1, 1e-5);
  }
  const nFrom = Float32Array.from([1, 0, 0]);
  const ref = blendNormals(new Float32Array(3), nFrom, Float32Array.from([0, 1, 0]), from, seed, .5);
  assert.equal(blendNormals(nFrom, nFrom, Float32Array.from([0, 1, 0]), from, seed, .5), nFrom);
  for (let j = 0; j < 3; j++) close(nFrom[j], ref[j]);
});

/* ---------- fitGlyph / centreXZ ---------- */

test('fitGlyph: centred, scaled to the height, z scaled, in place', () => {
  const p = Float32Array.from([-2, -1, .01, 2, 1, -.01, 0, 0, 0]); // 4 wide, 2 tall
  const out = fitGlyph(p, .9, 10, 5);
  assert.equal(out, p);
  close(p[0], -.9); close(p[1], -.45); close(p[2], .05);
  close(p[3], .9); close(p[4], .45); close(p[5], -.05);
});

test('fitGlyph: a wide word is capped at maxWidth instead', () => {
  const p = Float32Array.from([0, 0, 0, 10, 1, 0]); // 10 wide, 1 tall, off-centre
  fitGlyph(p, .9, 3.4);
  close(p[0], -1.7, 1e-5); close(p[3], 1.7, 1e-5);
  close(p[4] - p[1], .34, 1e-5);
});

test('fitGlyph: empty and all-zero sets stay finite', () => {
  assert.equal(fitGlyph(new Float32Array(0), .9, 3.4).length, 0);
  const z = fitGlyph(new Float32Array(9), .9, 3.4, 5);
  assert.ok(z.every((v) => v === 0));
});

test('centreXZ: mean x and z go to 0, y untouched', () => {
  const p = Float32Array.from([1, 5, 2, 3, -5, 4]);
  centreXZ(p);
  assert.deepEqual(Array.from(p), [-1, 5, -1, 1, -5, 1]);
});

/* ---------- packTrail ---------- */

test('packTrail: cursor first, samples decay to 0 at life, join flags, strongest returned', () => {
  const out = new Float32Array(32).fill(9);
  const samples = [
    { x: 10, y: 20, at: 9.5, s: .8, j: true },  // age .5
    { x: 30, y: 40, at: 9.0, s: 1, j: false },  // age 1
    { x: 50, y: 60, at: 8.0, s: 1, j: true },   // age 2: dead
  ];
  const plane = (x, y) => [x / 10, -y / 10];
  const top = packTrail(out, { x: 5, y: 6, s: .3, j: true }, samples, 10, 1.2, plane);
  close(out[0], .5); close(out[1], -.6); close(out[2], .3); assert.equal(out[3], 1);
  close(out[4], 1); close(out[5], -2); close(out[6], .8 * (1 - .5 / 1.2) ** 2); assert.equal(out[7], 1);
  close(out[10], (1 - 1 / 1.2) ** 2); assert.equal(out[11], 0);
  assert.equal(out[14], 0);
  for (let k = 4; k < 8; k++) assert.equal(out[k * 4 + 2], 0, 'missing samples have no strength');
  close(top, .8 * (1 - .5 / 1.2) ** 2);
});

/* ---------- camera / rotation ---------- */

test('camera: the figure centre lands on cy, one unit spans ppu px', () => {
  const proj = new Float32Array(16);
  const vw = 1000, vh = 800, cy = 300, ppu = 150, tan = Math.tan(17.5 * Math.PI / 180);
  const D = camera(proj, vw, vh, cy, ppu, 0, tan);
  const screenY = (x, y, z) => {
    const cyc = proj[1] * x + proj[5] * y + proj[9] * z + proj[13];
    const w = proj[3] * x + proj[7] * y + proj[11] * z + proj[15];
    return (1 - cyc / w) / 2 * vh;
  };
  close(screenY(0, 0, 0), cy, 1e-3);
  close(screenY(0, 1, 0), cy - ppu, 1e-3);
  close(D, vh / 2 / (ppu * tan), 1e-9);
});

test('rotation: yaw turns +z toward +x, tilt turns +z toward -y', () => {
  const m = rotation(new Float32Array(9), Math.PI / 2, 0);
  const apply = (v) => [0, 1, 2].map((r) => m[r] * v[0] + m[3 + r] * v[1] + m[6 + r] * v[2]);
  apply([0, 0, 1]).forEach((v, i) => close(v, [1, 0, 0][i], 1e-6));
  const t = rotation(m, 0, Math.PI / 2);
  assert.equal(t, m);
  apply([0, 0, 1]).forEach((v, i) => close(v, [0, -1, 0][i], 1e-6));
});

/* ---------- pickLang ---------- */

test('pickLang: query beats stored, stored beats default', () => {
  assert.equal(pickLang('?lang=ja', null), 'ja');
  assert.equal(pickLang('', 'ja'), 'ja');
  assert.equal(pickLang('', null), 'en');
  assert.equal(pickLang('?lang=en', 'ja'), 'en');
  assert.equal(pickLang('?lang=ja', 'en'), 'ja');
});

test('pickLang: ignores junk, keeps working with other params', () => {
  assert.equal(pickLang('?lang=fr', null), 'en');
  assert.equal(pickLang('?lang=fr', 'ja'), 'ja');
  assert.equal(pickLang('', 'xx'), 'en');
  assert.equal(pickLang('?motion=reduce&lang=ja', null), 'ja');
  assert.equal(pickLang(undefined, undefined), 'en');
});

/* ---------- revealProgress ---------- */

test('revealProgress: clamps to 0..1', () => {
  const vh = 800;
  assert.equal(revealProgress(5000, 60, vh), 0);
  assert.equal(revealProgress(vh, 60, vh), 0);
  assert.equal(revealProgress(-500, 60, vh), 1);
  assert.equal(revealProgress(0, 60, vh), 1);
  for (let top = -300; top <= 1200; top += 25) {
    const p = revealProgress(top, 60, vh);
    assert.ok(p >= 0 && p <= 1);
  }
});

test('revealProgress: rises as the line scrolls up, full by the upper middle', () => {
  const vh = 800, h = 60;
  let prev = 2;
  for (let top = 0; top <= 800; top += 20) {
    const p = revealProgress(top, h, vh);
    assert.ok(p <= prev + 1e-12, 'non-increasing in top');
    prev = p;
  }
  assert.equal(revealProgress(vh * .4, h, vh), 1);
  assert.ok(revealProgress(vh * .9, h, vh) < .2);
  const mid = revealProgress(vh * .6, h, vh);
  assert.ok(mid > 0 && mid < 1);
});

/* ---------- reducedMotion ---------- */

test('reducedMotion: ?motion=reduce or the media query', () => {
  assert.equal(reducedMotion('?motion=reduce', false), true);
  assert.equal(reducedMotion('', true), true);
  assert.equal(reducedMotion('', false), false);
});

test('reducedMotion: other params and values do not count', () => {
  assert.equal(reducedMotion('?motion=full', false), false);
  assert.equal(reducedMotion('?nogl&lang=ja', false), false);
  assert.equal(reducedMotion('?lang=ja&motion=reduce', false), true);
  assert.equal(reducedMotion(undefined, false), false);
});
