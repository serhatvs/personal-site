export function initHeroTimeline(gsap) {
  const titleLines = document.querySelectorAll('[data-hero-title] .hero-line')

  if (!titleLines.length) {
    return
  }

  const timeline = gsap.timeline({
    defaults: {
      duration: 0.95,
      ease: 'power3.out',
    },
  })

  timeline
    .from('[data-site-header]', { y: -28, opacity: 0, duration: 0.7 })
    .from('[data-hero-badge]', { y: 24, opacity: 0 }, 0.1)
    .from(titleLines, { yPercent: 110, opacity: 0, stagger: 0.1 }, 0.18)
    .from('[data-hero-subtitle]', { y: 24, opacity: 0 }, 0.45)
    .from('[data-hero-actions] > *', { y: 24, opacity: 0, stagger: 0.1 }, 0.55)
    .from('[data-hero-trust] > *', { y: 18, opacity: 0, stagger: 0.1 }, 0.75)
    .from('[data-hero-visual]', { scale: 0.92, opacity: 0, rotate: -6, duration: 1.1 }, 0.25)
}
