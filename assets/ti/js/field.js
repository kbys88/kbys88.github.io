// The point field behind /transinstrumentalism/: orchestral performers as point clouds of
// light on one fixed WebGL2 canvas. page.js imports this module and calls initField();
// the state follows html[data-state] on load, then window 'ti:state' events.
// html[data-field] = 'gl' while the canvas runs, 'still' when the fallback image stays.
// Pure maths (decoding, ensemble, glyphs, the CPU morph mirror) lives in field-math.js;
// the bloom and tone mapping in glow.js.

import {
  decodePoints, subsample, ensemble, glyphPoints, reducedMotion, blendPoints, MORPH_SPREAD,
  fitGlyph, centreXZ, packTrail, camera, rotation, decodeNormals, ensembleNormals, blendNormals,
} from './field-math.js';
import { createGlow, program } from './glow.js';

const ALPHA = { solo: .24, day0: .24, reverie: .26, babel: .22 }; // light per dot, per state
// The look. size: in-focus dot (CSS px); dof / fling: extra blur, CSS px per unit off the
// focal plane / per unit flung; exposure and bloom: glow.js tone curve and halo strength.
// Shading: ambient floor under the key light, the far side's share, rim strength, feet,
// and the weight left to surfaces seen edge-on.
const LOOK = {
  size: 5.2, dof: 9, fling: 16, exposure: 2.2, bloom: 1,
  ambient: .06, back: .22, rim: .12, feet: .6, edge: .3,
};
const g = (v) => v.toFixed(3); // a GLSL float literal

