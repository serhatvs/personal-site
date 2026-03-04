export function renderSocials(containers, socials) {
  containers.forEach((container) => {
    if (!container) {
      return
    }

    const isFooter = container.dataset.socialStyle === 'footer'

    container.innerHTML = socials
      .map(
        (social) => `
          <a
            href="${social.href}"
            class="social-link ${isFooter ? 'social-link-footer' : ''}"
            target="_blank"
            rel="noreferrer"
            data-social-link
          >
            <i data-lucide="${social.icon}"></i>
            <span>${social.label}</span>
          </a>
        `,
      )
      .join('')
  })
}
