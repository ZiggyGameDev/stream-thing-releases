/*
 * The page works without this file: every download button already links to the latest
 * build. This adds three things: the big buttons offer the build for the device you are on,
 * the platform tabs, and the version number and file sizes read from the latest release.
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
      // No build for this device: the button leads to the list instead of a file it can't run.
      a.href = '#download';
      const label = a.querySelector('[data-label]');
      if (label) label.textContent = 'See the downloads';
      continue;
    }
    a.href = link(kind);
    const label = a.querySelector('[data-label]');
    if (label) label.textContent = FILES[kind].label;
  }

  // ---- tabs ----
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    }
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      select(tabs[(i + step + tabs.length) % tabs.length], true);
    });
  });
  document.documentElement.classList.add('js');
  select(document.getElementById(`tab-${mine ?? 'windows'}`));

  // ---- the latest version and its file sizes ----
  const mb = (bytes) => `${Math.round(bytes / 1024 / 1024)} MB`;
  fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers: { accept: 'application/vnd.github+json' } })
    .then((res) => (res.ok ? res.json() : null))
    .then((release) => {
      if (!release) return;
      const version = String(release.tag_name || '').replace(/^v/, '');
      if (version) {
        for (const el of document.querySelectorAll('[data-version]')) {
          el.textContent = `Version ${version}. `;
          el.hidden = false;
        }
        for (const el of document.querySelectorAll('[data-version-plain]')) el.textContent = `Version ${version}`;
      }
      for (const [kind, { file, was }] of Object.entries(FILES)) {
        let asset = (release.assets || []).find((a) => a.name === file);
        const el = document.querySelector(`[data-meta="${kind}"]`);
        if (!asset && was) {
          // The newest release is from before this file existed: its buttons give what it has.
          asset = (release.assets || []).find((a) => a.name === was);
          if (asset) for (const a of document.querySelectorAll('[data-download]')) if (a.href === link(kind)) a.href = link(kind, was);
        }
        if (asset && el) el.textContent = [version && `Version ${version}`, mb(asset.size)].filter(Boolean).join(' · ');
        if (asset) continue;
        // The newest release has no build for this platform: say so, in place of a link
        // that would lead nowhere. It comes back by itself with the release that has one.
        for (const a of document.querySelectorAll(`[data-download="${kind}"]`)) {
          a.removeAttribute('href');
          a.setAttribute('aria-disabled', 'true');
          a.classList.add('off');
          a.textContent = 'Not in this version yet';
        }
        if (el) el.textContent = version ? `Version ${version} has no build for this TV. The steps below are for when one does.` : '';
      }
    })
    .catch(() => {});
})();

// The address to type into Downloader on a TV: this site's own, so it is right wherever
// the site is hosted. (Opened from a file there is no address to show.)
(() => {
  if (!/^https?:$/.test(location.protocol)) return;
  const address = `${location.host}${location.pathname.replace(/[^/]*$/, '')}tv`;
  for (const el of document.querySelectorAll('[data-tv-address]')) el.textContent = address;
})();
