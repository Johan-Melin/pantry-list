# Pantry

A simple mobile-friendly pantry list with categories, three stock states, rearrangeable items and a single last-checked date.

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

## Data storage

Pantry data is saved in the current browser's local storage. It is not synced across devices or website addresses. Clearing browser storage removes the saved pantry.
