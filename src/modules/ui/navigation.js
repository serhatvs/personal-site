function getUniqueSections(targets) {
  return [...new Set(targets.map((button) => button.dataset.scrollTarget))]
    .map((id) => document.getElementById(id))
    .filter(Boolean)
}

export function initNavigation({ header, onNavigate }) {
  const targets = [...document.querySelectorAll('[data-scroll-target]')]
  const sections = getUniqueSections(targets)

  const scrollToSection = (id) => {
    const target = document.getElementById(id)

    if (!target) {
      return
    }

    const headerOffset = header?.offsetHeight ?? 0
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 12

    window.scrollTo({
      top,
      behavior: 'smooth',
    })
  }

  targets.forEach((button) => {
    button.addEventListener('click', () => {
      scrollToSection(button.dataset.scrollTarget)
      onNavigate?.()
    })
  })

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting)

      if (!visibleEntries.length) {
        return
      }

      visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      const activeId = visibleEntries[0].target.id

      targets.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.scrollTarget === activeId)
      })
    },
    {
      threshold: [0.2, 0.4, 0.6],
      rootMargin: '-30% 0px -45% 0px',
    },
  )

  sections.forEach((section) => observer.observe(section))

  const syncHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24)
  }

  syncHeader()
  window.addEventListener('scroll', syncHeader, { passive: true })
}
