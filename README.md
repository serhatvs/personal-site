# Lunerya Product Engineering Studio

Static studio website built with Vite, TailwindCSS, GSAP, Anime.js, Three.js, and Lucide. The site focuses on polished product storytelling, frontend systems, motion enhancement, and static deployment.

## Stack

- Vite (vanilla ESM)
- TailwindCSS 3
- GSAP + ScrollTrigger
- Anime.js
- Three.js
- Lucide

## Local development

```bash
npm install
npm run dev
```

## Environment variables

Create a local `.env` file if needed:

```bash
VITE_CONTACT_ENDPOINT=
VITE_BASE_PATH=/
```

- `VITE_CONTACT_ENDPOINT`: Optional external form endpoint for production contact submissions.
- `VITE_BASE_PATH`: Use `/` for Vercel and Netlify. Use the repository subpath when deploying to GitHub Pages.

## Production build

```bash
npm run build
npm run preview
```

## Deployment

### Vercel

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_CONTACT_ENDPOINT` in project environment variables

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Keep `VITE_BASE_PATH=/`

### GitHub Pages

- Set `VITE_BASE_PATH` to the repository subpath, for example `/personal-site/`
- Build and publish the generated `dist/` directory
- Keep the contact form on an external endpoint
