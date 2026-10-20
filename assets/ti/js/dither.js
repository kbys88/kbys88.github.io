// Dither tiles: a 1-bit image with its greyscale original behind a radial mask.
// ti.css owns the mask (radius --rr, centre --rx/--ry, both measured from the
// image's top-left) and the .is-active state; this file only moves the centre.
//
//   fine pointer  the mask follows the pointer while it is over the tile
//   touch         the mask sits where the viewport's horizontal centre line
//                 crosses the tile, so scrolling "scans" the picture; skipped
//                 under reduced motion because it is scroll-linked movement
//
// Nothing runs while idle: every handler only schedules one rAF.

export function initDither(root = document, { reduced = false } = {}) {
  const figs = [...root.querySelectorAll('figure.dither')];
  if (!figs.length) return;

  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const box = new Map(figs.map((f) => [f, f.querySelector('.dither__d') || f]));
  const visible = new Set();
  let hovered = null;
  let cx = 0;
  let cy = 0;
  let queued = false;

  const setCentre = (fig, x, y) => {
    fig.style.setProperty('--rx', `${x.toFixed(1)}px`);
    fig.style.setProperty('--ry', `${y.toFixed(1)}px`);
  };

  const frame = () => {
    queued = false;
    if (fine.matches) {
      if (!hovered) return;
      const r = box.get(hovered).getBoundingClientRect();
      setCentre(hovered, cx - r.left, cy - r.top);
      return;
    }
    if (reduced || !visible.size) return;
    const mid = innerHeight / 2;
    const rects = [...visible].map((fig) => [fig, box.get(fig).getBoundingClientRect()]);
    for (const [fig, r] of rects) {
      const crossing = r.top <= mid && mid <= r.bottom;
      if (crossing) setCentre(fig, r.width / 2, mid - r.top);
      fig.classList.toggle('is-active', crossing);
    }
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(frame);
    }
  };

  /* fine pointer */
  const onPoint = (fig) => (e) => {
    if (!fine.matches || e.pointerType === 'touch') return;
    hovered = fig;
    cx = e.clientX;
    cy = e.clientY;
    fig.classList.add('is-active');
    schedule();
  };
  const onLeave = (fig) => () => {
    if (hovered === fig) hovered = null;
    if (fine.matches) fig.classList.remove('is-active');
  };
  for (const fig of figs) {
    const move = onPoint(fig);
    fig.addEventListener('pointerenter', move, { passive: true });
    fig.addEventListener('pointermove', move, { passive: true });
    fig.addEventListener('pointerleave', onLeave(fig), { passive: true });
    fig.addEventListener('pointercancel', onLeave(fig), { passive: true });
  }

  /* touch: follow the scroll position; also keeps a stationary mouse registered
     when the page scrolls under it */
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) visible.add(target);
        else {
          visible.delete(target);
          if (!fine.matches) target.classList.remove('is-active');
        }
      }
      schedule();
    });
    figs.forEach((fig) => io.observe(fig));
  }

  // a 2-in-1 switching between mouse and touch: drop stale reveals
  fine.addEventListener?.('change', () => {
    hovered = null;
    figs.forEach((fig) => fig.classList.remove('is-active'));
    schedule();
  });
}
