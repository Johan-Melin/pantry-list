# Pantry

A simple mobile-friendly pantry list with categories, three stock states, rearrangeable items and a single last-checked date.

**Live app:** [pantry-restock.vercel.app](https://pantry-restock.vercel.app)

## Source files

This is a buildless HTML/CSS/JavaScript app. The editable source is in `dist/index.html`, `dist/style.css` and `dist/app.js`.

## Run locally

With Node.js installed, run `node serve.cjs` and open http://127.0.0.1:4173.

## Deploy on Vercel

Import this repository and keep the default settings. The included `vercel.json` selects the static `dist` directory and disables the build step. Keep Root Directory at the repository root.

The equivalent manual settings are:

- Framework preset: Other
- Root directory: leave at the repository root
- Build command: leave empty
- Output directory: `dist`

The `.openai` directory contains optional Sites hosting metadata and is not needed by Vercel.

## Install on iPhone

Open the deployed HTTPS site in Safari, choose Share, then Add to Home Screen and Add. The installed app opens in its own window. Open it once while online to cache the app for offline use.

The service worker caches the app shell. Bump the cache version in `dist/sw.js` when changing cached files. Updates activate after existing app windows close. Run `node test-pwa.cjs` to check the offline shell and icon assets.

## Data storage

Pantry data is saved in the current browser's local storage. It is not synced across devices or website addresses. Clearing browser storage removes the saved pantry.
