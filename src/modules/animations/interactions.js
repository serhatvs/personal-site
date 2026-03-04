export function initInteractions(anime) {
  const { animate } = anime

  const buttonTargets = [...document.querySelectorAll('[data-interaction="button"]')]
  const projectCards = [...document.querySelectorAll('.js-project-card')]
  const techTiles = [...document.querySelectorAll('.js-tech-tile')]
  const socialLinks = [...document.querySelectorAll('[data-social-link]')]

  const bindHoverAnimation = (elements, enterProps, leaveProps) => {
    elements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        animate(element, enterProps)
      })

      element.addEventListener('mouseleave', () => {
        animate(element, leaveProps)
      })
    })
  }

  bindHoverAnimation(
    buttonTargets,
    {
      translateY: -4,
      scale: 1.01,
      duration: 240,
      ease: 'outQuad',
    },
    {
      translateY: 0,
      scale: 1,
      duration: 360,
      ease: 'outElastic(1, .6)',
    },
  )

  bindHoverAnimation(
    projectCards,
    {
      translateY: -10,
      scale: 1.01,
      duration: 320,
      ease: 'outCubic',
    },
    {
      translateY: 0,
      scale: 1,
      duration: 420,
      ease: 'outElastic(1, .55)',
    },
  )

  bindHoverAnimation(
    techTiles,
    {
      translateY: -6,
      scale: 1.015,
      duration: 260,
      ease: 'outQuad',
    },
    {
      translateY: 0,
      scale: 1,
      duration: 360,
      ease: 'outElastic(1, .5)',
    },
  )

  bindHoverAnimation(
    socialLinks,
    {
      translateY: -4,
      scale: 1.01,
      duration: 220,
      ease: 'outQuad',
    },
    {
      translateY: 0,
      scale: 1,
      duration: 320,
      ease: 'outElastic(1, .55)',
    },
  )
}
