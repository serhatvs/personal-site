import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const VALID_ACCENTS = new Set(['amethyst', 'topaz', 'mist'])
const VALID_ICONS = new Set(['workflow', 'boxes', 'database', 'sparkles', 'waypoints', 'badge-check', 'cpu', 'cloud', 'mail'])

function normalizeBase(basePath = '/') {
  if (!basePath || basePath === '/') {
    return '/'
  }

  const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true })
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeAttribute(value) {
  return escapeHtml(value)
}

function toJavaScriptModule(name, value) {
  return `export const ${name} = ${JSON.stringify(value, null, 2)}\n`
}

function cleanGeneratedDirectories(rootDirectory) {
  if (!fs.existsSync(rootDirectory)) {
    return
  }

  fs.readdirSync(rootDirectory, { withFileTypes: true }).forEach((entry) => {
    if (entry.isDirectory()) {
      fs.rmSync(path.join(rootDirectory, entry.name), { recursive: true, force: true })
    }
  })
}

async function importRecords(filePath, exportName) {
  const moduleUrl = `${pathToFileURL(filePath).href}?t=${Date.now()}`
  const loadedModule = await import(moduleUrl)
  return loadedModule[exportName] || []
}

function sortRecords(records) {
  return [...records].sort((left, right) => Number(Boolean(right.featured)) - Number(Boolean(left.featured)) || left.order - right.order)
}

function validateSections(recordType, slug, sections) {
  assert(Array.isArray(sections) && sections.length >= 2, `${recordType} "${slug}" must include at least two sections.`)

  sections.forEach((section, index) => {
    assert(typeof section?.title === 'string' && section.title.trim(), `${recordType} "${slug}" has an invalid section title at index ${index}.`)
    assert(
      Array.isArray(section?.paragraphs) && section.paragraphs.length > 0,
      `${recordType} "${slug}" has an invalid section paragraph list at index ${index}.`,
    )
  })
}

function validateProjectRecord(record, seenSlugs) {
  assert(typeof record.slug === 'string' && record.slug.trim(), 'Project record is missing "slug".')
  assert(!seenSlugs.has(record.slug), `Duplicate project slug "${record.slug}".`)
  seenSlugs.add(record.slug)
  assert(typeof record.order === 'number', `Project "${record.slug}" is missing numeric "order".`)
  assert(typeof record.title === 'string' && record.title.trim(), `Project "${record.slug}" is missing "title".`)
  assert(typeof record.category === 'string' && record.category.trim(), `Project "${record.slug}" is missing "category".`)
  assert(typeof record.summary === 'string' && record.summary.trim(), `Project "${record.slug}" is missing "summary".`)
  assert(typeof record.excerpt === 'string' && record.excerpt.trim(), `Project "${record.slug}" is missing "excerpt".`)
  assert(typeof record.description === 'string' && record.description.trim(), `Project "${record.slug}" is missing "description".`)
  assert(VALID_ACCENTS.has(record.accent), `Project "${record.slug}" has invalid accent "${record.accent}".`)
  assert(Array.isArray(record.tags) && record.tags.length > 0, `Project "${record.slug}" is missing "tags".`)
  assert(Array.isArray(record.stack) && record.stack.length > 0, `Project "${record.slug}" is missing "stack".`)
  assert(typeof record.role === 'string' && record.role.trim(), `Project "${record.slug}" is missing "role".`)
  validateSections('Project', record.slug, record.sections)
}

