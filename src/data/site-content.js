export const siteContent = {
  brand: 'Lunerya',
  nav: [
    { label: 'Origin', target: 'about' },
    { label: 'Creations', target: 'projects' },
    { label: 'Tools', target: 'stack' },
    { label: 'Metrics', target: 'stats' },
    { label: 'Transmission', target: 'contact' },
  ],
  contact: {
    email: 'hello@lunerya.dev',
  },
  projects: [
    {
      title: 'Pulse Atlas',
      category: 'AI Launch System',
      summary:
        'A cinematic launch site for an AI tooling platform, built as a static-first experience with product storytelling, motion staging, and a performance-aware asset strategy.',
      stack: ['Vite', 'GSAP', 'Three.js'],
      href: 'https://github.com/',
      accent: {
        from: '#7A3F91',
        to: '#C59DD9',
      },
    },
    {
      title: 'Signal Forge',
      category: 'Design System',
      summary:
        'A premium component system for product marketing pages, focused on reusable sections, interaction consistency, and fast deployment across campaign microsites.',
      stack: ['TailwindCSS', 'Anime.js', 'Lucide'],
      href: 'https://github.com/',
      accent: {
        from: '#E6A520',
        to: '#FFD77A',
      },
    },
    {
      title: 'Void Relay',
      category: 'Frontend Architecture',
      summary:
        'A modular frontend foundation for immersive interfaces, combining clear rendering boundaries, motion ownership, and static deployment paths for fast delivery.',
      stack: ['Node.js', 'Vercel', 'Netlify'],
      href: 'https://github.com/',
      accent: {
        from: '#C59DD9',
        to: '#E6A520',
      },
    },
  ],
  stack: [
    {
      name: 'Vite',
      group: 'Core Runtime',
      icon: 'workflow',
      summary: 'Fast module graph, clean dev ergonomics, and static build output that stays lean.',
    },
    {
      name: 'TailwindCSS',
      group: 'Core Runtime',
      icon: 'boxes',
      summary: 'A utility-first system for the Void Edition palette, glass layers, and layout rhythm.',
    },
    {
      name: 'Node.js',
      group: 'Core Runtime',
      icon: 'database',
      summary: 'Predictable tooling for installs, builds, and deployment handoff across static hosts.',
    },
    {
      name: 'GSAP',
      group: 'Motion Layer',
      icon: 'sparkles',
      summary: 'Timeline control for hero staging, scroll reveals, and premium movement systems.',
    },
    {
      name: 'Anime.js',
      group: 'Motion Layer',
      icon: 'waypoints',
      summary: 'Micro-interactions stay light, tactile, and isolated from the larger scene choreography.',
    },
    {
      name: 'Lucide',
      group: 'Motion Layer',
      icon: 'badge-check',
      summary: 'A precise icon set that keeps the interface sharp without inflating the asset budget.',
    },
    {
      name: 'Three.js',
      group: 'Experience Layer',
      icon: 'cpu',
      summary: 'WebGL depth for particles, geometry, and subtle atmosphere where it actually matters.',
    },
    {
      name: 'Static Deploy',
      group: 'Experience Layer',
      icon: 'cloud',
      summary: 'Built to ship cleanly on Vercel, Netlify, or GitHub Pages with minimal runtime risk.',
    },
    {
      name: 'Accessible Fallbacks',
      group: 'Experience Layer',
      icon: 'mail',
      summary: 'The experience keeps reading clearly when animation is reduced or enhancement is absent.',
    },
  ],
  stats: [
    {
      label: 'Systems shipped',
      value: 12,
      suffix: '+',
      detail: 'Production launches and interface systems',
    },
    {
      label: 'Interactive modules',
      value: 18,
      suffix: '',
      detail: 'Reusable sections with scoped motion ownership',
    },
    {
      label: 'Animation budget',
      value: 90,
      suffix: 'fps',
      detail: 'Targeted for feel, trimmed for performance',
    },
    {
      label: 'Deploy targets',
      value: 3,
      suffix: '',
      detail: 'Vercel, Netlify, and GitHub Pages',
    },
  ],
  socials: [
    {
      label: 'GitHub',
      href: 'https://github.com/',
      icon: 'github',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/',
      icon: 'linkedin',
    },
    {
      label: 'X',
      href: 'https://x.com/',
      icon: 'twitter',
    },
  ],
}
