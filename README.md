# Lunerya Void Edition

Premium static developer portfolio built with Vite, TailwindCSS, GSAP, Anime.js, Three.js, and Lucide.

## Stack

- Vite (vanilla ESM)
- TailwindCSS 3
- GSAP + ScrollTrigger
- Anime.js
- Three.js
- Lucide

## Local development

```bash
npm ci
npm run dev
```

## Environment variables

Create a local `.env` file if needed:

```bash
VITE_CONTACT_ENDPOINT=
VITE_BASE_PATH=/
```

- `VITE_CONTACT_ENDPOINT`: Optional external form endpoint for production contact submissions.
- `VITE_BASE_PATH`: Use `/` for Vercel and Netlify. Use `/lunerya-void/` for GitHub Pages.

## Production build

```bash
npm run build
npm run preview
```

## Predeploy verification

Run this exact gate before opening a PR or merging:

```bash
npm ci && npm run ci:verify
```

- `ci:verify` runs `vite build` and a dist smoke validator (`scripts/deploy-smoke.mjs`).
- Smoke checks cover required route files, hashed JS/CSS assets, and internal link resolution across all built HTML files.

## CI behavior (GitHub Actions)

- Workflow: `.github/workflows/ci.yml`
- Triggers:
  - Pull requests targeting `main`
  - Pushes to `main`
- Job contract:
  - Setup Node from `.nvmrc`
  - `npm ci`
  - `npm run ci:verify`
- On failure, the built `dist/` directory is uploaded as an artifact for diagnostics.

Recommended repository protection for `main`:

1. Require pull requests before merging.
2. Require CI status checks to pass (`CI / verify`).
3. Disable direct pushes to `main`.

## Deployment

### Vercel

Configuration is committed in `vercel.json`:

- Framework preset: `vite`
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`
- Static cache rule for `/assets/*`: immutable long-term cache
- Baseline security headers:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: DENY`
  - `Permissions-Policy` with sensitive features disabled by default

Project setup checklist:

1. Import/connect this GitHub repo in Vercel.
2. Set **Production Branch** to `main`.
3. Ensure Git Integration auto-deploy is enabled (default).
4. Set project environment variables:
   - `VITE_BASE_PATH=/`
   - `VITE_CONTACT_ENDPOINT` (optional)

Rollback:

- In Vercel dashboard, open Deployments and redeploy/promote the last known good production deployment.

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Keep `VITE_BASE_PATH=/`

### GitHub Pages

- Set `VITE_BASE_PATH=/lunerya-void/`
- Build and publish the generated `dist/` directory
- Keep the contact form on an external endpoint
