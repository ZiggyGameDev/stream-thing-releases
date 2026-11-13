<div align="center">

<a href="https://ziggygamedev.github.io/stream-thing-releases/">
  <img src=".github/readme/banner.png" alt="stream-thing" width="100%">
</a>

<h3>Films, shows and live channels — on your PC, your phone and your TV.</h3>

[![Latest release](https://img.shields.io/github/v/release/ZiggyGameDev/stream-thing-releases?style=flat-square&label=latest&color=ff4d5e&labelColor=1a0f12)](https://github.com/ZiggyGameDev/stream-thing-releases/releases/latest)
[![Released](https://img.shields.io/github/release-date/ZiggyGameDev/stream-thing-releases?style=flat-square&label=released&color=ff8a00&labelColor=1a0f12)](https://github.com/ZiggyGameDev/stream-thing-releases/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/ZiggyGameDev/stream-thing-releases/total?style=flat-square&color=ff2d78&labelColor=1a0f12)](https://github.com/ZiggyGameDev/stream-thing-releases/releases)

<br>

<a href="https://github.com/ZiggyGameDev/stream-thing-releases/releases/latest/download/stream-thing-windows.msi"><img src="https://img.shields.io/badge/Windows-ff4d5e?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTAgMGgxMXYxMUgwem0xMyAwaDExdjExSDEzek0wIDEzaDExdjExSDB6bTEzIDBoMTF2MTFIMTN6Ii8+PC9zdmc+" alt="Windows"></a>
<a href="https://github.com/ZiggyGameDev/stream-thing-releases/releases/latest/download/stream-thing-android.apk"><img src="https://img.shields.io/badge/Android-ff4d5e?style=for-the-badge&logo=android&logoColor=white" alt="Android"></a>
<a href="https://ziggygamedev.github.io/stream-thing-releases/#panel-tv"><img src="https://img.shields.io/badge/Android_TV-ff4d5e?style=for-the-badge&logo=android&logoColor=white" alt="Android TV"></a>
<a href="https://ziggygamedev.github.io/stream-thing-releases/#panel-samsung"><img src="https://img.shields.io/badge/Samsung_TV-ff4d5e?style=for-the-badge&logo=samsung&logoColor=white" alt="Samsung TV"></a>
<a href="https://github.com/ZiggyGameDev/stream-thing-releases/releases/latest/download/stream-thing-lg-tv.ipk"><img src="https://img.shields.io/badge/LG_TV-ff4d5e?style=for-the-badge&logo=lg&logoColor=white" alt="LG TV"></a>

<sub>Install once — it keeps itself up to date.</sub>

</div>

<br>

<img src="assets/shots/desktop-home.webp" alt="Home" width="100%">

<table>
<tr>
<td width="50%"><img src="assets/shots/desktop-mylist.webp" alt="My list, with the calendar of new episodes"></td>
<td width="50%"><img src="assets/shots/desktop-live.webp" alt="Live channels"></td>
</tr>
</table>

<br>

## Highlights

<table>
<tr>
<td width="33%" valign="top"><b>🗂️ Every catalogue, one home</b><br><sub>A row for each catalogue, genres to browse, and one search across all of them.</sub></td>
<td width="33%" valign="top"><b>🔄 Picks up where you left off</b><br><sub>Sign in once: your list, history and place in every episode follow you to each screen.</sub></td>
<td width="33%" valign="top"><b>📅 Never miss an episode</b><br><sub>My list shows what's new from your shows on a calendar.</sub></td>
</tr>
<tr>
<td valign="top"><b>📺 Live channels</b><br><sub>Always-on channels built from the catalogue — something's on when you sit down.</sub></td>
<td valign="top"><b>⏭️ Skips the credits</b><br><sub>Finds where the credits start and moves on to the next episode.</sub></td>
<td valign="top"><b>🎧 Plays it properly</b><br><sub>HDR, surround sound passed to your receiver, and every subtitle format.</sub></td>
</tr>
</table>

## Addons

stream-thing is built on the open [Stremio addon protocol](https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/protocol.md). It's ready to browse from the start, with addons for catalogues, details and subtitles already installed.

Want more? Add any compatible addon — more catalogues, more subtitle languages, other sources:

- paste the addon's link **anywhere** in the app and it offers to install it, or
- go to **Settings → Addons**.

Your addons are saved to your account, so adding one on your PC adds it on your phone and TV too.

## Getting started

| | |
|---|---|
| **1. Install** | **Windows** — run the installer · **Android** — open the file and allow the install · **Android TV** — in the *Downloader* app, go to `ziggygamedev.github.io/stream-thing-releases/tv` · **Samsung** — in *TizenBrew*, add the module `ZiggyGameDev/stream-thing-releases` · **LG** — install in Developer Mode |
| **2. Sign in** | With Google. On a TV, sign in from your phone with the code on screen. |
| **3. Watch** | Pick something and press play. |

Need a hand? The **[website](https://ziggygamedev.github.io/stream-thing-releases/)** walks through each step with pictures.

<br>

<div align="center">
<sub>
<a href="https://ziggygamedev.github.io/stream-thing-releases/">Website</a> ·
<a href="https://github.com/ZiggyGameDev/stream-thing-releases/releases">All releases</a> ·
Not affiliated with Stremio
</sub>
</div>

<details>
<summary><sub>Maintainers</sub></summary>

<br>

- Releases are made by `.github/workflows/release.yml` from a pushed `upload/v<version>` branch, after every file is checked against `latest.json`. Nothing is built here.
- `stream-thing-windows.exe` stays in every release under that name: installed copies on Windows update from it.
- `samsung/` is the unpacked Samsung build for TizenBrew, written by the workflow. Don't edit it by hand.
- The site is the top-level files, served by GitHub Pages from `main`. No build step.

</details>
