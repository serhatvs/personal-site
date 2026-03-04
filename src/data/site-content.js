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
    { name: 'Vite', group: 'Core Runtime', icon: 'workflow' },
    { name: 'TailwindCSS', group: 'Core Runtime', icon: 'boxes' },
    { name: 'Node.js', group: 'Core Runtime', icon: 'database' },
    { name: 'GSAP', group: 'Motion Layer', icon: 'sparkles' },
    { name: 'Anime.js', group: 'Motion Layer', icon: 'waypoints' },
    { name: 'Lucide', group: 'Motion Layer', icon: 'badge-check' },
    { name: 'Three.js', group: 'Experience Layer', icon: 'cpu' },
    { name: 'Static Deploy', group: 'Experience Layer', icon: 'cloud' },
    { name: 'Accessible Fallbacks', group: 'Experience Layer', icon: 'mail' },
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
