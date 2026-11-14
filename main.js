/*
 * The page works without this file: every download button already links to the latest
 * build. This adds: the big download button offers the build for the device you are on, with
 * the others a click away beside it; and the page coming in as it's scrolled, with the bar
 * along the top.
 */
(() => {
  const repo = document.body.dataset.repo;
  const FILES = {
    // The installer. A release from before there was one has only the app itself (was).
    windows: { file: 'stream-thing-windows.msi', was: 'stream-thing-windows.exe', label: 'Download for Windows' },
    android: { file: 'stream-thing-android.apk', label: 'Download for Android' },
    tv: { file: 'stream-thing-android-tv.apk', label: 'Download for Android TV' },
    samsung: { file: 'stream-thing-samsung-tv.wgt', label: 'Download for Samsung TV' },
    lg: { file: 'stream-thing-lg-tv.ipk', label: 'Download for LG TV' },
  };
  // GitHub answers this with a redirect to the newest release's file, sent as an
  // attachment, so the browser downloads it and the page stays where it is.
  const link = (kind, file = FILES[kind].file) => `https://github.com/${repo}/releases/latest/download/${file}`;

  /** Which build suits this device, or null when there isn't one (iPhone, Mac, Linux). */
  function detect() {
    const ua = navigator.userAgent;
    if (/Tizen/i.test(ua)) return 'samsung';
    if (/Web0S|webOS/i.test(ua)) return 'lg';
    if (/Android/i.test(ua)) {
      return /\bTV\b|AFT|BRAVIA|SHIELD|Chromecast|GoogleTV|Large Screen/i.test(ua) ? 'tv' : 'android';
    }
    if (/Windows/i.test(ua)) return 'windows';
    return null;
  }

  const mine = detect();
  // A Samsung or LG TV's build is sent over from a computer, so there the big buttons lead
  // to the instructions and not to a file.
  const direct = ['windows', 'android', 'tv'].includes(mine) ? mine : null;

  for (const a of document.querySelectorAll('[data-download]')) {
    const kind = a.dataset.download === 'auto' ? direct : a.dataset.download;
    if (!kind) {
      // No build for this device: the button opens the list of devices instead of a file it can't run.
      a.dataset.chooser = '';
      a.removeAttribute('href');
      a.setAttribute('role', 'button');
      a.tabIndex = 0;
      const label = a.querySelector('[data-label]');
      if (label) label.textContent = 'Choose your device';
      continue;
    }
    a.href = link(kind);
    const label = a.querySelector('[data-label]');
    if (label) label.textContent = FILES[kind].label;
  }

  document.documentElement.classList.add('js');

  // ---- the download button's other devices ----
  // Each downloads its build. Samsung has none to download (the TV adds it through TizenBrew):
  // it leads to TizenBrew's guide, with the module to add as its note.
  const NOTES = { windows: 'Installer', android: 'Phones and tablets', tv: 'Android and Google TV', samsung: 'Add ZiggyGameDev/stream-thing-releases in TizenBrew', lg: 'webOS' };
  const caret = document.querySelector('.split .caret');
  const menu = document.getElementById('picks');
  if (caret && menu) {
    const items = [...menu.querySelectorAll('a')];
    for (const a of menu.querySelectorAll('[data-pick]')) {
      const kind = a.dataset.pick;
      a.href = kind === 'samsung' ? 'https://github.com/reisxd/TizenBrew/blob/main/docs/README.md' : link(kind);
      if (kind === 'samsung') a.rel = 'noopener';
      a.querySelector('small').textContent = kind === mine ? 'This device' : NOTES[kind];
      a.classList.toggle('mine', kind === mine);
      a.addEventListener('click', () => close());
    }
    menu.querySelector('.menu-all').addEventListener('click', () => close());
    const open = () => {
      menu.hidden = false;
      caret.setAttribute('aria-expanded', 'true');
      items[0].focus({ preventScroll: true });
    };
    const close = (back) => {
      if (menu.hidden) return;
      menu.hidden = true;
      caret.setAttribute('aria-expanded', 'false');
      if (back) caret.focus();
    };
    caret.addEventListener('click', () => (menu.hidden ? open() : close()));
    // On a device with no build of its own, the big button opens the list too.
    const chooser = document.querySelector('[data-chooser]');
    if (chooser) {
      chooser.addEventListener('click', (e) => { e.stopPropagation(); menu.hidden ? open() : close(); });
      chooser.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    }
    // "Get it" in the bar: back up to the download button, which gives a pulse to say here.
    for (const g of document.querySelectorAll('[data-get]')) {
      g.addEventListener('click', (e) => {
        e.preventDefault();
        const split = document.getElementById('get');
        split.scrollIntoView({ behavior: 'smooth', block: 'center' });
        split.classList.remove('nudge');
        void split.offsetWidth;
        split.classList.add('nudge');
        setTimeout(() => split.querySelector('.btn').focus({ preventScroll: true }), 600);
      });
    }
    document.addEventListener('click', (e) => {
      if (!menu.hidden && !menu.contains(e.target) && !caret.contains(e.target) && !e.target.closest('[data-chooser]')) close();
    });
    menu.addEventListener('keydown', (e) => {
      const i = items.indexOf(document.activeElement);
      if (e.key === 'Escape') close(true);
      else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
      }
    });
    menu.addEventListener('focusout', (e) => {
      if (!menu.contains(e.relatedTarget) && e.relatedTarget !== caret) close();
    });
  }

})();


