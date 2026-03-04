import { getToolsHref } from './content-utils.js'

const accentByName = {
  amethyst: '197, 157, 217',
  topaz: '230, 165, 32',
  mist: '193, 196, 200',
}

function renderTags(tags = []) {
  return tags
    .slice(0, 2)
    .map((tag) => `<span class="chip !px-3 !py-1.5 !text-[0.62rem] !tracking-[0.18em]">${tag}</span>`)
    .join('')
}

export function renderStack(container, stackItems, options = {}) {
  if (!container) {
    return
  }

  if (!stackItems.length) {
    container.innerHTML = `
      <article class="glass-panel rounded-[2rem] p-8 text-sm text-mist-200/70">
        Tool index is being prepared.
      </article>
    `
    return
  }

  const archiveHref = getToolsHref()

  container.innerHTML = `
    <div data-reveal-item class="tech-gallery-shell">
      <div class="tech-gallery glass-panel" data-tech-gallery>
        <ul class="tech-cards" data-tech-cards aria-label="Technology slider">
          ${stackItems
            .map(
              (item, index) => `
                <li
                  class="tech-card"
                  data-tech-card
                  style="--tech-accent:${accentByName[item.accent] || '197, 157, 217'};"
                >
                  <article class="tech-card__surface">
                    <div class="flex items-start justify-between gap-5">
                      <div>
                        <span class="chip chip-ghost tech-card__group">${item.group}</span>
                        <h3 class="mt-5 text-[clamp(1.85rem,4vw,2.8rem)] font-display font-semibold tracking-[-0.05em] text-mist-50">
                          ${item.name}
                        </h3>
                      </div>
                      <span class="icon-frame tech-card__icon">
                        <i data-lucide="${item.icon}"></i>
                      </span>
                    </div>

                    <p class="mt-5 max-w-md text-sm leading-7 text-mist-200/74 md:text-base">
                      ${item.summary}
                    </p>

                    <div class="mt-6 flex flex-wrap gap-2">
                      ${renderTags(item.tags)}
                    </div>

                    <div class="mt-auto flex items-center justify-between gap-4 pt-8">
                      <div class="flex items-center gap-4">
                        <span class="eyebrow text-mist-200/55">Module ${String(index + 1).padStart(2, '0')}</span>
                        <span class="tech-card__pulse" aria-hidden="true"></span>
                      </div>
                      <a href="${item.href}" class="social-link !px-4 !py-2.5 !text-[0.68rem] !tracking-[0.22em]">
                        Open tool
                        <i data-lucide="arrow-up-right"></i>
                      </a>
                    </div>
                  </article>
                </li>
              `,
            )
            .join('')}
        </ul>
      </div>

      <div class="tech-actions">
        <button
          type="button"
          class="tech-control"
          data-tech-autoplay-toggle
          data-interaction="button"
          aria-pressed="false"
          aria-label="Pause automatic slider rotation"
        >
          Pause Auto
        </button>
        <button
          type="button"
          class="tech-control"
          data-tech-prev
          data-interaction="button"
          aria-label="Previous technology"
        >
          Prev
        </button>
        <button
          type="button"
          class="tech-control"
          data-tech-next
          data-interaction="button"
          aria-label="Next technology"
        >
          Next
        </button>
      </div>

      <div class="flex justify-end">
        <a href="${archiveHref}" data-tools-cta class="void-button void-button-ghost">
          ${options.archiveCtaLabel || 'Open tools index'}
          <i data-lucide="arrow-right"></i>
        </a>
      </div>

      <div class="tech-drag-proxy" data-tech-drag-proxy aria-hidden="true"></div>
    </div>
  `
}
