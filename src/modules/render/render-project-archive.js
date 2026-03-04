function renderStack(stack) {
  return stack
    .slice(0, 4)
    .map((item) => `<span class="chip !px-3 !py-1.5 !text-[0.64rem] !tracking-[0.2em]">${item}</span>`)
    .join('')
}

export function renderProjectArchive(container, projects) {
  if (!container) {
    return
  }

  if (!projects.length) {
    container.innerHTML = `
      <article class="glass-panel rounded-[2rem] p-8 text-sm text-mist-200/70">
        Project archive is being assembled.
      </article>
    `
    return
  }

  container.innerHTML = projects
    .map(
      (project) => `
        <article class="editorial-card editorial-card--project">
          <div class="editorial-card__meta">
            <span class="chip chip-ghost">${project.category}</span>
            <span>${project.year || 'Current'} · ${project.status || 'Current build'}</span>
          </div>

          <h2 class="editorial-card__title">${project.title}</h2>
          <p class="editorial-card__excerpt">${project.summary}</p>

          <div class="editorial-card__tags">
            ${renderStack(project.stack)}
          </div>

          <div class="editorial-card__footer">
            <span class="eyebrow text-amethyst-200">${project.role || 'Case study'}</span>
            <div class="flex items-center gap-4">
              ${
                project.links?.live
                  ? `<a href="${project.links.live}" class="editorial-inline-link" target="_blank" rel="noreferrer">Live site</a>`
                  : ''
              }
              <a href="${project.href}" class="social-link">
                Open case
                <i data-lucide="arrow-up-right"></i>
              </a>
            </div>
          </div>
        </article>
      `,
    )
    .join('')
}
