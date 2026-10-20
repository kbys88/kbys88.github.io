// /transinstrumentalism/ page behaviour. No dependencies; the markup contract
// (class, id and data-attribute names) is in transinstrumentalism/index.html.
//
// Events dispatched on window:
//   ti:state  {state: 'solo'|'day0'|'reverie'|'babel'}  the section under the viewport's
//             centre line changed (also once on load). html[data-state] mirrors it, for
//             modules that load after the first event.
//   ti:lang   {lang: 'en'|'ja'}                         the visitor switched language.
//             html[data-lang] is the source of truth on load.

import { initDither } from './dither.js';
import { pickLang, revealProgress, reducedMotion } from './field-math.js';

const html = document.documentElement;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const noop = () => {};

const reduce = reducedMotion(location.search, matchMedia('(prefers-reduced-motion: reduce)').matches);
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
if (reduce) html.dataset.motion = 'reduce';

/* ---------- language ---------- */

const readStoredLang = () => {
  try { return localStorage.getItem('ti-lang'); } catch { return null; }
};

const ytTitle = (name, lang) => (lang === 'ja' ? `${name} の動画（YouTube）` : `${name} — video (YouTube)`);

function applyLang(lang) {
  html.dataset.lang = lang;
  html.lang = lang;
  for (const b of $$('button[data-set-lang]')) {
    b.setAttribute('aria-pressed', String(b.dataset.setLang === lang));
  }
  for (const f of $$('iframe[data-yt-name]')) f.title = ytTitle(f.dataset.ytName, lang);
}

// ?lang=ja for Japanese, no lang param for English; other params and the hash are kept as written
function writeLangToUrl(lang) {
  const parts = location.search.slice(1).split('&').filter((p) => p && p.split('=')[0] !== 'lang');
  if (lang === 'ja') parts.push('lang=ja');
  const url = location.pathname + (parts.length ? `?${parts.join('&')}` : '') + location.hash;
  try { history.replaceState(history.state, '', url); } catch { /* sandboxed frame: leave the URL */ }
}

function setLang(lang) {
  const changed = html.dataset.lang !== lang;
  applyLang(lang);
  try { localStorage.setItem('ti-lang', lang); } catch { /* private mode */ }
  writeLangToUrl(lang);
  if (changed) window.dispatchEvent(new CustomEvent('ti:lang', { detail: { lang } }));
}

applyLang(pickLang(location.search, readStoredLang()));
for (const b of $$('button[data-set-lang]')) b.addEventListener('click', () => setLang(b.dataset.setLang));

/* ---------- section state (ti:state) ---------- */

function initState() {
  const sections = $$('[data-state]');
  if (!sections.length || !('IntersectionObserver' in window)) return;
  const live = new Set();
  let current = null;

  const emit = (state) => {
    if (state === current) return;
    current = state;
    html.dataset.state = state;
    window.dispatchEvent(new CustomEvent('ti:state', { detail: { state } }));
  };
  // the section whose box contains the centre line; if two touch it, the later one in the page
  const underLine = () => sections.reduce((s, el) => (live.has(el) ? el.dataset.state : s), null);
  // load position inside a gap between sections: the last section that starts above the line
  const above = () => {
    const mid = innerHeight / 2;
    return sections.reduce((s, el) => (el.getBoundingClientRect().top <= mid ? el.dataset.state : s), sections[0].dataset.state);
  };

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) (e.isIntersecting ? live.add(e.target) : live.delete(e.target));
    emit(underLine() ?? current ?? above());
  }, { rootMargin: '-50% 0px -50% 0px' });
  sections.forEach((el) => io.observe(el));
}

/* ---------- statement reveal ---------- */

