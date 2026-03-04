export const projectRecords = [
  {
    slug: 'pulse-atlas',
    order: 10,
    featured: true,
    title: 'Pulse Atlas',
    category: 'AI Launch System',
    summary:
      'A cinematic launch site for an AI tooling platform, built as a static-first experience with product storytelling, motion staging, and a performance-aware asset strategy.',
    excerpt:
      'Pulse Atlas turns a dense AI platform pitch into a paced launch experience with clear architecture, premium motion, and static delivery discipline.',
    description:
      'Case study for Pulse Atlas, an AI launch system focused on motion staging, static architecture, and premium product storytelling.',
    year: '2026',
    status: 'Concept Launch',
    accent: 'amethyst',
    tags: ['AI Presentation', 'Motion Design', 'Static Architecture'],
    stack: ['Vite', 'GSAP', 'Three.js'],
    links: {
      repo: 'https://github.com/serhatvs/personal-site',
    },
    role: 'System Architect & Developer',
    scope: ['Frontend architecture', 'Hero motion system', 'Static deployment strategy'],
    highlights: [
      { label: 'Build Model', value: 'Static-first' },
      { label: 'Motion Owner', value: 'GSAP + Three.js' },
      { label: 'Delivery Path', value: 'Vercel-ready' },
    ],
    sections: [
      {
        title: 'Challenge',
        paragraphs: [
          'The product story needed to feel cinematic without collapsing into an overbuilt marketing shell. The core problem was how to stage a premium AI launch while keeping the structure simple enough to ship and maintain.',
          'The brief demanded atmosphere, depth, and trust signals, but the experience still had to load like a static site and stay legible when enhancement was unavailable.',
        ],
      },
      {
        title: 'System Decisions',
        paragraphs: [
          'The interface was split into static content ownership, GSAP-controlled reveal timelines, and a bounded Three.js background layer. That prevented animation logic from leaking into content rendering and kept each concern testable.',
          'Visual density was concentrated in the hero and preview modules, while the rest of the page relied on disciplined spacing, glass surfaces, and clear narrative ordering rather than constant visual noise.',
        ],
      },
      {
        title: 'Outcome',
        paragraphs: [
          'Pulse Atlas reads like a high-trust product launch while preserving a fast static deployment model. The experience feels deliberate on capable devices and remains coherent when motion is reduced.',
          'The case demonstrates the core Lunerya pattern: premium visual identity, explicit motion ownership, and architecture that stays clean under delivery pressure.',
        ],
      },
    ],
  },
  {
    slug: 'signal-forge',
    order: 20,
    featured: true,
    title: 'Signal Forge',
    category: 'Design System',
    summary:
      'A premium component system for product marketing pages, focused on reusable sections, interaction consistency, and fast deployment across campaign microsites.',
    excerpt:
      'Signal Forge is a campaign-ready design system where expressive sections, reusable primitives, and motion rules are packaged for fast execution.',
    description:
      'Case study for Signal Forge, a premium design system for fast campaign delivery and interaction consistency.',
    year: '2025',
    status: 'System Build',
    accent: 'topaz',
    tags: ['Design Systems', 'Reusable Sections', 'Campaign Delivery'],
    stack: ['TailwindCSS', 'Anime.js', 'Lucide'],
    links: {
      repo: 'https://github.com/serhatvs/personal-site',
    },
    role: 'System Architect & Developer',
    scope: ['Design tokens', 'Interaction patterns', 'Component delivery'],
    highlights: [
      { label: 'Primary Goal', value: 'Reuse without drift' },
      { label: 'Interaction Layer', value: 'Anime.js microsystems' },
      { label: 'Interface Surface', value: 'Marketing pages' },
    ],
    sections: [
      {
        title: 'Challenge',
        paragraphs: [
          'Marketing teams needed premium sections that could be recombined quickly without turning each landing page into a one-off rebuild. The system had to feel polished but not rigid.',
          'That required a structure where typography, layout rhythm, and interaction behavior could stay consistent across launches while still supporting different campaign tones.',
        ],
      },
      {
        title: 'System Decisions',
        paragraphs: [
          'Signal Forge treats components as narrative blocks rather than isolated widgets. Tokens, glass surfaces, icon treatment, and CTA behavior were standardized so new pages could be assembled with less custom styling debt.',
          'Anime.js was reserved for local feedback states, keeping micro-interactions responsive and avoiding conflicts with larger page transitions or layout updates.',
        ],
      },
      {
        title: 'Outcome',
        paragraphs: [
          'The result is a design system that can scale across campaigns without losing tone. Sections feel related, motion stays tactile, and launch teams can move quickly without sacrificing polish.',
          'It also provides a cleaner handoff model because visual rules are encoded in reusable patterns instead of living only in mockups.',
        ],
      },
    ],
  },
  {
    slug: 'void-relay',
    order: 30,
    featured: false,
    title: 'Void Relay',
    category: 'Frontend Architecture',
    summary:
      'A modular frontend foundation for immersive interfaces, combining clear rendering boundaries, motion ownership, and static deployment paths for fast delivery.',
    excerpt:
      'Void Relay is the architectural layer behind premium frontend builds where rendering boundaries, enhancement strategy, and deployment clarity matter as much as the visuals.',
    description:
      'Case study for Void Relay, a modular frontend architecture built for immersive interfaces and static delivery.',
    year: '2026',
    status: 'Architecture Track',
    accent: 'mist',
    tags: ['Architecture', 'Progressive Enhancement', 'Static Delivery'],
    stack: ['Node.js', 'Vercel', 'Netlify'],
    links: {
      repo: 'https://github.com/serhatvs/personal-site',
    },
    role: 'System Architect & Developer',
    scope: ['Module boundaries', 'Deployment strategy', 'Operational guardrails'],
    highlights: [
      { label: 'Rendering Model', value: 'Static output' },
      { label: 'Target Hosts', value: 'Vercel / Netlify / GitHub Pages' },
      { label: 'Core Principle', value: 'Motion never owns content' },
    ],
    sections: [
      {
        title: 'Challenge',
        paragraphs: [
          'Export-heavy concepts often arrive with tangled markup, duplicate behaviors, and no clear path to production. The challenge was to turn that kind of visual output into a maintainable frontend base.',
          'The solution needed to support premium motion and atmosphere without giving up the predictability of static delivery or the ability to reason about modules cleanly.',
        ],
      },
      {
        title: 'System Decisions',
        paragraphs: [
          'Void Relay separates content rendering, UI behavior, timeline ownership, and WebGL enhancement into explicit modules. Each layer has a narrow job and can fail gracefully without collapsing the page.',
          'Deployment assumptions are built into the architecture from the start. Relative paths, base-aware links, and generated routes are treated as part of the system design rather than a post-build patch.',
        ],
      },
      {
        title: 'Outcome',
        paragraphs: [
          'The architecture supports immersive interfaces without losing maintainability. Teams can iterate on visuals and motion while keeping a stable content model and predictable deployment story.',
          'Void Relay is less about a single screen and more about protecting the quality of the whole product surface over time.',
        ],
      },
    ],
  },
]
