import { siteContent } from '@/data/site-content.js'
import { renderSocials } from '../render/render-socials.js'
import { initIcons } from '../ui/icons.js'
import { initMobileMenu } from '../ui/mobile-menu.js'

function syncActiveLinks(pageKind) {
  document.querySelectorAll('[data-page-link]').forEach((link) => {
    link.classList.toggle('is-active', link.dataset.pageLink === pageKind)
  })
}

function syncHeaderState(header) {
  if (!header) {
    return
  }

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24)
  }

  update()
  window.addEventListener('scroll', update, { passive: true })
}

export function bootstrapEditorialPage({ renderMain, pageKind } = {}) {
  renderMain?.()

  renderSocials(
    [...document.querySelectorAll('[data-socials-footer]')],
    siteContent.socials,
  )

  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear())
  })

  syncActiveLinks(pageKind || document.body.dataset.pageKind || '')

  initMobileMenu({
    body: document.body,
    mobileMenu: document.querySelector('[data-mobile-menu]'),
    menuToggle: document.querySelector('[data-menu-toggle]'),
    menuCloseButtons: [...document.querySelectorAll('[data-menu-close]')],
  })

  syncHeaderState(document.querySelector('[data-site-header]'))
  initIcons()
}
