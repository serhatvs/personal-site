function renderTags(tags) {
  return tags
    .slice(0, 2)
    .map((tag) => `<span class="chip !px-3 !py-1.5 !text-[0.64rem] !tracking-[0.2em]">${tag}</span>`)
    .join('')
}

export function renderToolProjects(container, currentTool, projects) {
  if (!container || !currentTool) {
    return
  }

  const relatedProjects = (currentTool.relatedProjects || [])
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter(Boolean)

  if (!relatedProjects.length) {
    container.innerHTML = `
      <article class="glass-panel rounded-[2rem] p-8 text-sm text-mist-200/70">
        Related project usage will appear here once mapped.
      </article>
    `
    return
  }

  container.innerHTML = relatedProjects
    .map(
      (project) => `
        <article class="editorial-card editorial-card--project editorial-card--compact">
          <div class="editorial-card__meta">
            <span class="chip chip-ghost">${project.category}</span>
            <span>${project.year || 'Current'}</span>
          </div>

          <h3 class="editorial-card__title !text-[clamp(1.5rem,2.8vw,2rem)]">${project.title}</h3>
          <p class="editorial-card__excerpt">${project.summary}</p>

          <div class="editorial-card__tags">
            ${renderTags(project.tags)}
          </div>

          <div class="editorial-card__footer">
            <span class="eyebrow text-topaz-300">Used in project</span>
            <a href="${project.href}" class="social-link">
              Open case
              <i data-lucide="arrow-up-right"></i>
            </a>
          </div>
        </article>
      `,
    )
    .join('')
}