function validateToolRecord(record, seenSlugs, validProjectSlugs) {
  assert(typeof record.slug === 'string' && record.slug.trim(), 'Tool record is missing "slug".')
  assert(!seenSlugs.has(record.slug), `Duplicate tool slug "${record.slug}".`)
  seenSlugs.add(record.slug)
  assert(typeof record.order === 'number', `Tool "${record.slug}" is missing numeric "order".`)
  assert(typeof record.name === 'string' && record.name.trim(), `Tool "${record.slug}" is missing "name".`)
  assert(typeof record.group === 'string' && record.group.trim(), `Tool "${record.slug}" is missing "group".`)
  assert(typeof record.icon === 'string' && record.icon.trim(), `Tool "${record.slug}" is missing "icon".`)
  assert(VALID_ICONS.has(record.icon), `Tool "${record.slug}" references unknown icon "${record.icon}".`)
  assert(typeof record.summary === 'string' && record.summary.trim(), `Tool "${record.slug}" is missing "summary".`)
  assert(typeof record.excerpt === 'string' && record.excerpt.trim(), `Tool "${record.slug}" is missing "excerpt".`)
  assert(typeof record.description === 'string' && record.description.trim(), `Tool "${record.slug}" is missing "description".`)
  assert(VALID_ACCENTS.has(record.accent), `Tool "${record.slug}" has invalid accent "${record.accent}".`)
  assert(Array.isArray(record.tags) && record.tags.length > 0, `Tool "${record.slug}" is missing "tags".`)
  validateSections('Tool', record.slug, record.sections)

  ;(record.relatedProjects || []).forEach((slug) => {
    assert(validProjectSlugs.has(slug), `Tool "${record.slug}" references unknown project slug "${slug}".`)
  })
}

function renderChips(items = []) {
  return items.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join('')
}

function renderHighlights(items = []) {
  if (!items.length) {
    return ''
  }

  return `
    <div class="detail-highlights">
      ${items
        .map(
          (item) => `
            <div class="detail-highlight">
              <span class="detail-highlight__label">${escapeHtml(item.label)}</span>
              <strong class="detail-highlight__value">${escapeHtml(item.value)}</strong>
            </div>
          `,
        )
        .join('')}
    </div>
  `
}

function renderList(items = []) {
  if (!items.length) {
    return ''
  }

  return `
    <ul class="detail-list">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
    </ul>
  `
}

