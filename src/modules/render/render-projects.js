const terminalBars = [0.86, 0.62, 0.74, 0.48]

export function renderProjects(container, projects) {
  if (!container) {
    return
  }

  container.innerHTML = projects
    .map((project, index) => {
      const stack = project.stack
        .map(
          (item) =>
            `<span class="chip !bg-white/5 !px-3 !py-1.5 !text-[0.65rem] !tracking-[0.2em]">${item}</span>`,
        )
        .join('')

      const preview = terminalBars
        .map(
          (width) =>
            `<span class="project-terminal-line block h-2" style="width:${width * 100}%"></span>`,
        )
        .join('')

      const isExternal = /^https?:\/\//.test(project.href)
      const targetAttrs = isExternal ? ' target="_blank" rel="noreferrer"' : ''

      return `
        <article
          data-reveal-item
          class="project-card void-card js-project-card"
          style="--project-accent-start:${project.accent.from};--project-accent-end:${project.accent.to};"
        >
          <div class="relative z-10 flex h-full flex-col">
            <div class="project-frame project-preview-grid">
              <div class="flex items-center justify-between text-[0.68rem] uppercase tracking-[0.3em] text-mist-200/55">
                <span class="inline-flex items-center gap-2">
                  <span class="project-meta-dot"></span>
                  ${project.category}
                </span>
                <span>${String(index + 1).padStart(2, '0')}</span>
              </div>

              <div class="mt-7 space-y-3">
                ${preview}
              </div>

              <div class="mt-7 flex flex-wrap gap-2">
                ${stack}
              </div>
            </div>

            <div class="mt-6 flex flex-1 flex-col">
              <h3 class="text-2xl font-semibold tracking-[-0.04em] text-mist-50">
                ${project.title}
              </h3>
              <p class="mt-4 flex-1 text-sm leading-7 text-mist-200/70">
                ${project.summary}
              </p>
              <div class="mt-6 flex items-center justify-between gap-4">
                <span class="eyebrow text-amethyst-200">Static-first delivery</span>
                <a
                  href="${project.href}"
                  class="social-link"
                  ${targetAttrs}
                >
                  View project
                  <i data-lucide="arrow-up-right"></i>
                </a>
              </div>
            </div>
          </div>
        </article>
      `
    })
    .join('')
}
