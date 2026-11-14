/*
 * The start-up animation, as the app plays it (its SplashName.tsx): "Dizzi" flicks through 24
 * faces in quick hard cuts, slows for the last few, and lands on Chango with its play-button
 * D; a beat later "TV" slides in beside it, the mark rises above and the Z cuts through it.
 * Then the screen fades, the name and the mark fly up into their places in the bar, and the
 * page rises in behind them.
 *
 * When the site is opened (the page's <head> decides, before anything is drawn), never with
 * reduced motion, and a click, a key or Skip ends it at once. The bar's and footer's names are lined
 * up here too, whether it plays or not.
 */
(() => {
  const html = document.documentElement;
  const screen = document.querySelector('.intro-screen');

  /** One gradient across the D and the letters after it, as if they were one shape. */
  const sync = (lock) => {
    const d = lock.querySelector('.lk-d');
    const word = lock.querySelector('.lk-word');
    if (!d || !word) return;
    const parts = [d, word].filter((el) => el.offsetWidth);
    const x0 = Math.min(...parts.map((el) => el.offsetLeft));
    const y0 = Math.min(...parts.map((el) => el.offsetTop));
    const W = Math.max(...parts.map((el) => el.offsetLeft + el.offsetWidth)) - x0;
    const H = Math.max(...parts.map((el) => el.offsetTop + el.offsetHeight)) - y0;
    for (const el of parts) {
      el.style.backgroundSize = `${W}px ${H}px`;
      el.style.backgroundPosition = `${x0 - el.offsetLeft}px ${y0 - el.offsetTop}px`;
    }
  };
  const syncAll = () => document.querySelectorAll('.bar .lockup, footer .lockup').forEach(sync);
  document.fonts.load('400 24px "Chango"', 'izzi').catch(() => {}).then(syncAll);
  addEventListener('resize', syncAll);
  syncAll();

  const done = () => window.dispatchEvent(new Event('dizzitv:intro-done'));
  if (!screen || !html.classList.contains('intro')) return done();
  scrollTo(0, 0);

  const lock = screen.querySelector('.intro-name .lockup');
  const word = lock.querySelector('.lk-word');
  const tvWrap = lock.querySelector('.lk-tvwrap');
  const tv = lock.querySelector('.lk-tv');

  // The faces, by kind: the flick takes one from each kind in turn, so no two in a row look alike.
  const KINDS = [
    [['Pacifico', 400], ['Kaushan Script', 400], ['Yellowtail', 400], ['Dancing Script', 700], ['Permanent Marker', 400]],
    [['Shrikhand', 400], ['Bungee', 400], ['Bangers', 400], ['Anton', 400], ['Alfa Slab One', 400], ['Black Ops One', 400]],
    [['Monoton', 400], ['Bungee Shade', 400], ['Limelight', 400], ['Rye', 400], ['Creepster', 400], ['Cinzel Decorative', 700]],
    [['Press Start 2P', 400], ['Silkscreen', 400], ['Orbitron', 800], ['Major Mono Display', 400], ['Special Elite', 400]],
    [['Playfair Display', 900, true], ['Cormorant Garamond', 700, true]],
  ];
  const ALL = KINDS.flat();
  const LAND = ['Chango', 400];
  const START_MS = 350, STEP_MS = 70, LAST_MS = [100, 140, 190, 250], LOAD_MS = 2500;
  /** From landing to handing over: "TV" in, the mark up and cut, a beat to see it. */
  const HOLD_MS = 3000;
  const FLY_MS = 950;

  const fontOf = ([f, w, it]) => `${it ? 'italic ' : ''}${w} 100px "${f}"`;

  function order() {
    const pools = KINDS.map((k) => [...k].sort(() => Math.random() - 0.5));
    const out = [];
    let last = -1;
    while (pools.some((p) => p.length)) {
      const left = pools.map((_, i) => i).filter((i) => pools[i].length);
      const open = left.filter((i) => i !== last);
      const pick = open.length ? open : left;
      pick.sort((a, b) => pools[b].length - pools[a].length + (Math.random() - 0.5));
      last = pick[0];
      out.push(pools[last].pop());
    }
    return out;
  }

  /** Each face's size relative to Chango's, so the flick changes style without jumping in size. */
  function scales(text) {
    const ctx = document.createElement('canvas').getContext('2d');
    const out = new Map();
    if (!ctx) return out;
    const box = (face) => {
      ctx.font = fontOf(face);
      const m = ctx.measureText(text);
      const w = (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || m.width);
      const h = (m.actualBoundingBoxAscent || 70) + (m.actualBoundingBoxDescent || 0);
      return { w: Math.max(w, 1), h: Math.max(h, 1) };
    };
    const land = box(LAND);
    for (const face of ALL) {
      const b = box(face);
      let s = Math.sqrt((land.w * land.h) / (b.w * b.h));
      s = Math.min(s, (land.w * 1.2) / b.w, (land.h * 1.35) / b.h);
      out.set(face[0], Math.max(0.45, Math.min(1.8, s)));
    }
    return out;
  }

  const set = ([f, w, it], s = 1) => {
    word.style.fontFamily = `'${f}', var(--display)`;
    word.style.fontWeight = String(w);
    word.style.fontStyle = it ? 'italic' : 'normal';
    word.style.fontSize = `${s.toFixed(3)}em`;
  };

  let timer = 0, holdTimer = 0, landed = false, over = false;

  // The landed name: Chango, the D in place of Chango's, the room for "TV" open.
  const land = (animate) => {
    if (landed) return;
    landed = true;
    clearTimeout(timer);
    set(LAND);
    word.textContent = 'izzi';
    screen.classList.add('landed');
    if (!animate) screen.classList.add('still');
    sync(lock);
    tvWrap.style.width = `${tv.offsetWidth + parseFloat(getComputedStyle(tv).marginLeft || '0')}px`;
    holdTimer = setTimeout(handOver, animate ? HOLD_MS : 0);
  };

  /** Moves `fly` so that `from` (inside it) lands on `to`, scaled to its size. */
  const flyTo = (fly, from, to) => {
    const a = from.getBoundingClientRect(), b = to.getBoundingClientRect(), f = fly.getBoundingClientRect();
    if (!a.width || !b.width) return;
    const s = b.width / a.width;
    fly.style.transformOrigin = `${a.left - f.left}px ${a.top - f.top}px`;
    fly.style.transform = `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${s})`;
  };

  function handOver() {
    if (over) return;
    over = true;
    clearTimeout(timer);
    clearTimeout(holdTimer);
    syncAll();
    const brand = document.querySelector('.bar .brand');
    screen.classList.add('leaving');
    // Ends any animation still running (a skip), so it flies from where it is.
    screen.classList.add('still');
    const logoFly = screen.querySelector('.intro-logo .fly');
    flyTo(logoFly, logoFly.querySelector('.zmark'), brand.querySelector('.zmark'));
    flyTo(screen.querySelector('.intro-name .fly'), lock, brand.querySelector('.lockup'));
    done();
    setTimeout(() => {
      html.classList.remove('intro');
      screen.remove();
    }, FLY_MS);
  }

  // A click, a key or Skip: straight to the finished name, then away.
  const skip = () => {
    if (!landed) land(false);
    else handOver();
  };
  screen.addEventListener('click', skip);
  addEventListener('keydown', function k(e) {
    if (over) return removeEventListener('keydown', k);
    if (e.key !== 'Tab') skip();
  });

  set(LAND);
  const t0 = performance.now();
  const faces = order();
  const loaded = Promise.all([LAND, ...ALL].map((f) => document.fonts.load(fontOf(f), 'Dizzi').catch(() => [])));
  const late = new Promise((r) => setTimeout(() => r('late'), LOAD_MS));
  Promise.race([loaded.then(() => 'ok'), late]).then((got) => {
    if (landed) return;
    // Without the faces in time, no flick: the name just lands, and the rest plays as usual.
    if (got !== 'ok') return land(true);
    const size = scales('Dizzi');
    const show = (f) => set(f, size.get(f[0]));
    show(faces[0]);
    let i = 1;
    const step = () => {
      if (landed) return;
      if (i >= faces.length) return land(true);
      show(faces[i]);
      const fromEnd = faces.length - i;
      i++;
      timer = setTimeout(step, fromEnd <= LAST_MS.length ? LAST_MS[LAST_MS.length - fromEnd] : STEP_MS);
    };
    timer = setTimeout(step, Math.max(0, START_MS + STEP_MS - (performance.now() - t0)));
  });
})();