const VS = `#version 300 es
precision highp float;
in vec3 aFrom;           // morph start (a blended snapshot when a morph is interrupted)
in vec3 aTo;             // morph target
in float aSeed;          // per-point random 0..1
in vec3 aNFrom;          // surface normal at the start (glyphs face the camera)
in vec3 aNTo;            // surface normal at the target
uniform float uMix;      // morph time 0..1 (1 = settled on aTo)
uniform float uLift;     // mid-flight lift off the path, units (0 under reduced motion)
uniform float uTime;     // seconds (frozen under reduced motion)
uniform float uIdle;     // breathing, dust and grain weight (0 under reduced motion)
uniform mat3 uRot;       // turn about y, then the parallax tilt
uniform mat4 uProj;      // perspective * camera offset (figure centre at z = -uDist)
uniform float uDist;     // camera distance to the figure centre = the focal plane, units
uniform vec4 uTrail[8];  // pointer trail, newest first: xy figure-plane units, z strength, w 1 = joined to the next
uniform float uTrailOn;  // 0 = the trail pushes points away, 1 = it pulls them onto the path (day0)
uniform float uSize;     // in-focus dot diameter in device px at the figure centre
uniform float uAlpha;    // light per dot
uniform float uFade;     // depth fade (reverie): far points dimmer
uniform float uDof;      // depth of field: extra blur, device px per unit off the focal plane
uniform float uFling;    // extra blur, device px per unit a point is flung (gesture, morph lift)
out float vAlpha;
const float SPREAD = ${MORPH_SPREAD.toFixed(3)};
const vec3 KEY = vec3(-.544, .593, .593); // key light from the upper front-left (unit)
const float AMBIENT = ${g(LOOK.ambient)}, BACK = ${g(LOOK.back)}, RIM = ${g(LOOK.rim)}, FEET = ${g(LOOK.feet)}, EDGE = ${g(LOOK.edge)};
void main() {
  // morph; blendPoints() / blendNormals() in field-math.js mirror these lines on the CPU
  float h = clamp((aFrom.y + 1.) * .5, 0., 1.);
  float u = clamp((uMix - (.5 * aSeed + .5 * (1. - h)) * SPREAD) / (1. - SPREAD), 0., 1.);
  float e = u * u * (3. - 2. * u);
  vec3 p = aFrom + (aTo - aFrom) * e;
  vec3 n = aNFrom + (aNTo - aNFrom) * e;
  n = dot(n, n) > 1e-8 ? normalize(n) : vec3(0., 0., 1.);
  float l = sin(3.14159265 * e) * uLift * (.5 + aSeed);
  p += vec3(p.x * .6 + cos(aSeed * 81.7) * .4, .55 + .45 * sin(aSeed * 53.1), p.z * .6 + sin(aSeed * 81.7) * .4) * l;
  // always mid-process: breathing, and ~2.5% of the points lifting off like dust
  float t = uTime;
  p += uIdle * .006 * sin(vec3(t * .7 + aSeed * 91. + p.y * 4., t * .9 + aSeed * 57. + p.z * 4., t * .8 + aSeed * 23. + p.x * 4.));
  float dust = uIdle * step(fract(aSeed * 37.31), .025) * pow(max(0., sin(t * (.45 + .4 * fract(aSeed * 13.7)) + aSeed * 40.)), 3.);
  p += dust * .15 * vec3(p.x * 1.2, 1., p.z * 1.2);
  vec3 q = uRot * p;
  vec3 nw = uRot * n;
  // gesture: distance to each trail segment, in the plane through the figure centre
  vec2 d = vec2(0.);
  float F = 0.;
  for (int k = 0; k < 7; k++) {
    vec4 A = uTrail[k];
    vec4 B = uTrail[k + 1];
    float w = (A.z + B.z) * .5 * A.w;
    if (w < .002) continue;
    vec2 ab = B.xy - A.xy;
    vec2 v = q.xy - (A.xy + ab * clamp(dot(q.xy - A.xy, ab) / max(dot(ab, ab), 1e-6), 0., 1.));
    float r = mix(.08 + .16 * w, .2 + .12 * w, uTrailOn);
    float f = w * exp(-dot(v, v) / (r * r));
    d += mix(normalize(v + 1e-5) * .34 * (.6 + .8 * aSeed), -v * .9, uTrailOn) * f;
    F += f;
  }
  d /= max(F, 1.);
  q.xy += d;
  q.z *= 1. - .7 * uTrailOn * min(F, 1.);
  gl_Position = uProj * vec4(q, 1.);
  // light: wrapped key so shadows never go black, a faint rim on grazing surfaces; the far
  // side of the body (no depth test) and the feet read darker. Surfaces seen edge-on pile
  // their points up on screen, so each point is weighted by its projected area (|n.z|):
  // a lit surface then reads as an even surface, not as a glowing outline.
  float key = max(dot(nw, KEY) + .5, 0.) / 1.5;
  float lit = (AMBIENT + (1. - AMBIENT) * key) * mix(BACK, 1., smoothstep(-.5, .35, nw.z)) + RIM * pow(1. - abs(nw.z), 3.);
  lit *= mix(FEET, 1., smoothstep(-1., .15, p.y)) * mix(EDGE, 1., abs(nw.z));
  // depth of field: blur grows the dot and spreads the same light over its area
  float depth = uDist - q.z;
  float s = uSize * uDist / depth * (.8 + .35 * lit);
  float coc = abs(depth - uDist) * uDof + (length(d) + l + dust * .15) * uFling;
  float S = min(sqrt(s * s + coc * coc), 48.);
  gl_PointSize = S;
  float grain = 1. + uIdle * .14 * (fract(aSeed * 7919.13 + floor(t * 18.) * .618034) - .5);
  vAlpha = uAlpha * lit * grain * s * s / (S * S) * (1. - uFade * clamp((depth - uDist + .8) / 3., 0., .75));
}`;

const FS = `#version 300 es
precision mediump float;
in float vAlpha;
uniform vec3 uColor;     // light colour: white into the glow target, #EDEDED drawn straight
out vec4 o;
void main() {
  vec2 c = gl_PointCoord * 2. - 1.;
  float a = vAlpha * exp(-4. * dot(c, c)); // Gaussian dot
  o = vec4(uColor * a, a);
}`;

const POINTS = new URL('../points/', import.meta.url);
const TAN = Math.tan(35 / 2 * Math.PI / 180); // vertical fov 35 deg
const MORPH_S = 1.8;    // morph duration, s
const LIFT = .25;       // mid-morph lift, units
const TURN_S = 60;      // one turn about y, s
const TILT = .12;       // parallax tilt toward the pointer, rad
const WORD = 'BABEL';   // babel: the one word the particles form
const ENSEMBLE = ['violin', 'cello', 'flute', 'clarinet', 'harp'];
const INERT = 'a, button, input, select, textarea, label, summary, iframe, video, [data-yt]';
const BG = [10 / 255, 10 / 255, 10 / 255];
const INK = [237 / 255, 237 / 255, 237 / 255];
const noop = () => {};
const ease = (cur, target, dt, tau) => cur + (target - cur) * (1 - Math.exp(-dt / tau));
const hash = (i) => { // integer -> 0..1
  let x = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
};

