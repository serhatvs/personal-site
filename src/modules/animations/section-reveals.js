import { formatStatValue } from '../render/render-stats.js'

function animateCounters(gsap) {
  const counters = [...document.querySelectorAll('[data-counter]')]

  counters.forEach((counter) => {
    if (counter.dataset.counterStarted === 'true') {
      return
    }

    counter.dataset.counterStarted = 'true'

    const targetValue = Number(counter.dataset.counterValue || '0')
    const suffix = counter.dataset.counterSuffix || ''
    const state = { value: 0 }

    gsap.to(state, {
      value: targetValue,
      duration: 1.35,
      ease: 'power2.out',
      snap: { value: 1 },
      onUpdate: () => {
        counter.textContent = formatStatValue(state.value, suffix)
      },
    })
  })
}

export function initSectionReveals(gsap, ScrollTrigger) {
  const sections = gsap.utils.toArray('[data-reveal]')

  sections.forEach((section) => {
    const targets = [...section.querySelectorAll('[data-reveal-item]')]

    if (!targets.length) {
      return
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap.fromTo(
          targets,
          {
            y: 28,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            overwrite: 'auto',
          },
        )
      },
    })
  })

  const statsShell = document.querySelector('[data-stats-shell]')

  if (statsShell) {
    ScrollTrigger.create({
      trigger: statsShell,
      start: 'top 72%',
      once: true,
      onEnter: () => animateCounters(gsap),
    })
  }
}