// ---- the page coming in as it's scrolled, the bar along the top ----
(() => {
  const html = document.documentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Each part comes in as it's scrolled to, once: checked on each scroll frame (below). The top
  // waits for the start-up animation (intro.js) to hand over, so it rises in behind the name
  // flying up into the bar.
  let pending = [];
  const reveal = () => {
    pending = [...document.querySelectorAll('[data-reveal]')];
    requestAnimationFrame(frame);
  };
  const check = () => {
    if (!pending.length) return;
    const line = innerHeight * 0.9;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top > line) return true;
      el.classList.add('in');
      return false;
    });
  };
  if (html.classList.contains('intro')) window.addEventListener('dizzitv:intro-done', reveal, { once: true });

  // The bar: glass once off the top, a line along it for how far down the page is, and a
  // mark under the section in view.
  const bar = document.querySelector('.bar');
  const links = document.querySelector('.links');
  const mark = links && links.querySelector('.mark');
  const screen = document.querySelector('.stage .screen');
  const phone = document.querySelector('.stage .phone');
  let ticking = false;
  const frame = () => {
    ticking = false;
    check();
    spy();
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.classList.toggle('scrolled', y > 8);
    bar.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    // The app on screen leans back at the top and stands up as the page scrolls; the phone
    // rides up a touch faster than it.
    if (!still && screen) {
      const p = Math.min(1, y / (innerHeight * 0.55));
      screen.style.transform = `rotateX(${(1 - p) * 14}deg) scale(${0.94 + 0.06 * p})`;
      if (phone) phone.style.transform = `translateY(${-p * 70}px)`;
    }
  };
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
  addEventListener('resize', frame);
  if (!html.classList.contains('intro')) reveal();
  frame();

  // The section in view: the one across the middle of the screen.
  function spy() {
    if (!links) return;
    const navs = [...links.querySelectorAll('a')];
    const mid = innerHeight * 0.45;
    const a = navs.find((n) => {
      const r = document.querySelector(n.getAttribute('href'))?.getBoundingClientRect();
      return r && r.top <= mid && r.bottom > mid;
    }) || null;
    if (a === spy.on) return;
    spy.on = a;
    navs.forEach((n) => n.classList.toggle('on', n === a));
    links.classList.toggle('has-on', Boolean(a));
    if (a && mark) {
      mark.style.width = `${a.offsetWidth - 28}px`;
      mark.style.transform = `translateX(${a.offsetLeft + 14}px)`;
    }
  }
})();

// ---- what it does: tabs over the app's window, moving on by themselves ----
// Every few seconds the next tab is chosen, its progress filling along its bottom. Pointing
// at the section, or focusing in it, holds it; choosing a tab yourself stops it moving on;
// it only runs while it's on screen, and not at all with reduced motion.
(() => {
  const tour = document.querySelector('.tour');
  if (!tour) return;
  const tabs = [...tour.querySelectorAll('[role="tab"]')];
  const shots = [...tour.querySelectorAll('.tour-shots img')];
  const caps = [...tour.querySelectorAll('.tour-caps p')];
  const MS = 6000;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0, timer = 0, left = MS, startedAt = 0, auto = !still, visible = false, held = false;
  tour.style.setProperty('--tour-ms', `${MS}ms`);

  const show = (n, focus) => {
    i = (n + tabs.length) % tabs.length;
    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    tour.querySelector('.tour-window').setAttribute('aria-labelledby', tabs[i].id);
    shots.forEach((s, k) => s.classList.toggle('on', k === i));
    caps.forEach((c, k) => c.classList.toggle('on', k === i));
    if (focus) tabs[i].focus();
    // Restart the fill on the new tab.
    tour.classList.remove('playing');
    void tour.offsetWidth;
    left = MS;
    run();
  };
  const stop = () => { clearTimeout(timer); timer = 0; };
  function run() {
    stop();
    const going = auto && visible && !held;
    tour.classList.toggle('playing', auto);
    tour.classList.toggle('paused', auto && !going);
    if (!going) return;
    startedAt = performance.now();
    timer = setTimeout(() => show(i + 1), left);
  }
  const hold = (on) => {
    if (on === held) return;
    if (on && timer) left = Math.max(0, left - (performance.now() - startedAt));
    held = on;
    run();
  };

  tabs.forEach((t, k) => {
    t.addEventListener('click', () => { auto = false; show(k); });
    t.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      auto = false;
      show(i + step, true);
    });
  });
  tour.addEventListener('pointerenter', () => hold(true));
  tour.addEventListener('pointerleave', () => hold(false));
  tour.addEventListener('focusin', () => hold(true));
  tour.addEventListener('focusout', (e) => { if (!tour.contains(e.relatedTarget)) hold(false); });

  // Only on screen: checked as the page scrolls, as everything else here is.
  const check = () => {
    const r = tour.getBoundingClientRect();
    const now = r.top < innerHeight * 0.75 && r.bottom > innerHeight * 0.25;
    if (now === visible) return;
    if (!now && timer) left = Math.max(0, left - (performance.now() - startedAt));
    visible = now;
    run();
  };
  addEventListener('scroll', check, { passive: true });
  addEventListener('resize', check);
  document.addEventListener('visibilitychange', () => hold(document.hidden));
  show(0);
  check();
})();
