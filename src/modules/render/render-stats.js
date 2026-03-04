export function formatStatValue(value, suffix = '') {
  return `${value}${suffix}`
}

export function renderStats(container, stats) {
  if (!container) {
    return
  }

  container.innerHTML = stats
    .map(
      (stat) => `
        <article data-reveal-item class="stat-panel">
          <div>
            <p class="eyebrow text-amethyst-200">${stat.label}</p>
            <div
              data-counter
              data-counter-value="${stat.value}"
              data-counter-suffix="${stat.suffix}"
              class="mt-4 text-5xl font-display tracking-[-0.06em] text-mist-50"
            >
              ${formatStatValue(stat.value, stat.suffix)}
            </div>
          </div>
          <p class="mt-6 text-sm leading-7 text-mist-200/65">${stat.detail}</p>
        </article>
      `,
    )
    .join('')
}
