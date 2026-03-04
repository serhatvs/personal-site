export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    )
  } catch {
    return false
  }
}

export function scheduleEnhancement(task, timeout = 150) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      void task()
    }, { timeout })
    return
  }

  window.setTimeout(() => {
    void task()
  }, timeout)
}

export async function startMotionEnhancements() {
  const [{ gsap }, { ScrollTrigger }, { initHeroTimeline }, { initSectionReveals }, { initInteractions }, anime] =
    await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('../animations/hero-timeline.js'),
      import('../animations/section-reveals.js'),
      import('../animations/interactions.js'),
      import('animejs'),
    ])

  gsap.registerPlugin(ScrollTrigger)
  initHeroTimeline(gsap)
  initSectionReveals(gsap, ScrollTrigger)
  initInteractions(anime)
}

export async function startThreeEnhancement(canvas) {
  const { initThreeScene } = await import('../three/scene.js')
  return initThreeScene(canvas)
}