function renderSections(sections) {
  return `
    <div class="detail-sections">
      ${sections
        .map(
          (section) => `
            <section class="detail-section">
              <h2 class="detail-section__title">${escapeHtml(section.title)}</h2>
              <div class="detail-section__copy">
                ${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
              </div>
            </section>
          `,
        )
        .join('')}
    </div>
  `
}

function renderDesktopNav(rootPrefix) {
  return `
    <div class="hidden items-center gap-7 md:flex">
      <a href="${rootPrefix}" data-page-link="home" class="nav-link inner-page-link">Home</a>
      <a href="${rootPrefix}projects/" data-page-link="projects" class="nav-link inner-page-link">Projects</a>
      <a href="${rootPrefix}tools/" data-page-link="tools" class="nav-link inner-page-link">Tools</a>
      <a href="${rootPrefix}blog/" data-page-link="journal" class="nav-link inner-page-link">Journal</a>
      <a href="${rootPrefix}#contact" data-page-link="contact" class="nav-link inner-page-link">Contact</a>
    </div>
  `
}

function renderMobileNav(rootPrefix) {
  return `
    <div class="flex flex-col gap-4">
      <a href="${rootPrefix}" data-menu-close data-page-link="home" class="mobile-nav-link">Home</a>
      <a href="${rootPrefix}projects/" data-menu-close data-page-link="projects" class="mobile-nav-link">Projects</a>
      <a href="${rootPrefix}tools/" data-menu-close data-page-link="tools" class="mobile-nav-link">Tools</a>
      <a href="${rootPrefix}blog/" data-menu-close data-page-link="journal" class="mobile-nav-link">Journal</a>
      <a href="${rootPrefix}#contact" data-menu-close data-page-link="contact" class="mobile-nav-link">Contact</a>
    </div>
  `
}

function renderHeader(rootPrefix, badge) {
  return `
    <header data-site-header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-all duration-300">
      <nav class="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-8 lg:px-10">
        <a href="${rootPrefix}" class="group inline-flex items-center gap-3">
          <span class="logo-wordmark text-2xl font-semibold tracking-tight text-mist-50 md:text-3xl">Lunerya</span>
          <span class="chip chip-ghost text-[0.65rem] tracking-[0.32em] text-amethyst-200">${badge}</span>
        </a>
        ${renderDesktopNav(rootPrefix)}
        <div class="flex items-center gap-3">
          <a href="${rootPrefix}#contact" class="void-button hidden md:inline-flex">
            Contact
            <i data-lucide="arrow-right"></i>
          </a>
          <button
            type="button"
            data-menu-toggle
            aria-expanded="false"
            aria-controls="mobile-menu"
            class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-mist-50 transition hover:border-amethyst-200/60 hover:bg-white/10 md:hidden"
          >
            <span class="sr-only">Open navigation</span>
            <i data-lucide="menu"></i>
          </button>
        </div>
      </nav>
    </header>
  `
}

function renderMobileMenu(rootPrefix) {
  return `
    <div id="mobile-menu" data-mobile-menu hidden class="fixed inset-0 z-[60] bg-void-950/95 px-6 py-6 backdrop-blur-xl">
      <div class="mx-auto flex h-full w-full max-w-lg flex-col rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-void-glow">
        <div class="flex items-center justify-between">
          <span class="logo-wordmark text-2xl font-semibold tracking-tight text-mist-50">Lunerya</span>
          <button
            type="button"
            data-menu-close
            class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-mist-50 transition hover:border-amethyst-200/60 hover:bg-white/10"
          >
            <span class="sr-only">Close navigation</span>
            <i data-lucide="x"></i>
          </button>
        </div>

        <div class="mt-12 flex flex-1 flex-col justify-between">
          ${renderMobileNav(rootPrefix)}

          <div class="glass-panel mt-12 rounded-[1.75rem] p-5">
            <div class="eyebrow text-amethyst-200">Contact</div>
            <a href="mailto:serhat.yavuz@agu.edu.tr" class="mt-4 inline-flex items-center gap-3 text-lg font-medium text-mist-50 transition hover:text-topaz-300">
              <i data-lucide="mail"></i>
              serhat.yavuz@agu.edu.tr
            </a>
            <p class="mt-4 text-sm text-mist-200/70">
              Available for product websites, frontend systems, and motion-led interface builds.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderFooter(rootPrefix, copy) {
  return `
    <footer class="relative z-10 border-t border-white/10 bg-black/20">
      <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 md:px-8 lg:px-10">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="logo-wordmark text-2xl font-semibold tracking-tight text-mist-50">Lunerya</div>
            <p class="mt-2 text-sm text-mist-200/60">${copy}</p>
          </div>
          <div data-socials-footer data-social-style="footer" class="flex flex-wrap gap-3"></div>
        </div>
        <div class="flex flex-col gap-5 border-t border-white/10 pt-6 text-sm text-mist-200/70 md:flex-row md:items-center md:justify-between">
          <p>&copy; <span data-current-year></span> Lunerya. Built with care for the web.</p>
          <a href="${rootPrefix}#contact" class="transition hover:text-topaz-300">serhat.yavuz@agu.edu.tr</a>
        </div>
      </div>
    </footer>
  `
}

function renderDocument({ title, description, href, imageHref, rootPrefix, scriptSrc, badge, bodyContent, footerCopy, pageKind }) {
  return `<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeAttribute(description)}" />
    <meta name="theme-color" content="#0f0518" />
    <meta property="og:title" content="${escapeAttribute(title)} | Lunerya" />
    <meta property="og:description" content="${escapeAttribute(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeAttribute(href)}" />
    <meta property="og:image" content="${escapeAttribute(imageHref)}" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${escapeAttribute(title)} | Lunerya" />
    <meta property="twitter:description" content="${escapeAttribute(description)}" />
    <meta property="twitter:image" content="${escapeAttribute(imageHref)}" />
    <link rel="icon" type="image/svg+xml" href="${rootPrefix}favicon.svg" />
    <link rel="manifest" href="${rootPrefix}site.webmanifest" />
    <title>${escapeHtml(title)} | Lunerya</title>
    <script type="module" src="${scriptSrc}"></script>
  </head>
  <body data-page-kind="${pageKind}" class="min-w-[320px] bg-void-950 text-mist-50 antialiased">
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-30 bg-void-gradient opacity-90"></div>
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-20 cosmic-grid opacity-60"></div>
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 scanline opacity-40"></div>
    ${renderHeader(rootPrefix, badge)}
    ${renderMobileMenu(rootPrefix)}
    <main class="relative z-10 pb-24 pt-28">${bodyContent}</main>
    ${renderFooter(rootPrefix, footerCopy)}
  </body>
</html>
`
}

function renderProjectDetailPage(project, href, imageHref) {
  const rootPrefix = '../../'
  const linkButtons = [
    project.links?.live
      ? `<a href="${project.links.live}" class="void-button" target="_blank" rel="noreferrer">Live site <i data-lucide="arrow-up-right"></i></a>`
      : '',
    project.links?.repo
      ? `<a href="${project.links.repo}" class="void-button void-button-ghost" target="_blank" rel="noreferrer">Repository <i data-lucide="arrow-up-right"></i></a>`
      : '',
  ].join('')

  const bodyContent = `
    <section class="section-shell !pb-16 !pt-10">
      <div class="section-inner">
        <a href="../" class="detail-back-link"><i data-lucide="arrow-left"></i>Back to Projects</a>

        <article data-project-detail data-project-slug="${escapeAttribute(project.slug)}" class="detail-shell mt-8">
          <div class="detail-kicker">
            <span class="section-kicker text-topaz-300">Project Detail</span>
            <span class="chip chip-ghost">${escapeHtml(project.category)}</span>
          </div>
          <h1 class="detail-title">${escapeHtml(project.title)}</h1>
          <p class="detail-excerpt">${escapeHtml(project.excerpt)}</p>
          <div class="detail-meta">
            <span>${escapeHtml(project.category)}</span>
            ${project.year ? `<span>${escapeHtml(project.year)}</span>` : ''}
            ${project.status ? `<span>${escapeHtml(project.status)}</span>` : ''}
          </div>
          <div class="detail-chip-row">${renderChips(project.stack)}${renderChips(project.tags)}</div>

          <div class="detail-grid">
            <section class="detail-panel">
              <p class="detail-panel__label">Role</p>
              <div class="detail-panel__value">${escapeHtml(project.role)}</div>
              ${renderList(project.scope)}
            </section>
            <section class="detail-panel">
              <p class="detail-panel__label">Highlights</p>
              ${renderHighlights(project.highlights)}
            </section>
          </div>

          ${renderSections(project.sections)}

          ${linkButtons ? `<div class="mt-10 flex flex-wrap gap-4">${linkButtons}</div>` : ''}
        </article>

        <section class="mt-16">
          <div class="section-heading">
            <div>
              <p class="section-kicker">Related Cases</p>
              <h2 class="text-3xl font-display font-semibold tracking-[-0.05em] text-mist-50 md:text-4xl">Continue Through The Work</h2>
            </div>
            <p class="max-w-xl text-sm leading-7 text-mist-200/65 md:text-base">
              Adjacent projects with overlapping constraints, similar architecture decisions, or related delivery patterns.
            </p>
          </div>
          <div data-related-projects class="detail-related-grid mt-10"></div>
        </section>

        <article class="editorial-cta-panel">
          <p class="eyebrow text-topaz-300">Build with Intent</p>
          <h2 class="mt-4 max-w-2xl text-3xl font-display font-semibold tracking-[-0.05em] text-mist-50 md:text-4xl">
            Need this level of frontend thinking in a real product or launch surface?
          </h2>
          <p class="mt-6 max-w-2xl text-sm leading-7 text-mist-200/70 md:text-base">
            The same architecture discipline behind these cases can shape premium product pages, systems work, and motion-heavy frontend delivery.
          </p>
          <div class="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href="${rootPrefix}#contact" class="void-button">Start a conversation<i data-lucide="send"></i></a>
            <a href="${rootPrefix}tools/" class="void-button void-button-ghost">Explore tools<i data-lucide="arrow-right"></i></a>
          </div>
        </article>
      </div>
    </section>
  `

  return renderDocument({
    title: project.title,
    description: project.description,
    href,
    imageHref,
    rootPrefix,
    scriptSrc: '../../src/project-detail.js',
    badge: 'PROJECTS',
    bodyContent,
    footerCopy: 'Project cases on systems, interaction design, and production frontend execution.',
    pageKind: 'projects',
  })
}

function renderToolDetailPage(tool, href, imageHref) {
  const rootPrefix = '../../'
  const bodyContent = `
    <section class="section-shell !pb-16 !pt-10">
      <div class="section-inner">
        <a href="../" class="detail-back-link"><i data-lucide="arrow-left"></i>Back to Tools</a>

        <article data-tool-detail data-tool-slug="${escapeAttribute(tool.slug)}" class="detail-shell mt-8">
          <div class="detail-kicker">
            <span class="section-kicker text-amethyst-200">Tool Profile</span>
            <span class="chip chip-ghost">${escapeHtml(tool.group)}</span>
          </div>
          <h1 class="detail-title">${escapeHtml(tool.name)}</h1>
          <p class="detail-excerpt">${escapeHtml(tool.excerpt)}</p>
          <div class="detail-meta">
            <span>${escapeHtml(tool.group)}</span>
            <span>${escapeHtml(tool.accent)}</span>
          </div>
          <div class="detail-chip-row">
            <span class="icon-frame text-mist-50"><i data-lucide="${tool.icon}"></i></span>
            ${renderChips(tool.tags)}
          </div>

          <div class="detail-grid">
            <section class="detail-panel">
              <p class="detail-panel__label">Responsibilities</p>
              ${renderList(tool.responsibilities)}
              ${renderHighlights(tool.highlights)}
            </section>
            <section class="detail-panel">
              <p class="detail-panel__label">Constraints</p>
              ${renderList(tool.constraints)}
            </section>
          </div>

          ${renderSections(tool.sections)}

          ${
            tool.officialHref
              ? `<div class="mt-10 flex flex-wrap gap-4"><a href="${tool.officialHref}" class="void-button" target="_blank" rel="noreferrer">Official docs<i data-lucide="arrow-up-right"></i></a></div>`
              : ''
          }
        </article>

        <section class="mt-16">
          <div class="section-heading">
            <div>
              <p class="section-kicker">Related Tools</p>
              <h2 class="text-3xl font-display font-semibold tracking-[-0.05em] text-mist-50 md:text-4xl">Stack Adjacencies</h2>
            </div>
            <p class="max-w-xl text-sm leading-7 text-mist-200/65 md:text-base">
              Nearby tools with similar responsibilities, overlapping tags, or shared constraints inside the Lunerya stack.
            </p>
          </div>
          <div data-related-tools class="detail-related-grid mt-10"></div>
        </section>

        ${
          (tool.relatedProjects || []).length
            ? `
              <section class="mt-16">
                <div class="section-heading">
                  <div>
                    <p class="section-kicker">Used In Projects</p>
                    <h2 class="text-3xl font-display font-semibold tracking-[-0.05em] text-mist-50 md:text-4xl">Where It Shows Up</h2>
                  </div>
                  <p class="max-w-xl text-sm leading-7 text-mist-200/65 md:text-base">
                    Projects where this tool takes a visible role in delivery, interface behavior, or operational structure.
                  </p>
                </div>
                <div data-tool-projects class="detail-related-grid mt-10"></div>
              </section>
            `
            : ''
        }

        <article class="editorial-cta-panel">
          <p class="eyebrow text-topaz-300">Operational Stack</p>
          <h2 class="mt-4 max-w-2xl text-3xl font-display font-semibold tracking-[-0.05em] text-mist-50 md:text-4xl">
            Want this stack thinking applied to a real product or portfolio system?
          </h2>
          <p class="mt-6 max-w-2xl text-sm leading-7 text-mist-200/70 md:text-base">
            Tools are only valuable when their ownership is explicit. The same discipline can shape premium launch pages, frontend systems, and resilient static products.
          </p>
          <div class="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href="${rootPrefix}projects/" class="void-button">See projects<i data-lucide="arrow-right"></i></a>
            <a href="${rootPrefix}#contact" class="void-button void-button-ghost">Start a conversation<i data-lucide="send"></i></a>
          </div>
        </article>
      </div>
    </section>
  `

  return renderDocument({
    title: tool.name,
    description: tool.description,
    href,
    imageHref,
    rootPrefix,
    scriptSrc: '../../src/tool-detail.js',
    badge: 'TOOLS',
    bodyContent,
    footerCopy: 'Tool profiles for the runtimes, motion systems, and delivery layers behind Lunerya.',
    pageKind: 'tools',
  })
}

export async function generatePortfolioContent({ rootDir = process.cwd(), basePath = '/' } = {}) {
  const normalizedBase = normalizeBase(basePath)
  const projectRecordsPath = path.resolve(rootDir, 'src/data/projects.js')
  const toolRecordsPath = path.resolve(rootDir, 'src/data/tools.js')
  const projectsRoot = path.resolve(rootDir, 'projects')
  const toolsRoot = path.resolve(rootDir, 'tools')
  const projectManifestPath = path.resolve(rootDir, 'src/generated/projects-manifest.js')
  const toolManifestPath = path.resolve(rootDir, 'src/generated/tools-manifest.js')

  ensureDirectory(projectsRoot)
  ensureDirectory(toolsRoot)
  ensureDirectory(path.dirname(projectManifestPath))
  ensureDirectory(path.dirname(toolManifestPath))

  const projectSource = await importRecords(projectRecordsPath, 'projectRecords')
  const projectSlugs = new Set()
  projectSource.forEach((record) => validateProjectRecord(record, projectSlugs))

  const toolSource = await importRecords(toolRecordsPath, 'toolRecords')
  const toolSlugs = new Set()
  toolSource.forEach((record) => validateToolRecord(record, toolSlugs, projectSlugs))

  const projectsManifest = sortRecords(projectSource).map((record) => ({
    slug: record.slug,
    order: record.order,
    featured: Boolean(record.featured),
    title: record.title,
    category: record.category,
    summary: record.summary,
    excerpt: record.excerpt,
    description: record.description,
    year: record.year || null,
    status: record.status || null,
    accent: record.accent,
    tags: record.tags,
    stack: record.stack,
    role: record.role,
    links: record.links || {},
    href: `${normalizedBase}projects/${record.slug}/`,
  }))

  const toolsManifest = sortRecords(toolSource).map((record) => ({
    slug: record.slug,
    order: record.order,
    featured: Boolean(record.featured),
    name: record.name,
    group: record.group,
    icon: record.icon,
    summary: record.summary,
    excerpt: record.excerpt,
    description: record.description,
    accent: record.accent,
    tags: record.tags,
    relatedProjects: record.relatedProjects || [],
    officialHref: record.officialHref || null,
    href: `${normalizedBase}tools/${record.slug}/`,
  }))

  fs.writeFileSync(projectManifestPath, toJavaScriptModule('projectsManifest', projectsManifest), 'utf8')
  fs.writeFileSync(toolManifestPath, toJavaScriptModule('toolsManifest', toolsManifest), 'utf8')

  cleanGeneratedDirectories(projectsRoot)
  cleanGeneratedDirectories(toolsRoot)

  const projectEntries = []
  const toolEntries = []

  sortRecords(projectSource).forEach((project) => {
    const href = `${normalizedBase}projects/${project.slug}/`
    const imageHref = `${normalizedBase}og-cover.svg`
    const projectDirectory = path.join(projectsRoot, project.slug)
    const projectEntry = path.join(projectDirectory, 'index.html')
    ensureDirectory(projectDirectory)
    fs.writeFileSync(projectEntry, renderProjectDetailPage(project, href, imageHref), 'utf8')
    projectEntries.push(projectEntry)
  })

  sortRecords(toolSource).forEach((tool) => {
    const href = `${normalizedBase}tools/${tool.slug}/`
    const imageHref = `${normalizedBase}og-cover.svg`
    const toolDirectory = path.join(toolsRoot, tool.slug)
    const toolEntry = path.join(toolDirectory, 'index.html')
    ensureDirectory(toolDirectory)
    fs.writeFileSync(toolEntry, renderToolDetailPage(tool, href, imageHref), 'utf8')
    toolEntries.push(toolEntry)
  })

  return {
    projectsManifest,
    toolsManifest,
    projectEntries,
    toolEntries,
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  await generatePortfolioContent({
    rootDir: process.cwd(),
    basePath: process.env.VITE_BASE_PATH || '/',
  })
}