function initReveal() {
  const lines = $$('[data-reveal-line]');
  if (!lines.length || reduce) return; // --p stays unset: full ink
  const shown = new Array(lines.length).fill('');
  let queued = false;

  const update = () => {
    queued = false;
    const vh = innerHeight;
    const rects = lines.map((l) => l.getBoundingClientRect());
    lines.forEach((l, i) => {
      const p = revealProgress(rects[i].top, rects[i].height, vh).toFixed(3);
      if (p !== shown[i]) {
        shown[i] = p;
        l.style.setProperty('--p', p);
      }
    });
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('ti:lang', schedule); // JA lines wrap differently
  document.fonts?.ready.then(schedule);
  update();
}

/* ---------- hero title: width follows the pointer ---------- */

// The title is fitted to the page at wdth 88, so 88 (left of the screen) is the widest it
// gets and 75 (right) the narrowest.
function initTitle() {
  const title = $('.hero-title');
  const hero = $('.hero');
  if (!title || !hero || reduce || !finePointer) return;
  const WIDE = 88;
  const NARROW = 75;
  const TAU = 140; // ms: ease time constant
  let cur = WIDE;
  let target = WIDE;
  let inView = true;
  let running = false;
  let last = 0;

  const tick = (now) => {
    const dt = Math.max(0, Math.min(now - last, 64));
    last = now;
    const d = target - cur;
    cur = Math.abs(d) < .02 ? target : cur + d * (1 - Math.exp(-dt / TAU));
    title.style.setProperty('--wdth', cur.toFixed(2));
    if (cur !== target && inView) requestAnimationFrame(tick);
    else running = false;
  };
  const kick = () => {
    if (running || !inView || cur === target) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(tick);
  };

  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    target = WIDE - (e.clientX / innerWidth) * (WIDE - NARROW);
    kick();
  }, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      kick();
    }).observe(hero);
  }
}

/* ---------- series index: thumbnail follows the pointer ---------- */

function initThumb() {
  const thumb = $('.idx-thumb');
  const list = $('.idx');
  const rows = $$('.idx-row[data-thumb]');
  if (!thumb || !list || !rows.length || !finePointer) return;
  const GAP = 24;
  let x = 0;
  let y = 0;
  let w = 0;
  let h = 0;
  let queued = false;

  const measure = () => {
    w = thumb.offsetWidth;
    h = w * (thumb.naturalWidth ? thumb.naturalHeight / thumb.naturalWidth : 9 / 16);
  };
  const place = () => {
    queued = false;
    let tx = x + GAP;
    if (tx + w > innerWidth - 8) tx = x - GAP - w; // flip to the left of the pointer at the right edge
    const ty = Math.max(8, Math.min(innerHeight - h - 8, y - h / 2));
    thumb.style.setProperty('--tx', `${tx.toFixed(1)}px`);
    thumb.style.setProperty('--ty', `${ty.toFixed(1)}px`);
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(place);
    }
  };

  thumb.addEventListener('load', () => {
    measure();
    schedule();
  });
  list.addEventListener('pointerenter', () => { // warm the cache once
    for (const r of rows) new Image().src = r.dataset.thumb;
  }, { once: true, passive: true });

  for (const row of rows) {
    row.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch') return;
      if (!thumb.src.endsWith(row.dataset.thumb)) thumb.src = row.dataset.thumb;
      measure();
      x = e.clientX;
      y = e.clientY;
      place();
      thumb.classList.add('is-visible');
    }, { passive: true });
    row.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      x = e.clientX;
      y = e.clientY;
      schedule();
    }, { passive: true });
    row.addEventListener('pointerleave', () => thumb.classList.remove('is-visible'), { passive: true });
  }
}

/* ---------- YouTube facade ---------- */

function initFacades() {
  for (const btn of $$('button.yt[data-yt]')) {
    btn.addEventListener('click', () => {
      const id = btn.dataset.yt;
      if (!/^[\w-]{6,20}$/.test(id)) return;
      // "Play video — Day 0" -> "Day 0"
      const label = $('.yt__label .l-en', btn)?.textContent ?? '';
      const name = label.split('—').pop().trim() || 'YouTube';

      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      frame.dataset.ytName = name;
      frame.title = ytTitle(name, html.dataset.lang);
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      btn.replaceWith(frame);
      frame.focus();
    }, { once: true });
  }
}

/* ---------- RêVeRie loop: plays only near the viewport ---------- */

function initLoop() {
  const video = $('.loop__v');
  if (!video || reduce || !('IntersectionObserver' in window)) return; // reduced: poster only
  new IntersectionObserver((entries) => {
    if (entries[entries.length - 1].isIntersecting) video.play()?.catch(noop);
    else video.pause();
  }, { rootMargin: '200px 0px' }).observe(video);
}

/* ---------- go ---------- */

initState();
initReveal();
initTitle();
initThumb();
initFacades();
initLoop();
initDither(document, { reduced: reduce });

// The point field is its own module (loaded last, and optional: the still image stays if it
// is missing or throws).
import('./field.js')
  .then((m) => m.initField($('#field'), $('#readout'), $('.field-still')))
  .catch(noop);
