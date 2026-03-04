export const toolsManifest = [
  {
    "slug": "vite",
    "order": 10,
    "featured": true,
    "name": "Vite",
    "group": "Foundation",
    "icon": "workflow",
    "summary": "Fast module graphs and clean build output keep the frontend responsive during development and lean in production.",
    "excerpt": "Vite is the delivery spine of the project: fast feedback in development, predictable build behavior, and multi-page static output without unnecessary ceremony.",
    "description": "Tool profile for Vite in the Lunerya stack, covering build speed, static output, and frontend workflow.",
    "accent": "topaz",
    "tags": [
      "Build Tool",
      "Static Output",
      "Frontend Workflow"
    ],
    "relatedProjects": [
      "pulse-atlas",
      "void-relay"
    ],
    "officialHref": "https://vite.dev/",
    "href": "/tools/vite/"
  },
  {
    "slug": "tailwindcss",
    "order": 20,
    "featured": true,
    "name": "TailwindCSS",
    "group": "Foundation",
    "icon": "boxes",
    "summary": "A utility-first system for the Void Edition palette, glass layers, spacing rhythm, and responsive composition.",
    "excerpt": "TailwindCSS provides the speed of utilities while still allowing the interface to carry a distinct visual language through curated component classes and tokens.",
    "description": "Tool profile for TailwindCSS in the Lunerya stack, covering design tokens, glass surfaces, and responsive composition.",
    "accent": "amethyst",
    "tags": [
      "Design Tokens",
      "Glass UI",
      "Responsive Layout"
    ],
    "relatedProjects": [
      "signal-forge",
      "void-relay"
    ],
    "officialHref": "https://tailwindcss.com/",
    "href": "/tools/tailwindcss/"
  },
  {
    "slug": "gsap",
    "order": 40,
    "featured": true,
    "name": "GSAP",
    "group": "Motion",
    "icon": "sparkles",
    "summary": "Timeline control for hero staging, scroll reveals, and premium movement systems with explicit ownership boundaries.",
    "excerpt": "GSAP owns page-level movement in Lunerya, from hero timing to the tech slider and section reveals, without taking control of the content layer.",
    "description": "Tool profile for GSAP in the Lunerya stack, covering hero motion, scroll reveal, and timeline ownership.",
    "accent": "topaz",
    "tags": [
      "Motion",
      "Scroll",
      "Timeline"
    ],
    "relatedProjects": [
      "pulse-atlas",
      "void-relay"
    ],
    "officialHref": "https://gsap.com/",
    "href": "/tools/gsap/"
  },
  {
    "slug": "three-js",
    "order": 70,
    "featured": true,
    "name": "Three.js",
    "group": "Experience",
    "icon": "cpu",
    "summary": "WebGL depth for particles, geometry, and atmosphere where it meaningfully improves the scene.",
    "excerpt": "Three.js is used as atmosphere, not decoration: a bounded background system that adds depth without taking ownership of the reading experience.",
    "description": "Tool profile for Three.js in the Lunerya stack, covering particle backgrounds, geometry, and WebGL boundaries.",
    "accent": "amethyst",
    "tags": [
      "WebGL",
      "Background Atmosphere",
      "Progressive Enhancement"
    ],
    "relatedProjects": [
      "pulse-atlas"
    ],
    "officialHref": "https://threejs.org/",
    "href": "/tools/three-js/"
  },
  {
    "slug": "node-js",
    "order": 30,
    "featured": false,
    "name": "Node.js",
    "group": "Foundation",
    "icon": "database",
    "summary": "The build and generation scripts rely on a predictable Node environment for manifests, route generation, and deployment handoff.",
    "excerpt": "Node.js is the operational runtime behind the content generators, build scripts, and static delivery pipeline that keep Lunerya maintainable.",
    "description": "Tool profile for Node.js in the Lunerya stack, covering content generation and deployment workflow.",
    "accent": "mist",
    "tags": [
      "Tooling Runtime",
      "Generators",
      "Deployment"
    ],
    "relatedProjects": [
      "void-relay"
    ],
    "officialHref": "https://nodejs.org/",
    "href": "/tools/node-js/"
  },
  {
    "slug": "anime-js",
    "order": 50,
    "featured": false,
    "name": "Anime.js",
    "group": "Motion",
    "icon": "waypoints",
    "summary": "Micro-interactions stay tactile, fast, and separate from the main motion orchestration layer.",
    "excerpt": "Anime.js handles the local feel of buttons, cards, and UI affordances so page-level animation can stay isolated under GSAP.",
    "description": "Tool profile for Anime.js in the Lunerya stack, covering micro-interactions and local motion behavior.",
    "accent": "amethyst",
    "tags": [
      "Micro Interactions",
      "Hover States",
      "UI Feedback"
    ],
    "relatedProjects": [
      "signal-forge"
    ],
    "officialHref": "https://animejs.com/",
    "href": "/tools/anime-js/"
  },
  {
    "slug": "lucide",
    "order": 60,
    "featured": false,
    "name": "Lucide",
    "group": "Interface",
    "icon": "badge-check",
    "summary": "A precise icon set that keeps the interface sharp without inflating the asset budget.",
    "excerpt": "Lucide gives the site a consistent icon language with lightweight imports and enough breadth to support both homepage UI and editorial inner pages.",
    "description": "Tool profile for Lucide in the Lunerya stack, covering icon consistency and bundle discipline.",
    "accent": "mist",
    "tags": [
      "Icons",
      "Bundle Discipline",
      "Interface Polish"
    ],
    "relatedProjects": [
      "signal-forge",
      "void-relay"
    ],
    "officialHref": "https://lucide.dev/",
    "href": "/tools/lucide/"
  },
  {
    "slug": "static-deploy",
    "order": 80,
    "featured": false,
    "name": "Static Deploy",
    "group": "Delivery",
    "icon": "cloud",
    "summary": "The site is built to ship cleanly on Vercel, Netlify, or GitHub Pages with minimal runtime risk.",
    "excerpt": "Static deployment is a first-class design constraint in Lunerya, shaping route generation, asset paths, and the way enhancements are layered onto content.",
    "description": "Tool profile for Lunerya static deployment strategy across Vercel, Netlify, and GitHub Pages.",
    "accent": "topaz",
    "tags": [
      "Vercel",
      "Netlify",
      "GitHub Pages"
    ],
    "relatedProjects": [
      "void-relay"
    ],
    "officialHref": "https://vercel.com/",
    "href": "/tools/static-deploy/"
  },
  {
    "slug": "accessible-fallbacks",
    "order": 90,
    "featured": false,
    "name": "Accessible Fallbacks",
    "group": "Delivery",
    "icon": "mail",
    "summary": "The experience remains readable and usable when motion is reduced, JavaScript is unavailable, or enhancement layers are skipped.",
    "excerpt": "Accessible fallbacks are part of the product definition, ensuring the site keeps its hierarchy and intent even when the premium layers step aside.",
    "description": "Tool profile for accessibility and fallback strategy in the Lunerya stack.",
    "accent": "mist",
    "tags": [
      "Reduced Motion",
      "Resilience",
      "Graceful Degradation"
    ],
    "relatedProjects": [
      "pulse-atlas",
      "void-relay"
    ],
    "officialHref": null,
    "href": "/tools/accessible-fallbacks/"
  }
]
