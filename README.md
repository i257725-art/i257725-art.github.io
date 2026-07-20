# SOC Portfolio Site

A static, single-page portfolio site (navy & white, corporate/resume theme) for tracking SOC lab work: projects, reports, Wazuh detection rules, IR playbooks, and certifications.

## What's inside
```
index.html          → the whole page (Home, About, Projects, SOC Reports, Detection Rules, Playbooks, Certifications)
css/styles.css       → theme (navy/white, serif headings + sans body + mono accents)
js/data.js           → the starting content — YOUR projects/reports/rules are seeded here
js/app.js            → renders everything + powers Add/Edit/Delete ("Manage Mode")
```

## Deploy to your i257725-art.github.io repo
1. Copy every file in this folder into the root of your `i257725-art.github.io` repo (keep the `css/` and `js/` folders as-is).
2. Commit and push:
   ```
   git add .
   git commit -m "Add SOC portfolio site"
   git push origin main
   ```
3. Your site goes live at `https://i257725-art.github.io/i257725-art.github.io/` (or your bare `https://i257725-art.github.io/` if that's the repo name GitHub Pages recognizes — check Settings → Pages in your repo).

## Editing content — two ways

### 1. Quick edits from the live site ("Manage Mode")
Click **Manage** (top right). This reveals **+ Add**, **Edit**, and **Delete** buttons on every section.
- Changes save instantly to that browser's `localStorage`.
- ⚠️ This only affects *your* browser/device — a visitor loading the site won't see your edits, and clearing browser data wipes them. Manage Mode is a convenient way to draft content, not to publish it.
- Use **Export Data (JSON)** in the yellow banner to download everything you've edited.

### 2. Making an edit permanent for every visitor
1. Edit content in Manage Mode until it looks right.
2. Click **Export Data (JSON)** — downloads `soc-portfolio-data.json`.
3. Open that file, copy the contents.
4. Open `js/data.js`, replace everything after `window.SOC_SEED = ` with the copied object (keep the `window.SOC_SEED = ... ;` wrapper).
5. Commit and push `js/data.js`. Now every visitor sees the update.

(Optional) If you'd rather always edit `js/data.js` directly by hand instead of using Manage Mode, that works too — just keep the same structure (see the comments in the file). If a browser has old localStorage data saved, click **Reset to Seed** in Manage Mode first so it picks up your new `data.js`.

## Filling in real content
- **Résumé**: drop a PDF at `assets/resume.pdf`, or point "Résumé URL" (Manage Mode → Edit Profile) at a Google Drive / GitHub link.
- **Reports**: each report can link to a PDF, Google Doc, or a markdown file in your repo via "Report file link".
- **Profile links**: GitHub, LinkedIn, Blog, and your name/title/bio are all editable via **Edit Profile** at the bottom of the page (Manage Mode only).

## Notes
- No backend, no build step — pure HTML/CSS/JS, so it works as-is on GitHub Pages.
- Fonts (Source Serif 4, Inter, IBM Plex Mono) load from Google Fonts via `<link>` in `index.html`.
