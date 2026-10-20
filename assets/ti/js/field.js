// The point field behind /transinstrumentalism/: orchestral performers as white point
// clouds on one fixed WebGL2 canvas. page.js imports this module and calls initField();
// the state follows html[data-state] on load, then window 'ti:state' events.
// html[data-field] = 'gl' while the canvas runs, 'still' when the fallback image stays.
// Pure maths (decoding, ensemble, glyphs, the CPU morph mirror) lives in field-math.js.

import {
  decodePoints, subsample, ensemble, glyphPoints, reducedMotion, blendPoints, MORPH_SPREAD,
  fitGlyph, centreXZ, readoutText, packTrail, camera, rotation,
} from './field-math.js';

const VS = `#version 300 es
precision highp float;
in vec3 aFrom;           // morph start (a blended snapshot when a morph is interrupted)
in vec3 aTo;             // morph target
in float aSeed;          // per-point random 0..1
uniform float uMix;      // morph time 0..1 (1 = settled on aTo)
uniform float uLift;     // mid-flight lift off the path, units (0 under reduced motion)
uniform float uTime;     // seconds (frozen under reduced motion)
uniform float uIdle;     // breathing + dust weight (0 under reduced motion)
uniform mat3 uRot;       // turn about y, then the parallax tilt
uniform mat4 uProj;      // perspective * camera offset (figure centre at z = -uDist)
uniform float uDist;     // camera distance to the figure centre, units
uniform vec4 uTrail[8];  // pointer trail, newest first: xy figure-plane units, z strength, w 1 = joined to the next
uniform float uTrailOn;  // 0 = the trail pushes points away, 1 = it pulls them onto the path (day0)
uniform float uSize;     // dot diameter in device px at the figure centre
uniform float uAlpha;    // dot alpha
uniform float uFade;     // depth fade (reverie): far points dimmer
out float vAlpha;
const float SPREAD = ${MORPH_SPREAD.toFixed(3)};
void main() {
  // morph; blendPoints() in field-math.js mirrors these lines on the CPU
  float h = clamp((aFrom.y + 1.) * .5, 0., 1.);
  float u = clamp((uMix - (.5 * aSeed + .5 * (1. - h)) * SPREAD) / (1. - SPREAD), 0., 1.);
  float e = u * u * (3. - 2. * u);
  vec3 p = aFrom + (aTo - aFrom) * e;
  float l = sin(3.14159265 * e) * uLift * (.5 + aSeed);
  p += vec3(p.x * .6 + cos(aSeed * 81.7) * .4, .55 + .45 * sin(aSeed * 53.1), p.z * .6 + sin(aSeed * 81.7) * .4) * l;
  // always mid-process: breathing, and ~2.5% of the points lifting off like dust
  float t = uTime;
  p += uIdle * .006 * sin(vec3(t * .7 + aSeed * 91. + p.y * 4., t * .9 + aSeed * 57. + p.z * 4., t * .8 + aSeed * 23. + p.x * 4.));
  float dust = step(fract(aSeed * 37.31), .025) * pow(max(0., sin(t * (.45 + .4 * fract(aSeed * 13.7)) + aSeed * 40.)), 3.);
  p += uIdle * dust * .15 * vec3(p.x * 1.2, 1., p.z * 1.2);
  vec3 q = uRot * p;
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
  q.xy += d / max(F, 1.);
  q.z *= 1. - .7 * uTrailOn * min(F, 1.);
  gl_Position = uProj * vec4(q, 1.);
  float depth = uDist - q.z;
  gl_PointSize = uSize * uDist / depth;
  vAlpha = uAlpha * (1. - uFade * clamp((depth - uDist + .8) / 3., 0., .75));
}`;

const FS = `#version 300 es
precision mediump float;
in float vAlpha;
uniform vec3 uColor;     // dot colour (#EDEDED)
out vec4 o;
void main() {
  float a = vAlpha * (1. - smoothstep(.35, 1., length(gl_PointCoord - .5) * 2.));
  o = vec4(uColor * a, a);
}`;

const POINTS = new URL('../points/', import.meta.url);
const TAN = Math.tan(35 / 2 * Math.PI / 180); // vertical fov 35 deg
const MORPH_S = 1.8;    // morph duration, s
const LIFT = .25;       // mid-morph lift, units
const TURN_S = 60;      // one turn about y, s
const TILT = .12;       // parallax tilt toward the pointer, rad
const WORD_S = 4.5;     // babel: a new word every ...
const WORDS = ['BABEL', 'バベル', '/ˈbeɪbəl/', 'bable?'];
const ENSEMBLE = ['violin', 'cello', 'flute', 'clarinet', 'harp'];
const INERT = 'a, button, input, select, textarea, label, summary, iframe, video, [data-yt]';
const ALPHA = { solo: .55, day0: .55, reverie: .5, babel: .5 };
const noop = () => {};
const ease = (cur, target, dt, tau) => cur + (target - cur) * (1 - Math.exp(-dt / tau));
const hash = (i) => { // integer -> 0..1
  let x = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
};

