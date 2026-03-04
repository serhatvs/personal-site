import { getRelatedByTags } from './content-utils.js'

function renderTags(tags) {
  return tags
    .slice(0, 3)
    .map((tag) => `<span class="chip !px-3 !py-1.5 !text-[0.64rem] !tracking-[0.2em]">${tag}</span>`)
    .join('')
}

export function renderRelatedTools(container, currentTool, tools) {
  if (!container) {
    return
  }

  const relatedTools = getRelatedByTags(
    tools,
    currentTool,
    3,
    (item, current) => (item.group === current.group ? 2 : 0),
    (left, right) => left.order - right.order,
  )

  if (!relatedTools.length) {
    container.innerHTML = `
      <article class="glass-panel rounded-[2rem] p-8 text-sm text-mist-200/70">
        More tool profiles are being prepared.
      </article>
    `
    return
  }

  container.innerHTML = relatedTools
    .map(
      (tool) => `
        <article class="editorial-card editorial-card--tool editorial-card--compact">
          <div class="editorial-card__meta">
            <span class="chip chip-ghost">${tool.group}</span>
            <span class="icon-frame h-11 w-11 text-mist-50">
              <i data-lucide="${tool.icon}"></i>
            </span>
          </div>

          <h3 class="editorial-card__title !text-[clamp(1.5rem,2.8vw,2rem)]">${tool.name}</h3>
          <p class="editorial-card__excerpt">${tool.excerpt}</p>

          <div class="editorial-card__tags">
            ${renderTags(tool.tags)}
          </div>

          <div class="editorial-card__footer">
            <span class="eyebrow text-mist-200/60">Related tool</span>
            <a href="${tool.href}" class="social-link">
              Open tool
              <i data-lucide="arrow-up-right"></i>
            </a>
          </div>
        </article>
      `,
    )
    .join('')
}
