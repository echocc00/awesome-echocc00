# Cloudflare Hosting (CF Pages / Workers Static Assets)

This repo's `www.echocco.com` lives on Cloudflare, not GitHub Pages.

DNS is delegated to Cloudflare (`www.echocco.com` → CF apex records
`172.67.x` / `104.21.x`), and the active build target is a Cloudflare
**Workers Static Assets** project named `awesome-echocc00`.

## Why not GitHub Pages?

- Lets Encrypt cert provisioning on `www.echocco.com` was historically
  unreliable (5min–24h churn on the GH Pages CNAME flow).
- For mainland China visitors, CF's Asia edge (SIN/HKG/NRT) is materially
  faster than GitHub Pages' US-only origin.
- One deploy target (GH) means every request re-crosses the Pacific.

## Repository contracts

| Path | What |
|---|---|
| `Gemfile` | Bundler-resolved Jekyll 3.10 + Ruby 3.4 stdlib substitute gems. Required because CF Workers image is bare Ruby and Bundler.setup transitively fails on base64/bigdecimal/csv/logger/mutex_m/drb/stringio/benchmark/webrick. See [jekyll/jekyll#9620](https://github.com/jekyll/jekyll/issues/9620). |
| `_config.yml` | `theme: null` (not minima). Repo is a "fake Jekyll" site: `index.html` is fully self-contained (no `{% include %}` / `{% layout %}`). Jekyll just copies the file byte-for-byte into `_site/index.html`. |
| `.github/workflows/block-pages-enable.yml` | Guard rail that disables Pages if someone re-enables it from the GH UI (we'd lose DNS consistency). |

## Build settings (in CF UI)

```
Build command: bundle install --jobs=4 --retry=3 && bundle exec jekyll build
Build output directory: _site
Root directory: (empty)
Framework preset: None
Production branch: main
```

## Deploy flow

1. Push to `main` (or PR merged).
2. CF webhook → Workers Static Assets build runs Jekyll via Bundler.
3. Build produces `_site/` → CF Workers serves at:
   - `https://awesome-echocc00.pages.dev/` (project preview URL)
   - `https://182e62ef.awesome-echocc00.pages.dev/` (per-deployment preview)
   - `https://www.echocco.com/` (production via custom domain)

To retrigger a deploy manually: CF Dashboard → awesome-echocc00 → Deployments → ⋯ on a row → Retry deployment.

## Disabling CF and returning to GH Pages

If you ever need to roll back:

1. Re-enable GH Pages: `gh api -X POST repos/echocc00/awesome-echocc00/pages -F source[branch]=main -F source[path]=/ -F cname=www.echocco.com`
2. Restore `theme: minima` in `_config.yml` (so GH Pages doesn't trip on
   edge case to render with a default theme if `theme: null` ever
   changes behavior in GH Pages).
3. The CF project can stay dormant without affecting routing **as long as**
   no `www.echocco.com` DNS record points at it (currently it's a CNAME
   to CF apex IPs, not to the CF Workers subdomain — keep it that way
   during a rollback).

The GitHub Action `.github/workflows/block-pages-enable.yml` will
auto-disable Pages if someone re-enables it accidentally — that's
intentional now (CF is canonical), so flip the workflow to a no-op
or delete it if you re-enable Pages deliberately.
