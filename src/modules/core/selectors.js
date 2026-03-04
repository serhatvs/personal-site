export function getElements() {
  return {
    body: document.body,
    canvas: document.getElementById('bg-canvas'),
    header: document.querySelector('[data-site-header]'),
    menuToggle: document.querySelector('[data-menu-toggle]'),
    menuCloseButtons: [...document.querySelectorAll('[data-menu-close]')],
    mobileMenu: document.querySelector('[data-mobile-menu]'),
    projects: document.querySelector('[data-projects]'),
    blogPreview: document.querySelector('[data-blog-preview]'),
    stack: document.querySelector('[data-stack]'),
    stats: document.querySelector('[data-stats]'),
    socials: [...document.querySelectorAll('[data-socials-contact], [data-socials-footer]')],
    contactForm: document.querySelector('[data-contact-form]'),
    formStatus: document.querySelector('[data-form-status]'),
    submitButton: document.querySelector('[data-submit-button]'),
    toastRoot: document.getElementById('toast-root'),
    currentYear: [...document.querySelectorAll('[data-current-year]')],
  }
}
