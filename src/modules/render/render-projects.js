import { getProjectsHref, isExternalHref } from './content-utils.js'

const terminalBars = [0.86, 0.62, 0.74, 0.48]

const accentPairs = {
  amethyst: {
    from: '#7A3F91',
    to: '#C59DD9',
  },
  topaz: {
    from: '#E6A520',
    to: '#FFD77A',
  },
  mist: {
    from: '#C1C4C8',
    to: '#F5F6F7',
  },
}

function renderStack(stack) {
  return stack
    .slice(0, 3)
    .map(
      (item) =>
        `<span class="chip !bg-white/5 !px-3 !py-1.5 !text-[0.65rem] !tracking-[0.2em]">${item}</span>`,
    )
    .join('')
}

export function renderProjects(container, projects, options = {}) {
  if (!container) {
    return
  }

  const previewProjects = projects.slice(0, options.previewCount ?? 3)
  const archiveHref = getProjectsHref()

  if (!previewProjects.length) {
    container.innerHTML = `
      <article class="glass-panel rounded-[2rem] p-8 text-sm text-mist-200/70">
        Project archive is being assembled.
      </article>
    `
    return
  }

  container.innerHTML = `
    <div class="grid gap-6 lg:grid-cols-3">
      ${previewProjects
        .map((project, index) => {
          const stack = renderStack(project.stack)
          const preview = terminalBars
            .map(
              (width) =>
                `<span class="project-terminal-line block h-2" style="width:${width * 100}%"></span>`,
            )
            .join('')
          const accent = accentPairs[project.accent] || accentPairs.amethyst
          const liveLink = project.links?.live
            ? `
                <a
                  href="${project.links.live}"
                  class="text-xs uppercase tracking-[0.22em] text-mist-200/55 transition hover:text-topaz-300"
                  ${isExternalHref(project.links.live) ? 'target="_blank" rel="noreferrer"' : ''}
                >
                  Live site
                </a>
              `
            : ''

          return `
            <article
              data-reveal-item
              class="project-card void-card js-project-card"
              style="--project-accent-start:${accent.from};--project-accent-end:${accent.to};"
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
                  <div class="flex items-center justify-between gap-4 text-[0.68rem] uppercase tracking-[0.26em] text-mist-200/50">
                    <span>${project.year || 'Current'}</span>
                    <span>${project.status || 'In progress'}</span>
                  </div>

                  <h3 class="text-2xl font-semibold tracking-[-0.04em] text-mist-50">
                    ${project.title}
                  </h3>
                  <p class="mt-4 flex-1 text-sm leading-7 text-mist-200/70">
                    ${project.summary}
                  </p>
                  <div class="mt-6 flex items-center justify-between gap-4">
                    <span class="eyebrow text-amethyst-200">${project.role}</span>
                    <div class="flex items-center gap-4">
                      ${liveLink}
                      <a href="${project.href}" class="social-link">
                        Open case
                        <i data-lucide="arrow-up-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          `
        })
        .join('')}
    </div>

    <div data-reveal-item class="mt-8 flex justify-end">
      <a href="${archiveHref}" data-projects-cta class="void-button">
        ${options.archiveCtaLabel || 'View all projects'}
        <i data-lucide="arrow-right"></i>
      </a>
    </div>
  `
}
