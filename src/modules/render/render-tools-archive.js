function renderTags(tags) {
  return tags
    .slice(0, 3)
    .map((tag) => `<span class="chip !px-3 !py-1.5 !text-[0.64rem] !tracking-[0.2em]">${tag}</span>`)
    .join('')
}

export function renderToolsArchive(container, tools) {
  if (!container) {
    return
  }

  if (!tools.length) {
    container.innerHTML = `
      <article class="glass-panel rounded-[2rem] p-8 text-sm text-mist-200/70">
        Tool index is being prepared.
      </article>
    `
    return
  }

  container.innerHTML = tools
    .map(
      (tool) => `
        <article class="editorial-card editorial-card--tool">
          <div class="editorial-card__meta">
            <span class="chip chip-ghost">${tool.group}</span>
            <span class="icon-frame h-11 w-11 text-mist-50">
              <i data-lucide="${tool.icon}"></i>
            </span>
          </div>

          <h2 class="editorial-card__title">${tool.name}</h2>
          <p class="editorial-card__excerpt">${tool.summary}</p>

          <div class="editorial-card__tags">
            ${renderTags(tool.tags)}
          </div>

          <div class="editorial-card__footer">
            <span class="eyebrow text-topaz-300">${tool.group}</span>
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
