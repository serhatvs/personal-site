export const toolRecords = [
  {
    slug: 'vite',
    order: 10,
    featured: true,
    name: 'Vite',
    group: 'Foundation',
    icon: 'workflow',
    summary: 'Fast module graphs and clean build output keep the frontend responsive during development and lean in production.',
    excerpt:
      'Vite is the delivery spine of the project: fast feedback in development, predictable build behavior, and multi-page static output without unnecessary ceremony.',
    description: 'Tool profile for Vite in the Lunerya stack, covering build speed, static output, and frontend workflow.',
    accent: 'topaz',
    tags: ['Build Tool', 'Static Output', 'Frontend Workflow'],
    officialHref: 'https://vite.dev/',
    relatedProjects: ['pulse-atlas', 'void-relay'],
    responsibilities: ['Module graph', 'Build orchestration', 'Multi-page static output'],
    constraints: ['Generated routes must exist before build input resolution', 'Base path handling must stay explicit'],
    highlights: [
      { label: 'Role', value: 'Build runtime' },
      { label: 'Strength', value: 'Fast feedback loop' },
    ],
    sections: [
      {
        title: 'Why it is in the stack',
        paragraphs: [
          'Vite keeps the project lightweight while still supporting a multi-entry static site. That matters because Lunerya is not a SPA and should not carry SPA complexity by default.',
          'It also makes it practical to mix a handcrafted homepage with generated archive and detail routes without introducing a heavier app framework.',
        ],
      },
      {
        title: 'Where it is used',
        paragraphs: [
          'Vite drives the homepage, journal archive, generated journal detail pages, and the new projects and tools routes from one build pipeline.',
          'The configuration also owns manual chunking, aliases, and base path behavior so deployment remains predictable across hosts.',
        ],
      },
      {
        title: 'Guardrails',
        paragraphs: [
          'Generated files need to exist before Vite resolves its build inputs. The content generators therefore run inside the config lifecycle instead of being treated as an optional post-step.',
          'Path handling stays explicit because GitHub Pages and root-level deployments do not share the same assumptions.',
        ],
      },
    ],
  },
  {
    slug: 'tailwindcss',
    order: 20,
    featured: true,
    name: 'TailwindCSS',
    group: 'Foundation',
    icon: 'boxes',
    summary: 'A utility-first system for the Lunerya palette, glass layers, spacing rhythm, and responsive composition.',
    excerpt:
      'TailwindCSS provides the speed of utilities while still allowing the interface to carry a distinct visual language through curated component classes and tokens.',
    description: 'Tool profile for TailwindCSS in the Lunerya stack, covering design tokens, glass surfaces, and responsive composition.',
    accent: 'amethyst',
    tags: ['Design Tokens', 'Glass UI', 'Responsive Layout'],
    officialHref: 'https://tailwindcss.com/',
    relatedProjects: ['signal-forge', 'void-relay'],
    responsibilities: ['Layout composition', 'Theme tokens', 'Component utility language'],
    constraints: ['Content globs must include generated HTML', 'Component classes should stay sparse and intentional'],
    highlights: [
      { label: 'Role', value: 'UI styling system' },
      { label: 'Focus', value: 'Speed with control' },
    ],
    sections: [
      {
        title: 'Why it is in the stack',
        paragraphs: [
          'TailwindCSS is used here as a systems tool, not a shortcut. It allows the project to encode spacing, typography, and color decisions directly into a reusable visual language.',
          'That is especially useful when the site combines a premium homepage with several generated inner pages that still need to feel like one product.',
        ],
      },
      {
        title: 'Where it is used',
        paragraphs: [
          'The Lunerya surface uses Tailwind utilities and a small layer of custom component classes for panels, chips, buttons, and editorial shells.',
          'Generated pages rely on the same token system, so archive and detail routes stay visually coherent with the homepage.',
        ],
      },
      {
        title: 'Guardrails',
        paragraphs: [
          'Utility speed only stays valuable when class composition is disciplined. Repeated visual patterns are collapsed into component classes instead of letting every file drift into a different style dialect.',
          'Generated HTML directories must be included in the Tailwind content config or production builds will drop the required classes.',
        ],
      },
    ],
  },
  {
    slug: 'node-js',
    order: 30,
    featured: false,
    name: 'Node.js',
    group: 'Foundation',
    icon: 'database',
    summary: 'The build and generation scripts rely on a predictable Node environment for manifests, route generation, and deployment handoff.',
    excerpt:
      'Node.js is the operational runtime behind the content generators, build scripts, and static delivery pipeline that keep Lunerya maintainable.',
    description: 'Tool profile for Node.js in the Lunerya stack, covering content generation and deployment workflow.',
    accent: 'mist',
    tags: ['Tooling Runtime', 'Generators', 'Deployment'],
    officialHref: 'https://nodejs.org/',
    relatedProjects: ['void-relay'],
    responsibilities: ['Generator execution', 'Script runtime', 'Deployment handoff'],
    constraints: ['Generators must stay deterministic', 'File output should remain host-agnostic'],
    highlights: [
      { label: 'Role', value: 'Tooling runtime' },
      { label: 'Scope', value: 'Build and generation' },
    ],
    sections: [
      {
        title: 'Why it is in the stack',
        paragraphs: [
          'The portfolio relies on content generation, multi-route builds, and deterministic file output. Node.js is the runtime that keeps those operational steps simple and portable.',
          'It allows the project to behave like a static site while still generating rich editorial routes from structured sources.',
        ],
      },
      {
        title: 'Where it is used',
        paragraphs: [
          'Node powers the blog generator, the project and tools generator, local scripts, and the dependency graph behind the build process.',
          'It also provides the environment where route manifests can be validated before the frontend ever ships.',
        ],
      },
      {
        title: 'Guardrails',
        paragraphs: [
          'Script output must remain deterministic so the repo does not accumulate confusing state across builds. Generated files should only depend on declared content sources and base path configuration.',
          'The project avoids turning Node scripts into a hidden backend. Their role is build-time transformation only.',
        ],
      },
    ],
  },
  {
    slug: 'gsap',
    order: 40,
    featured: true,
    name: 'GSAP',
    group: 'Motion',
    icon: 'sparkles',
    summary: 'Timeline control for hero staging, scroll reveals, and premium movement systems with explicit ownership boundaries.',
    excerpt:
      'GSAP owns page-level movement in Lunerya, from hero timing to the tech slider and section reveals, without taking control of the content layer.',
    description: 'Tool profile for GSAP in the Lunerya stack, covering hero motion, scroll reveal, and timeline ownership.',
    accent: 'topaz',
    tags: ['Motion', 'Scroll', 'Timeline'],
    officialHref: 'https://gsap.com/',
    relatedProjects: ['pulse-atlas', 'void-relay'],
    responsibilities: ['Hero staging', 'Scroll reveal', 'Section transitions', 'Tech slider loop'],
    constraints: ['Reduced-motion fallback', 'Transform-only animation policy'],
    highlights: [
      { label: 'Role', value: 'Timeline engine' },
      { label: 'Ownership', value: 'Page-level motion' },
    ],
    sections: [
      {
        title: 'Why it is in the stack',
        paragraphs: [
          'GSAP is used where animation timing needs to feel authored rather than incidental. It gives the site precise control over hero entrance, reveal sequences, and long-running motion systems.',
          'That control matters because premium motion only feels expensive when pacing, overlap, and ownership are intentional.',
        ],
      },
      {
        title: 'Where it is used',
        paragraphs: [
          'The homepage hero, section reveals, and tech stack slider all rely on GSAP timelines. It is also the boundary line between structural motion and lighter hover feedback.',
          'Using a single timeline owner for page-level motion keeps interactions coherent and reduces transform conflicts.',
        ],
      },
      {
        title: 'Guardrails',
        paragraphs: [
          'GSAP does not own content rendering. It only stages already-rendered elements and must respect reduced-motion preferences.',
          'Animations stay limited to opacity, transform, and CSS variables so layout remains stable under load.',
        ],
      },
    ],
  },
  {
    slug: 'anime-js',
    order: 50,
    featured: false,
    name: 'Anime.js',
    group: 'Motion',
    icon: 'waypoints',
    summary: 'Micro-interactions stay tactile, fast, and separate from the main motion orchestration layer.',
    excerpt:
      'Anime.js handles the local feel of buttons, cards, and UI affordances so page-level animation can stay isolated under GSAP.',
    description: 'Tool profile for Anime.js in the Lunerya stack, covering micro-interactions and local motion behavior.',
    accent: 'amethyst',
    tags: ['Micro Interactions', 'Hover States', 'UI Feedback'],
    officialHref: 'https://animejs.com/',
    relatedProjects: ['signal-forge'],
    responsibilities: ['CTA feedback', 'Hover response', 'Local UI motion'],
    constraints: ['Must not fight GSAP transforms', 'Reserved for element-local feedback'],
    highlights: [
      { label: 'Role', value: 'Interaction micro-layer' },
      { label: 'Scope', value: 'Element-local motion' },
    ],
    sections: [
      {
        title: 'Why it is in the stack',
        paragraphs: [
          'Not every animation in the interface deserves a full timeline system. Anime.js is used for the local, tactile motions that make controls feel responsive without expanding the global motion layer.',
          'That separation keeps the codebase easier to reason about because page choreography and micro-feedback do not compete for the same transforms.',
        ],
      },
      {
        title: 'Where it is used',
        paragraphs: [
          'Buttons, cards, and smaller UI affordances use Anime.js for hover and state transitions. It adds tactility without bringing more complexity into content rendering.',
          'This is especially useful in systems work like Signal Forge where many small interactions need a consistent feel.',
        ],
      },
      {
        title: 'Guardrails',
        paragraphs: [
          'Anime.js should not own layout-affecting properties or long-running scroll behavior. Those cases belong to GSAP or should stay in CSS.',
          'When a component already participates in a GSAP transform flow, Anime.js must avoid conflicting movement on the same axis.',
        ],
      },
    ],
  },
  {
    slug: 'lucide',
    order: 60,
    featured: false,
    name: 'Lucide',
    group: 'Interface',
    icon: 'badge-check',
    summary: 'A precise icon set that keeps the interface sharp without inflating the asset budget.',
    excerpt:
      'Lucide gives the site a consistent icon language with lightweight imports and enough breadth to support both homepage UI and editorial inner pages.',
    description: 'Tool profile for Lucide in the Lunerya stack, covering icon consistency and bundle discipline.',
    accent: 'mist',
    tags: ['Icons', 'Bundle Discipline', 'Interface Polish'],
    officialHref: 'https://lucide.dev/',
    relatedProjects: ['signal-forge', 'void-relay'],
    responsibilities: ['Icon rendering', 'Shared affordance language', 'Button and metadata cues'],
    constraints: ['Only import used icons', 'Map keys must match createIcons resolution'],
    highlights: [
      { label: 'Role', value: 'Interface iconography' },
      { label: 'Strength', value: 'Lean imports' },
    ],
    sections: [
      {
        title: 'Why it is in the stack',
        paragraphs: [
          'Lucide is a good fit for a static portfolio because it keeps the icon language crisp without introducing a heavy icon pipeline.',
          'It also integrates cleanly with generated HTML, which is important when route content is produced at build time.',
        ],
      },
      {
        title: 'Where it is used',
        paragraphs: [
          'Icons appear in navigation controls, action buttons, metadata rows, tool cards, and related content blocks across the site.',
          'The same icon set supports both the cinematic homepage and the quieter editorial pages without feeling visually disconnected.',
        ],
      },
      {
        title: 'Guardrails',
        paragraphs: [
          'Only used icons should be imported so the bundle stays disciplined. The icon registry also has to stay in sync with the data-lucide attributes used across generated pages.',
          'Icon styling should remain secondary to typography and spacing rather than taking over the interface.',
        ],
      },
    ],
  },
  {
    slug: 'three-js',
    order: 70,
    featured: true,
    name: 'Three.js',
    group: 'Experience',
    icon: 'cpu',
    summary: 'WebGL depth for particles, geometry, and atmosphere where it meaningfully improves the scene.',
    excerpt:
      'Three.js is used as atmosphere, not decoration: a bounded background system that adds depth without taking ownership of the reading experience.',
    description: 'Tool profile for Three.js in the Lunerya stack, covering particle backgrounds, geometry, and WebGL boundaries.',
    accent: 'amethyst',
    tags: ['WebGL', 'Background Atmosphere', 'Progressive Enhancement'],
    officialHref: 'https://threejs.org/',
    relatedProjects: ['pulse-atlas'],
    responsibilities: ['Particle field', 'Hero atmosphere', 'Scene lifecycle'],
    constraints: ['Disabled on reduced motion', 'Must pause when not visible', 'Never block content'],
    highlights: [
      { label: 'Role', value: 'Atmospheric depth' },
      { label: 'Boundary', value: 'Canvas-only ownership' },
    ],
    sections: [
      {
        title: 'Why it is in the stack',
        paragraphs: [
          'Three.js is included because some interfaces benefit from spatial atmosphere that CSS alone cannot provide. In Lunerya, that is used selectively for the hero environment and not as a blanket effect everywhere.',
          'The goal is depth and identity, not a benchmark demo. The page still has to read clearly and degrade cleanly.',
        ],
      },
      {
        title: 'Where it is used',
        paragraphs: [
          'The homepage hero runs a bounded particle scene and subtle parallax geometry. Inner editorial pages deliberately avoid loading that layer so reading performance stays clean.',
          'This keeps the premium feel where it matters most without taxing the rest of the site.',
        ],
      },
      {
        title: 'Guardrails',
        paragraphs: [
          'WebGL is treated as progressive enhancement. It must not intercept content, must pause when the page is hidden, and must be skipped entirely when the device or user preference calls for a lighter experience.',
          'The canvas owns only its own scene and never becomes a dependency for the page structure.',
        ],
      },
    ],
  },
  {
    slug: 'static-deploy',
    order: 80,
    featured: false,
    name: 'Static Deploy',
    group: 'Delivery',
    icon: 'cloud',
    summary: 'The site is built to ship cleanly on Vercel, Netlify, or GitHub Pages with minimal runtime risk.',
    excerpt:
      'Static deployment is a first-class design constraint in Lunerya, shaping route generation, asset paths, and the way enhancements are layered onto content.',
    description: 'Tool profile for Lunerya static deployment strategy across Vercel, Netlify, and GitHub Pages.',
    accent: 'topaz',
    tags: ['Vercel', 'Netlify', 'GitHub Pages'],
    officialHref: 'https://vercel.com/',
    relatedProjects: ['void-relay'],
    responsibilities: ['Hosting strategy', 'Generated routes', 'Base path compatibility'],
    constraints: ['Base-aware internal links', 'No runtime CMS dependency'],
    highlights: [
      { label: 'Role', value: 'Delivery surface' },
      { label: 'Priority', value: 'Host compatibility' },
    ],
    sections: [
      {
        title: 'Why it is in the stack',
        paragraphs: [
          'Static deployment keeps the site simple to host and resilient to runtime failure. That choice influences the architecture as much as any visual decision does.',
          'Generated routes, build-time manifests, and relative paths all exist because deployment is treated as part of the system design.',
        ],
      },
      {
        title: 'Where it is used',
        paragraphs: [
          'Every content route in the project is produced for static output, including the journal, project archive, tool index, and each detail page.',
          'The build is expected to run across Vercel, Netlify, and GitHub Pages with only base-path adjustments where necessary.',
        ],
      },
      {
        title: 'Guardrails',
        paragraphs: [
          'Static hosting only works smoothly when links, routes, and assets are all generated with deployment constraints in mind. Hidden assumptions about routing are not allowed.',
          'The project also avoids runtime content dependencies so the site stays portable and stable.',
        ],
      },
    ],
  },
  {
    slug: 'accessible-fallbacks',
    order: 90,
    featured: false,
    name: 'Accessible Fallbacks',
    group: 'Delivery',
    icon: 'mail',
    summary: 'The experience remains readable and usable when motion is reduced, JavaScript is unavailable, or enhancement layers are skipped.',
    excerpt:
      'Accessible fallbacks are part of the product definition, ensuring the site keeps its hierarchy and intent even when the premium layers step aside.',
    description: 'Tool profile for accessibility and fallback strategy in the Lunerya stack.',
    accent: 'mist',
    tags: ['Reduced Motion', 'Resilience', 'Graceful Degradation'],
    relatedProjects: ['pulse-atlas', 'void-relay'],
    responsibilities: ['Reduced-motion strategy', 'No-JS readability', 'Progressive enhancement boundaries'],
    constraints: ['Content must stand without motion', 'Fallback behavior should be explicit, not accidental'],
    highlights: [
      { label: 'Role', value: 'Resilience layer' },
      { label: 'Priority', value: 'Readable without enhancement' },
    ],
    sections: [
      {
        title: 'Why it is in the stack',
        paragraphs: [
          'Premium interfaces are only credible when they still work without their premium layers. Accessible fallbacks make sure the product holds its structure when motion is reduced or unavailable.',
          'That principle also improves maintainability because the content model is never allowed to depend entirely on animation.',
        ],
      },
      {
        title: 'Where it is used',
        paragraphs: [
          'Reduced-motion checks gate the motion layer, Three.js is optional, and the static HTML remains meaningful when JavaScript does not run.',
          'Contact paths, editorial routes, and archive pages all preserve utility without depending on enhancement.',
        ],
      },
      {
        title: 'Guardrails',
        paragraphs: [
          'Fallbacks need to be designed, not assumed. Each enhancement layer should have an explicit off-state that still leaves a coherent page behind.',
          'This also means performance decisions and accessibility decisions should be treated as the same class of engineering concern.',
        ],
      },
    ],
  },
]
