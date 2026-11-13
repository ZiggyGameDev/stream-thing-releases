<div align="center">

<a href="https://ziggygamedev.github.io/stream-thing-releases/">
  <img src=".github/readme/banner.png" alt="stream-thing — downloads, and every released build" width="100%">
</a>

<br>

[![Latest release](https://img.shields.io/github/v/release/ZiggyGameDev/stream-thing-releases?style=flat-square&label=latest&color=ff4d5e&labelColor=1a0f12)](https://github.com/ZiggyGameDev/stream-thing-releases/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/ZiggyGameDev/stream-thing-releases/total?style=flat-square&color=ff8a00&labelColor=1a0f12)](https://github.com/ZiggyGameDev/stream-thing-releases/releases)
[![Released](https://img.shields.io/github/release-date/ZiggyGameDev/stream-thing-releases?style=flat-square&label=released&color=ff2d78&labelColor=1a0f12)](https://github.com/ZiggyGameDev/stream-thing-releases/releases/latest)

</div>

<br>

## 1 · Get it

<table>
<tr>
<td align="center" width="20%">
<a href="https://github.com/ZiggyGameDev/stream-thing-releases/releases/latest/download/stream-thing-windows.msi"><img src="https://img.shields.io/badge/Windows-Download-ff4d5e?style=for-the-badge&labelColor=1a0f12" alt="Download for Windows"></a><br>
<sub>Run the installer</sub>
</td>
<td align="center" width="20%">
<a href="https://github.com/ZiggyGameDev/stream-thing-releases/releases/latest/download/stream-thing-android.apk"><img src="https://img.shields.io/badge/Android-Download-ff4d5e?style=for-the-badge&logo=android&logoColor=white&labelColor=1a0f12" alt="Download for Android"></a><br>
<sub>Open the file, allow, install</sub>
</td>
<td align="center" width="20%">
<a href="https://ziggygamedev.github.io/stream-thing-releases/#panel-tv"><img src="https://img.shields.io/badge/Android_TV-Get_it-ff4d5e?style=for-the-badge&logo=android&logoColor=white&labelColor=1a0f12" alt="Android TV"></a><br>
<sub>In <b>Downloader</b> on the TV, go to<br><code>ziggygamedev.github.io/stream-thing-releases/tv</code></sub>
</td>
<td align="center" width="20%">
<a href="https://ziggygamedev.github.io/stream-thing-releases/#panel-samsung"><img src="https://img.shields.io/badge/Samsung-Get_it-ff4d5e?style=for-the-badge&logo=samsung&logoColor=white&labelColor=1a0f12" alt="Samsung TV"></a><br>
<sub>In <b>TizenBrew</b>, add the module<br><code>ZiggyGameDev/stream-thing-releases</code></sub>
</td>
<td align="center" width="20%">
<a href="https://github.com/ZiggyGameDev/stream-thing-releases/releases/latest/download/stream-thing-lg-tv.ipk"><img src="https://img.shields.io/badge/LG-Download-ff4d5e?style=for-the-badge&logo=lg&logoColor=white&labelColor=1a0f12" alt="Download for LG TVs"></a><br>
<sub>Install in Developer Mode</sub>
</td>
</tr>
</table>

## 2 · Sign in with Google

So your list, your history and your place in every episode follow you to every screen.

## 3 · Add a stream addon

Paste its address anywhere in the app. Add it once, and it's on all your devices.

## 4 · Press play

<img src="assets/shots/desktop-home.webp" alt="stream-thing on Windows" width="100%">

<br>

<div align="center">

Stuck on a step? The **[website](https://ziggygamedev.github.io/stream-thing-releases/)** walks through each screen.<br>
Installed copies update themselves — you only download once.

<sub><a href="https://github.com/ZiggyGameDev/stream-thing-releases/releases">All releases</a> · Not affiliated with Stremio</sub>

</div>

<details>
<summary><sub>For maintainers</sub></summary>

<br>

- Releases are made by `.github/workflows/release.yml` from a pushed `upload/v<version>` branch; it checks every file against `latest.json` before publishing. Nothing is built here.
- `stream-thing-windows.exe` must stay in every release under that name: installed copies on Windows update from it.
- `samsung/` is the unpacked Samsung build for TizenBrew, written by the workflow. Don't edit it by hand.
- The site is the top-level files, served by GitHub Pages from `main`. No build step.

</details>
