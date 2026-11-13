# stream-thing downloads

The website for [stream-thing](https://ziggygamedev.github.io/stream-thing-releases/) and
every released build of it. The app's source lives elsewhere; nothing here is built here.

## Downloading

The latest version, always at the same address:

| | |
|---|---|
| Windows (installer) | https://github.com/ZiggyGameDev/stream-thing-releases/releases/latest/download/stream-thing-windows.msi |
| Android phones and tablets | https://github.com/ZiggyGameDev/stream-thing-releases/releases/latest/download/stream-thing-android.apk |
| Android TV and Google TV | https://github.com/ZiggyGameDev/stream-thing-releases/releases/latest/download/stream-thing-android-tv.apk |
| Samsung TVs | TizenBrew module `ZiggyGameDev/stream-thing-releases` |

Each release also has `stream-thing-windows.exe`, the app without its installer. It is what
an installed copy on Windows downloads to update itself, so it stays under that name.

Installed copies update themselves from the same place: they read
`releases/latest/download/latest.json`, which lists the newest version with the address,
size and SHA-256 of each file.

## How a release gets here

The build server pushes a branch `upload/v<version>` with the built files and their
`latest.json` in an `upload/` folder. `.github/workflows/release.yml` checks each file
against the manifest, publishes release `v<version>` with them, and deletes the branch.

## Samsung TVs, through TizenBrew

This repo is also a [TizenBrew](https://github.com/reisxd/TizenBrew) module: on the TV, add
the GitHub module `ZiggyGameDev/stream-thing-releases`. `package.json` is what TizenBrew
reads. It opens `tizenbrew/index.html`, which sends the TV on to the app in `samsung/`, and
runs `samsung/service/tizenbrew.js` beside it (the torrent engine).

`samsung/` is the Samsung build unpacked: the release workflow puts each release's there,
and sets the version in `package.json`, before it makes the release. Don't edit it by hand.

## The website

The files at the top level (`index.html`, `styles.css`, `main.js`, `assets/`, `tv/`, and `samsung/` for TizenBrew) are
the site, served by GitHub Pages from `main`. There is no build step: edit and push. The
download buttons link to the addresses above, so the site never needs updating for a new
version.
