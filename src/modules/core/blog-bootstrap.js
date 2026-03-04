import { siteContent } from '@/data/site-content.js'
import { renderSocials } from '../render/render-socials.js'
import { initIcons } from '../ui/icons.js'
import { initMobileMenu } from '../ui/mobile-menu.js'

export function bootstrapBlogPage({ renderMain } = {}) {
  renderMain?.()

  renderSocials(
    [...document.querySelectorAll('[data-socials-footer]')],
    siteContent.socials,
  )

  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear())
  })

  initIcons()

  initMobileMenu({
    body: document.body,
    mobileMenu: document.querySelector('[data-mobile-menu]'),
    menuToggle: document.querySelector('[data-menu-toggle]'),
    menuCloseButtons: [...document.querySelectorAll('[data-menu-close]')],
  })
}