function link(gl) {
  const p = gl.createProgram();
  for (const [type, src] of [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, FS]]) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    gl.attachShader(p, s);
  }
  ['aFrom', 'aTo', 'aSeed'].forEach((name, i) => gl.bindAttribLocation(p, i, name));
  gl.linkProgram(p);
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}

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
  const prog = gl && link(gl);
  if (!prog) return fallback();
  canvas.addEventListener('webglcontextlost', fallback);
  gl.clearColor(10 / 255, 10 / 255, 10 / 255, 1);
  gl.clear(gl.COLOR_BUFFER_BIT); // page colour behind the still until the first frame

  const reduce = html.dataset.motion === 'reduce'
    || reducedMotion(location.search, matchMedia('(prefers-reduced-motion: reduce)').matches);
  const coarse = matchMedia('(pointer: coarse)').matches;
  const small = coarse || innerWidth < 760;
  const [outEn, outJa] = ['.l-en', '.l-ja'].map((q) => readoutEl?.querySelector(q));

  let want = html.dataset.state || 'solo'; // what the page asks for
  let shown = null;                        // {state, id, word} of the current morph target
  let performers = [], scale = 2, N = 0;
  let from, to, seed, bFrom, bTo, U;
  let soloId = 'violin', nextId = null, word = 0, wordAt = 0, req = 0;
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
  let readAt = 0, readText = '';

  /* ---------- data ---------- */

  const cache = new Map();
  const load = (id) => {
    if (!cache.has(id)) {
      cache.set(id, fetch(new URL(`${id}.bin`, POINTS))
        .then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then((b) => { const p = decodePoints(b, scale); return small ? subsample(p, 2) : p; })
        .catch((e) => { cache.delete(id); throw e; }));
    }
    return cache.get(id);
  };

  let ens = null;
  const ensembleSet = () => (ens ??= Promise.all(ENSEMBLE.map(load))
    .then((sets) => centreXZ(ensemble(sets, sets.length, N))) // turn about the group's centre
    .catch((e) => { ens = null; throw e; }));

  const glyphs = new Map();
  let fonts = null;
  const glyph = (w) => {
    fonts ??= Promise.race([
      Promise.all([
        document.fonts?.ready,
        document.fonts?.load('600 200px "Instrument Sans"', 'BABEL bable? /ˈbeɪbəl/'),
        document.fonts?.load('500 200px "IBM Plex Sans JP"', 'バベル'),
      ]).catch(noop),
      new Promise((r) => setTimeout(r, 3000)), // then whatever sans-serif there is
    ]);
    if (!glyphs.has(w)) glyphs.set(w, fonts.then(() => rasterise(w)));
    return glyphs.get(w);
  };
  function rasterise(w) {
    const fs = 220;
    const kana = [...w].some((ch) => ch.codePointAt(0) >= 0x3040 && ch.codePointAt(0) <= 0x30ff);
    const font = kana ? `500 ${fs}px "IBM Plex Sans JP", sans-serif` : `600 ${fs}px "Instrument Sans", sans-serif`;
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
    // .9 units tall (at most 3.4 wide), centred, a little depth so it stays volumetric
    return fitGlyph(glyphPoints(a, c.width, c.height, N, 11 + WORDS.indexOf(w)), .9, 3.4, 5);
  }

  const pick = (not) => {
    const ids = performers.filter((p) => p.id !== not && p.id !== 'conductor').map((p) => p.id);
    return ids[Math.floor(Math.random() * ids.length)] ?? not;
  };

  /* ---------- state machine ---------- */

  async function go(state) {
    const my = ++req;
    const meta = { state, id: soloId, word };
    try {
      const pts = await (state === 'day0' ? load('conductor')
        : state === 'reverie' ? ensembleSet()
          : state === 'babel' ? glyph(WORDS[word])
            : load(soloId));
      if (my === req && alive) morphTo(pts, meta);
    } catch { /* network or font failure: stay where we are */ }
  }

  function morphTo(pts, meta) {
    if (!shown) { // first target: condense out of a scattered cloud
      for (let i = 0; i < N; i++) {
        const j = i * 3, a = hash(i + N) * 6.2832, r = .3 + .9 * hash(i + 2 * N);
        from[j] = pts[j] + Math.cos(a) * r;
        from[j + 1] = pts[j + 1] + (hash(i + 3 * N) - .5) * 1.2;
        from[j + 2] = pts[j + 2] + Math.sin(a) * r;
      }
    } else if (mixT < 1) blendPoints(from, from, to, seed, mixT, reduce ? 0 : LIFT);
    else from.set(to);
    to.set(pts.subarray(0, N * 3));
    for (const [b, data] of [[bFrom, from], [bTo, to]]) {
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    }
    mixT = reduce ? 1 : 0;
    const first = !shown;
    shown = meta;
    if (meta.state === 'babel') wordAt = clock;
    // warm what comes next
    if (meta.state === 'day0') ensembleSet().catch(noop);
    if (meta.state === 'reverie' || meta.state === 'babel') glyph(WORDS[(meta.word + (meta.state === 'babel')) % WORDS.length]).catch(noop);
    if (first) Object.assign(view, framing(meta.state));
    kick();
  }

  function nextWord() {
    word = (word + 1) % WORDS.length;
    wordAt = clock;
    go('babel');
  }

  /* ---------- layout ---------- */

  function measure() {
    dpr = Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2);
    vw = canvas.clientWidth || innerWidth;
    vh = canvas.clientHeight || innerHeight;
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT); // a resized buffer is black, not the page colour
    // hero: feet on the top of the title box (narrow screens: of the readout, which then
    // spans the width under the figure), head 12% of the viewport below the header
    const box = document.querySelector(vw < 760 ? '.hero__meta' : '.hero__titlebox');
    const head = (document.querySelector('.top')?.getBoundingClientRect().bottom ?? 0) + vh * .12;
    const feet = Math.min(box ? box.getBoundingClientRect().top + scrollY - (vw < 760 ? 10 : 0) : vh * .8, vh * .92);
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

    if (!reduce && st === 'babel' && want === 'babel' && clock - wordAt > WORD_S) nextWord();
    return speed > .003 || trailE > .003; // still settling (matters only under reduced motion)
  }

  function draw() {
    const D = camera(proj, vw, vh, view.cy, view.ppu, view.offX, TAN);
    rotation(rotM, rot + tiltY, tiltX);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const floats = {
      uMix: mixT, uLift: reduce ? 0 : LIFT, uTime: t, uIdle: reduce ? 0 : 1, uDist: D,
      uTrailOn: mode.attract, uSize: 1.6 * dpr, uAlpha: mode.alpha, uFade: mode.fade,
    };
    for (const k in floats) gl.uniform1f(U[k], floats[k]);
    gl.uniformMatrix3fv(U.uRot, false, rotM);
    gl.uniformMatrix4fv(U.uProj, false, proj);
    gl.uniform4fv(U.uTrail, trail);
    gl.drawArrays(gl.POINTS, 0, N);
    if (html.dataset.field !== 'gl') {
      html.dataset.field = 'gl';
      setTimeout(() => { if (alive && stillImg) stillImg.hidden = true; }, 1500); // after the CSS fade
    }
  }

  function readout(now, force) {
    if (!readoutEl || (!force && now - readAt < 100)) return;
    readAt = now;
    const i = performers.findIndex((p) => p.id === shown.id), p = performers[i] ?? { en: '', ja: '' };
    const [en, ja] = readoutText(shown.state, {
      no: i + 1, total: performers.length, en: p.en, ja: p.ja,
      morph: 1 - mixT,     // counts down: 1.00 as a morph starts, .00 when settled
      scatter: speed, gesture: speed, trail: trailE,
      count: ENSEMBLE.length, drift: .5 + .5 * Math.sin(t * 2 * Math.PI / 26) * mode.drift,
      word: WORDS[shown.word], misrec: Math.sin(Math.PI * mixT), // break-apart amount
    });
    if (en + ja === readText) return;
    readText = en + ja;
    if (outEn && outJa) {
      outEn.textContent = en;
      outJa.textContent = ja;
    } else readoutEl.textContent = html.dataset.lang === 'ja' ? ja : en;
  }

  function tick(now) {
    raf = 0;
    if (!alive || document.hidden || !shown) return;
    const dt = Math.min((now - last) / 1000, .05);
    last = now;
    clock = now / 1000;
    const busy = step(dt);
    draw();
    const more = !reduce || busy;
    readout(now, !more);
    if (more) raf = requestAnimationFrame(tick);
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
    } else if (want === 'babel' && shown.state === 'babel') nextWord();
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
      [from, to] = [new Float32Array(N * 3), new Float32Array(N * 3)];
      seed = Float32Array.from({ length: N }, (_, i) => hash(i));
      gl.useProgram(prog);
      gl.bindVertexArray(gl.createVertexArray());
      const buf = (loc, size, data, usage) => {
        const b = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
        return b;
      };
      bFrom = buf(0, 3, from, gl.DYNAMIC_DRAW);
      bTo = buf(1, 3, to, gl.DYNAMIC_DRAW);
      buf(2, 1, seed, gl.STATIC_DRAW);
      U = Object.fromEntries(['uMix', 'uLift', 'uTime', 'uIdle', 'uRot', 'uProj', 'uDist', 'uTrail', 'uTrailOn', 'uSize', 'uAlpha', 'uFade', 'uColor']
        .map((name) => [name, gl.getUniformLocation(prog, name)]));
      gl.uniform3f(U.uColor, 237 / 255, 237 / 255, 237 / 255);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      measure();
      soloId = performers[0]?.id ?? soloId;
      nextId = pick(soloId);
      go(want).then(() => load(nextId).catch(noop));
    })
    .catch(fallback);
}
