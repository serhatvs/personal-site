const summaryConfig = {
  blog: {
    title: 'Existing Journal Entries',
    copy: 'Markdown-backed journal entries already present in the content source.',
    empty: 'No journal entries published yet.',
  },
  project: {
    title: 'Existing Projects',
    copy: 'Current project records available for the homepage preview and the projects archive.',
    empty: 'Project archive is empty.',
  },
  tool: {
    title: 'Existing Tech Stack Items',
    copy: 'Tool records powering the homepage slider and the tools archive.',
    empty: 'Tool archive is empty.',
  },
}

export function renderAdminSummary(tab, summary) {
  const items = tab === 'blog' ? summary.blog : tab === 'project' ? summary.projects : summary.tools
  const config = summaryConfig[tab]

  return `
    <div class="admin-sidebar">
      <div class="admin-sidebar__header">
        <p class="section-kicker text-amethyst-200">${config.title}</p>
        <p class="admin-helper">${config.copy}</p>
      </div>

      ${
        items.length
          ? `
            <ul class="admin-summary-list">
              ${items
                .map((item) => {
                  const title = item.title || item.name || item.slug

                  return `
                    <li class="admin-summary-item">
                      <div>
                        <strong>${title}</strong>
                        <span>${item.slug}</span>
                      </div>
                      <div class="admin-summary-item__meta">
                        ${item.draft ? '<span class="chip">Draft</span>' : ''}
                        ${item.href ? `<a href="${item.href}" class="admin-summary-link">Open</a>` : ''}
                      </div>
                    </li>
                  `
                })
                .join('')}
            </ul>
          `
          : `<div class="admin-empty">${config.empty}</div>`
      }
    </div>
  `
}
