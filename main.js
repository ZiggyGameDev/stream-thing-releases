/*
 * The page works without this file: every download button already links to the latest
 * build. This adds three things: the big buttons offer the build for the device you are on,
 * the platform tabs, and the version number and file sizes read from the latest release.
 */
(() => {
  const repo = document.body.dataset.repo;
  const FILES = {
    windows: { file: 'stream-thing-windows.exe', label: 'Download for Windows' },
    android: { file: 'stream-thing-android.apk', label: 'Download for Android' },
    tv: { file: 'stream-thing-android-tv.apk', label: 'Download for Android TV' },
  };
  // GitHub answers this with a redirect to the newest release's file, sent as an
  // attachment, so the browser downloads it and the page stays where it is.
  const link = (kind) => `https://github.com/${repo}/releases/latest/download/${FILES[kind].file}`;

  /** Which build suits this device, or null when there isn't one (iPhone, Mac, Linux). */
  function detect() {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) {
      return /\bTV\b|AFT|BRAVIA|SHIELD|Chromecast|GoogleTV|Large Screen/i.test(ua) ? 'tv' : 'android';
    }
    if (/Windows/i.test(ua)) return 'windows';
    return null;
  }

  const mine = detect();

  for (const a of document.querySelectorAll('[data-download]')) {
    const kind = a.dataset.download === 'auto' ? mine : a.dataset.download;
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
  select(document.getElementById(`tab-${mine === 'android' ? 'android' : mine === 'tv' ? 'tv' : 'windows'}`));

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
      for (const [kind, { file }] of Object.entries(FILES)) {
        const asset = (release.assets || []).find((a) => a.name === file);
        const el = document.querySelector(`[data-meta="${kind}"]`);
        if (asset && el) el.textContent = [version && `Version ${version}`, mb(asset.size)].filter(Boolean).join(' · ');
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
