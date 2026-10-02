# EVOLVE Donation Site

Static, self-contained, multilingual donation/support page for the EVOLVE project.
No backend, no build step, no external JS dependencies — plain HTML/CSS/JS.

## Contents

- `index.html` — page structure (all visible strings rendered from locale files)
- `styles.css` — dark, responsive styling
- `app.js` — language switcher, rendering, copy buttons, AJAX form submit
- `addresses.json` — donation addresses (**placeholders — replace `<YOUR_...>` values before publishing**)
- `locales/index.json` — language list for the dropdown (native names)
- `locales/<code>.json` — one file per locale (34 languages, mirroring `apps/web/src/i18n/locales/`)

## Local preview

Serve over HTTP (do not open `index.html` via `file://` — fetching locale files would be blocked by the browser):

```bash
cd site
npx serve -l 5055
# or: python -m http.server 5055
```

Open http://localhost:5055

## Deploy — GitHub Pages

The workflow at `.github/workflows/pages.yml` deploys `site/` automatically on every push
to `main` that changes `site/**` (also runnable manually via `workflow_dispatch`).

One-time repo setup: **Settings → Pages → Source: GitHub Actions**.

The page is then served at `https://<org>.github.io/<repo>/` — note the site uses relative
paths (`locales/…`, `addresses.json`), so it works under any base path without changes.

## Deploy — Codeberg Pages

Codeberg Pages serves static sites from the `pages` branch of a repository
(`https://<user>.codeberg.page/<repo>/`). To publish:

```bash
# from the repo root, create an orphan branch containing only site/ contents
git switch --orphan pages
git rm -rf . 2>/dev/null || true
git checkout main -- site/
git mv site/* . && git rm -r site
git add -A
git commit -m "deploy: donation site"
git push <remote> pages
```

Repeat on every update (or script it in CI). All asset references are relative, so the
site works from any path/host without rebuilds.

## Updating translations

All visible strings live under the `donate` object in `locales/<code>.json`.
Tier-1 languages have natural translations; the rest currently fall back to English.
Do not hardcode user-facing strings in `index.html` or `app.js`.
