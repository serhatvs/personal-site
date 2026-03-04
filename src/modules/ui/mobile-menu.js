function getFocusableElements(container) {
  return [...container.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])')].filter(
    (element) => !element.hasAttribute('hidden'),
  )
}

export function initMobileMenu({ body, mobileMenu, menuToggle, menuCloseButtons }) {
  if (!body || !mobileMenu || !menuToggle) {
    return {
      close() {},
    }
  }

  let lastFocusedElement = null

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      close()
      return
    }

    if (event.key !== 'Tab') {
      return
    }

    const focusableElements = getFocusableElements(mobileMenu)

    if (!focusableElements.length) {
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  const open = () => {
    lastFocusedElement = document.activeElement
    mobileMenu.hidden = false
    body.classList.add('menu-open')
    menuToggle.setAttribute('aria-expanded', 'true')
    document.addEventListener('keydown', handleKeydown)

    const [firstElement] = getFocusableElements(mobileMenu)
    firstElement?.focus()
  }

  const close = () => {
    if (mobileMenu.hidden) {
      return
    }

    mobileMenu.hidden = true
    body.classList.remove('menu-open')
    menuToggle.setAttribute('aria-expanded', 'false')
    document.removeEventListener('keydown', handleKeydown)
    lastFocusedElement?.focus()
  }

  menuToggle.addEventListener('click', () => {
    if (mobileMenu.hidden) {
      open()
    } else {
      close()
    }
  })

  menuCloseButtons.forEach((button) => {
    button.addEventListener('click', close)
  })

  mobileMenu.addEventListener('click', (event) => {
    if (event.target === mobileMenu) {
      close()
    }
  })

  return {
    close,
  }
}