// readoutEl is unused (the hero readout was removed); the parameter stays for page.js (R4).
export function initField(canvas, readoutEl, stillImg) {
  const html = document.documentElement;
  let alive = true;
  let raf = 0;
  const fallback = () => {
    alive = false;
    cancelAnimationFrame(raf);
    html.dataset.field = 'still';
    if (stillImg) stillImg.hidden = false;
  };
  if (!canvas || new URLSearchParams(location.search).has('nogl')) return fallback();
  let gl = null;
  try {
    gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false });
  } catch { /* no WebGL2 */ }
  let prog = null;
  try {
    prog = gl && program(gl, VS, FS, ['aFrom', 'aTo', 'aSeed', 'aNFrom', 'aNTo']);
  } catch (e) {
    console.warn('field.js: shader failed, keeping the still image.', e.message);
  }
  if (!prog) return fallback();
  canvas.addEventListener('webglcontextlost', fallback);
  gl.clearColor(10 / 255, 10 / 255, 10 / 255, 1);
  gl.clear(gl.COLOR_BUFFER_BIT); // page colour behind the still until the first frame

  const reduce = html.dataset.motion === 'reduce'
    || reducedMotion(location.search, matchMedia('(prefers-reduced-motion: reduce)').matches);
  const coarse = matchMedia('(pointer: coarse)').matches;
  const small = coarse || innerWidth < 760;
  // bloom: three blurred half-size levels; small screens blur a single quarter-size one
  let glow = createGlow(gl, small ? { mips: 2, blurFrom: 1 } : { mips: 3, blurFrom: 0 });

  let want = html.dataset.state || 'solo'; // what the page asks for
  let shown = null;                        // {state, id} of the current morph target
  let performers = [], scale = 2, N = 0;
  let from, to, nFrom, nTo, seed, facing, bufs, vao, U;
  let soloId = 'violin', nextId = null, req = 0;
  let mixT = 1;            // morph time 0..1
  let rot = .35;           // yaw of the still image, so the hand-over from it is quiet
  let tiltX = 0, tiltY = 0;
  let t = 0;               // idle clock (stops under reduced motion)
  let clock = 0, last = 0; // wall clock, s; last frame, ms
  let vw = 1, vh = 1, dpr = 1;
  let hero = { cy: .5, ppu: 100 };
  const view = { cy: 0, ppu: 0, offX: 0 }; // figure centre on screen (CSS px), CSS px per unit, drift
  const mode = { attract: 0, fade: 0, drift: 0, alpha: .55 };
  let speed = 0, trailE = 0; // smoothed gesture strength, strongest live trail sample (0..1)
  const ptr = { x: 0, y: 0, px: 0, py: 0, on: false, touch: false };
  const samples = [];      // pointer trail, newest first: {x, y, at, s, j}
  const trail = new Float32Array(32), proj = new Float32Array(16), rotM = new Float32Array(9);

  /* ---------- data ---------- */

  // a target is {p, n}: positions and unit normals, N points each
  const cache = new Map();
  const bytes = (url) => fetch(url).then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); });
  const load = (id) => {
    if (!cache.has(id)) {
      const thin = (a) => (small ? subsample(a, 2) : a);
      cache.set(id, Promise.all([bytes(new URL(`${id}.bin`, POINTS)), bytes(new URL(`${id}.nrm`, POINTS))])
        .then(([b, n]) => ({ p: thin(decodePoints(b, scale)), n: thin(decodeNormals(n)) }))
        .catch((e) => { cache.delete(id); throw e; }));
    }
    return cache.get(id);
  };

  let ens = null;
  const ensembleSet = () => (ens ??= Promise.all(ENSEMBLE.map(load)).then((sets) => ({
    p: centreXZ(ensemble(sets.map((x) => x.p), sets.length, N)), // turn about the group's centre
    n: ensembleNormals(sets.map((x) => x.n), sets.length, N),
  })).catch((e) => { ens = null; throw e; }));

  const glyphs = new Map();
  let fonts = null;
  const glyph = (w) => {
    fonts ??= Promise.race([
      Promise.all([
        document.fonts?.ready,
        document.fonts?.load('600 200px "Figtree"', WORD),
      ]).catch(noop),
      new Promise((r) => setTimeout(r, 3000)), // then whatever sans-serif there is
    ]);
    if (!glyphs.has(w)) glyphs.set(w, fonts.then(() => rasterise(w)));
    return glyphs.get(w);
  };
  function rasterise(w) {
    const fs = 220;
    const font = `600 ${fs}px "Figtree", sans-serif`;
    const c = document.createElement('canvas');
    const x = c.getContext('2d', { willReadFrequently: true });
    x.font = font;
    c.width = Math.ceil(x.measureText(w).width + fs * .3);
    c.height = Math.ceil(fs * 1.4);
    x.font = font;
    x.fillStyle = '#fff';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillText(w, c.width / 2, c.height / 2);
    const px = x.getImageData(0, 0, c.width, c.height).data;
    const a = new Uint8Array(c.width * c.height);
    for (let i = 0; i < a.length; i++) a[i] = px[i * 4 + 3];
    // .9 units tall (at most 3.4 wide), centred, a little depth so it stays volumetric; facing the camera
    return { p: fitGlyph(glyphPoints(a, c.width, c.height, N, 11), .9, 3.4, 5), n: facing };
  }

  const pick = (not) => {
    const ids = performers.filter((p) => p.id !== not && p.id !== 'conductor').map((p) => p.id);
    return ids[Math.floor(Math.random() * ids.length)] ?? not;
  };

  /* ---------- state machine ---------- */

  async function go(state) {
    const my = ++req;
    const meta = { state, id: soloId };
    try {
      const tgt = await (state === 'day0' ? load('conductor')
        : state === 'reverie' ? ensembleSet()
          : state === 'babel' ? glyph(WORD)
            : load(soloId));
      if (my !== req || !alive) return;
      // already showing this target (e.g. solo -> day0 -> solo before the conductor arrived)
      const same = shown && shown.state === state && (state !== 'solo' || shown.id === meta.id);
      if (!same) morphTo(tgt, meta);
    } catch {
      // network or font failure: stay where we are; with nothing shown yet, keep the still
      if (!shown && my === req) fallback();
    }
  }

  function morphTo({ p: pts, n: nrm }, meta) {
    if (!shown) { // first target: condense out of a scattered cloud
      for (let i = 0; i < N; i++) {
        const j = i * 3, a = hash(i + N) * 6.2832, r = .3 + .9 * hash(i + 2 * N);
        from[j] = pts[j] + Math.cos(a) * r;
        from[j + 1] = pts[j + 1] + (hash(i + 3 * N) - .5) * 1.2;
        from[j + 2] = pts[j + 2] + Math.sin(a) * r;
      }
      nFrom.set(nrm.subarray(0, N * 3));
    } else if (mixT < 1) { // normals first: their progress reads the start positions
      blendNormals(nFrom, nFrom, nTo, from, seed, mixT);
      blendPoints(from, from, to, seed, mixT, reduce ? 0 : LIFT);
    } else {
      from.set(to);
      nFrom.set(nTo);
    }
    to.set(pts.subarray(0, N * 3));
    nTo.set(nrm.subarray(0, N * 3));
    for (const [b, data] of [[bufs.from, from], [bufs.to, to], [bufs.nFrom, nFrom], [bufs.nTo, nTo]]) {
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    }
    mixT = reduce ? 1 : 0;
    const first = !shown;
    shown = meta;
    // warm what comes next
    if (meta.state === 'day0') ensembleSet().catch(noop);
    if (meta.state === 'reverie') glyph(WORD).catch(noop);
    if (first) Object.assign(view, framing(meta.state));
    kick();
  }

  /* ---------- layout ---------- */

  function measure() {
    dpr = Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2);
    vw = canvas.clientWidth || innerWidth;
    vh = canvas.clientHeight || innerHeight;
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(...BG, 1);
    gl.clear(gl.COLOR_BUFFER_BIT); // a resized buffer is black, not the page colour
    if (glow && !glow.resize(canvas.width, canvas.height)) glow = null; // no render target: draw straight
    // hero: feet on the top of the title box, head 12% of the viewport below the header
    const box = document.querySelector('.hero__titlebox');
    const head = (document.querySelector('.top')?.getBoundingClientRect().bottom ?? 0) + vh * .12;
    const feet = Math.min(box ? box.getBoundingClientRect().top + scrollY : vh * .8, vh * .92);
    const hpx = Math.min(Math.max(feet - head, vh * .3), vw * 1.6);
    hero = { cy: feet - hpx / 2, ppu: hpx / 2 };
  }

  // where the figure centre sits on screen (cy, CSS px) and how many CSS px one unit spans
  function framing(state) {
    if (state === 'day0') return { cy: vh * .5, ppu: Math.min(vh * .36, vw * .8) };
    if (state === 'reverie') return { cy: vh * .52, ppu: Math.min(vh * .3, vw * .84 / 3.8) };
    if (state === 'babel') return { cy: vh * .5, ppu: Math.min(vh * .3, vw * .86 / 3.4) };
    return hero;
  }

  /* ---------- frame ---------- */

  function step(dt) {
    const st = shown.state;
    const E = (cur, target, tau) => (reduce ? target : ease(cur, target, dt, tau));
    if (!reduce) t += dt;
    if (mixT < 1) mixT = Math.min(1, mixT + dt / MORPH_S);

    // gesture strength from pointer speed, in viewport diagonals per second
    const v = Math.hypot(ptr.x - ptr.px, ptr.y - ptr.py) / Math.max(dt, .008) / Math.hypot(vw, vh);
    [ptr.px, ptr.py] = [ptr.x, ptr.y];
    const target = Math.min(v / 1.6, 1) * (reduce ? .45 : 1);
    speed = ease(speed, target, dt, target > speed ? .05 : .22);
    const s0 = samples[0];
    if (ptr.on && speed > .01 && (!s0 || Math.hypot(ptr.x - s0.x, ptr.y - s0.y) > 12)) {
      samples.unshift({ x: ptr.x, y: ptr.y, at: clock, s: speed, j: !!s0 && clock - s0.at < .25 });
      if (samples.length > 7) samples.pop();
    }

    // framing, rotation, per-state looks
    const f = framing(st);
    view.cy = E(view.cy, f.cy, .8);
    view.ppu = E(view.ppu, f.ppu, .8);
    mode.drift = E(mode.drift, st === 'reverie' && !reduce ? 1 : 0, 1.2);
    mode.attract = E(mode.attract, st === 'day0' ? 1 : 0, .4);
    mode.fade = E(mode.fade, st === 'reverie' ? 1 : 0, .8);
    mode.alpha = E(mode.alpha, ALPHA[st] ?? .55, .8);
    view.offX = mode.drift * .3 * Math.sin(t * 2 * Math.PI / 26);
    const sway = { babel: .3, reverie: .5 }[st]; // words and all five players stay readable:
    if (reduce) rot = sway ? 0 : .35;             // sway about the nearest front-facing turn
    else if (sway) {
      const base = Math.round(rot / (2 * Math.PI)) * 2 * Math.PI;
      rot = ease(rot, base + sway * Math.sin(t * .23), dt, 1.2);
    } else rot += dt * 2 * Math.PI / TURN_S;
    const tilt = ptr.on && !ptr.touch && !reduce;
    tiltY = E(tiltY, tilt ? (ptr.x / vw - .5) * 2 * TILT : 0, .6);
    tiltX = E(tiltX, tilt ? (ptr.y / vh - .5) * 2 * TILT : 0, .6);

    // trail uniforms: the cursor, then 7 samples fading over 1.2 s (day0: 2 s)
    const cursor = { x: ptr.x, y: ptr.y, s: ptr.on ? speed : 0, j: !!samples[0] && clock - samples[0].at < .25 };
    trailE = packTrail(trail, cursor, samples, clock, st === 'day0' ? 2 : 1.2,
      (x, y) => [(x - vw / 2) / view.ppu - view.offX, (view.cy - y) / view.ppu]);

    return speed > .003 || trailE > .003; // still settling (matters only under reduced motion)
  }

  function draw() {
    const D = camera(proj, vw, vh, view.cy, view.ppu, view.offX, TAN);
    rotation(rotM, rot + tiltY, tiltX);
    if (glow) glow.begin();
    else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clearColor(...BG, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.useProgram(prog);
    gl.bindVertexArray(vao);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    const k = Math.min(1, Math.max(.7, view.ppu / 180)); // small framings: smaller, brighter dots
    const floats = {
      uMix: mixT, uLift: reduce ? 0 : LIFT, uTime: t, uIdle: reduce ? 0 : 1, uDist: D,
      // without the glow there is no tone curve: its slope at low light is the exposure
      uTrailOn: mode.attract, uSize: LOOK.size * dpr * k, uAlpha: mode.alpha / k * (glow ? 1 : LOOK.exposure * .8), uFade: mode.fade,
      uDof: LOOK.dof * dpr * k, uFling: LOOK.fling * dpr * k,
    };
    for (const k in floats) gl.uniform1f(U[k], floats[k]);
    gl.uniform3fv(U.uColor, glow ? [1, 1, 1] : INK); // the glow composite applies the ink colour
    gl.uniformMatrix3fv(U.uRot, false, rotM);
    gl.uniformMatrix4fv(U.uProj, false, proj);
    gl.uniform4fv(U.uTrail, trail);
    gl.drawArrays(gl.POINTS, 0, N);
    glow?.end({ exposure: LOOK.exposure, strength: LOOK.bloom, bg: BG, ink: INK });
    if (html.dataset.field !== 'gl') {
      html.dataset.field = 'gl';
      setTimeout(() => { if (alive && stillImg) stillImg.hidden = true; }, 1500); // after the CSS fade
    }
  }

  function tick(now) {
    raf = 0;
    if (!alive || document.hidden || !shown) return;
    const dt = Math.min((now - last) / 1000, .05);
    last = now;
    clock = now / 1000;
    const busy = step(dt);
    draw();
    if (!reduce || busy) raf = requestAnimationFrame(tick);
  }
  function kick() {
    if (raf || !alive || document.hidden || !shown) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  /* ---------- events ---------- */

  addEventListener('ti:state', (e) => {
    const s = e.detail?.state;
    if (!s || s === want) return;
    want = s;
    if (N) go(s);
  });
  const setPtr = (x, y, touch) => {
    if (!ptr.on || touch !== ptr.touch) { ptr.px = x; ptr.py = y; } // no speed spike on the first sample
    Object.assign(ptr, { x, y, on: true, touch });
    kick();
  };
  addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') setPtr(e.clientX, e.clientY, false); }, { passive: true });
  addEventListener('touchstart', (e) => {
    const p = e.touches[0];
    if (p) { ptr.on = false; setPtr(p.clientX, p.clientY, true); }
  }, { passive: true });
  addEventListener('touchmove', (e) => { const p = e.touches[0]; if (p) setPtr(p.clientX, p.clientY, true); }, { passive: true });
  let down = null; // a press that turns into a drag is a gesture, not a click
  addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; }, { passive: true });
  addEventListener('click', (e) => {
    const dragged = down && Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 8;
    if (!shown || dragged || e.target.closest?.(INERT) || String(getSelection?.() ?? '')) return;
    if (want === 'solo' && shown.state === 'solo') {
      soloId = nextId ?? pick(soloId);
      nextId = pick(soloId);
      load(nextId).catch(noop); // prefetch the one after
      go('solo');
    }
  });
  let rt = 0;
  const relayout = () => { measure(); if (shown && reduce) Object.assign(view, framing(shown.state)); kick(); };
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(relayout, 150); }, { passive: true });
  document.fonts?.ready.then(relayout); // the hero title box can move once fonts are in
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else kick();
  });

  /* ---------- start ---------- */

  fetch(new URL('index.json', POINTS))
    .then((r) => r.json())
    .then((index) => {
      performers = index.performers;
      scale = index.scale;
      N = small ? Math.ceil(index.count / 2) : index.count;
      [from, to, nFrom, nTo] = [0, 0, 0, 0].map(() => new Float32Array(N * 3));
      seed = Float32Array.from({ length: N }, (_, i) => hash(i));
      facing = Float32Array.from({ length: N * 3 }, (_, j) => (j % 3 === 2 ? 1 : 0)); // glyph normals
      vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      const buf = (loc, size, data, usage) => {
        const b = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
        return b;
      };
      bufs = {
        from: buf(0, 3, from, gl.DYNAMIC_DRAW), to: buf(1, 3, to, gl.DYNAMIC_DRAW), seed: buf(2, 1, seed, gl.STATIC_DRAW),
        nFrom: buf(3, 3, nFrom, gl.DYNAMIC_DRAW), nTo: buf(4, 3, nTo, gl.DYNAMIC_DRAW),
      };
      U = Object.fromEntries(['uMix', 'uLift', 'uTime', 'uIdle', 'uRot', 'uProj', 'uDist', 'uTrail', 'uTrailOn',
        'uSize', 'uAlpha', 'uFade', 'uDof', 'uFling', 'uColor'].map((name) => [name, gl.getUniformLocation(prog, name)]));
      measure();
      soloId = performers[0]?.id ?? soloId;
      nextId = pick(soloId);
      go(want).then(() => load(nextId).catch(noop));
    })
    .catch(fallback);
}
