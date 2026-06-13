import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const VALID_ACCENTS = new Set(['amethyst', 'topaz', 'mist'])
const WORDS_PER_MINUTE = 220

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

function readMarkdownFiles(contentDirectory) {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  return fs
    .readdirSync(contentDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(contentDirectory, entry.name))
}

function slugFromFilename(filePath) {
  return path.basename(filePath, '.md')
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime())
}

function countWords(value) {
  return String(value)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

function getReadingTime(content) {
  return Math.max(1, Math.ceil(countWords(content) / WORDS_PER_MINUTE))
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

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dateString}T00:00:00Z`))
}

function toJavaScriptModule(posts) {
  return `export const blogManifest = ${JSON.stringify(posts, null, 2)}\n`
}

function createMarkdownRenderer() {
  const markdown = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: false,
  })

  const defaultLinkOpen =
    markdown.renderer.rules.link_open ??
    ((tokens, index, options, env, self) => self.renderToken(tokens, index, options))

  markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const href = tokens[index].attrGet('href') || ''

    if (/^https?:\/\//.test(href)) {
      tokens[index].attrSet('target', '_blank')
      tokens[index].attrSet('rel', 'noreferrer')
    }

    return defaultLinkOpen(tokens, index, options, env, self)
  }

  return markdown
}

function resolveCover(cover, basePath) {
  if (!cover) {
    return `${basePath}og-cover.svg`
  }

  if (/^https?:\/\//.test(cover)) {
    return cover
  }

  if (cover.startsWith('/')) {
    return `${basePath}${cover.replace(/^\/+/, '')}`
  }

  return cover
}

function cleanGeneratedPostDirectories(blogRoot) {
  if (!fs.existsSync(blogRoot)) {
    return
  }

  const entries = fs.readdirSync(blogRoot, { withFileTypes: true })

  entries.forEach((entry) => {
    if (entry.isDirectory()) {
      fs.rmSync(path.join(blogRoot, entry.name), { recursive: true, force: true })
    }
  })
}

function validateFrontmatter(slug, data) {
  assert(typeof data.title === 'string' && data.title.trim(), `Missing "title" in blog post "${slug}".`)
  assert(typeof data.excerpt === 'string' && data.excerpt.trim(), `Missing "excerpt" in blog post "${slug}".`)
  assert(typeof data.description === 'string' && data.description.trim(), `Missing "description" in blog post "${slug}".`)
  assert(typeof data.publishedAt === 'string' && isIsoDate(data.publishedAt), `Invalid "publishedAt" in blog post "${slug}".`)
  assert(Array.isArray(data.tags) && data.tags.length > 0, `Missing "tags" in blog post "${slug}".`)
  assert(
    !data.updatedAt || (typeof data.updatedAt === 'string' && isIsoDate(data.updatedAt)),
    `Invalid "updatedAt" in blog post "${slug}".`,
  )
  assert(
    !data.accent || VALID_ACCENTS.has(data.accent),
    `Invalid "accent" in blog post "${slug}". Use one of: amethyst, topaz, mist.`,
  )
}

function renderTagChips(tags) {
  return tags
    .map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`)
    .join('')
}

function renderPostNavigation(previousPost, nextPost) {
  const previousCard = previousPost
    ? `
      <a href="../${previousPost.slug}/" class="journal-nav-card journal-nav-card--prev">
        <span class="eyebrow text-amethyst-200">Previous Entry</span>
        <strong class="mt-4 block text-xl font-semibold tracking-[-0.04em] text-mist-50">${escapeHtml(previousPost.title)}</strong>
        <span class="mt-6 inline-flex items-center gap-3 text-sm text-mist-200/70">
          <i data-lucide="arrow-left"></i>
          ${escapeHtml(formatDate(previousPost.publishedAt))}
        </span>
      </a>
    `
    : `
      <div class="journal-nav-card journal-nav-card--empty">
        <span class="eyebrow text-mist-200/50">Archive Start</span>
        <strong class="mt-4 block text-xl font-semibold tracking-[-0.04em] text-mist-50">This entry opens the current sequence.</strong>
      </div>
    `

  const nextCard = nextPost
    ? `
      <a href="../${nextPost.slug}/" class="journal-nav-card journal-nav-card--next">
        <span class="eyebrow text-topaz-300">Next Entry</span>
        <strong class="mt-4 block text-xl font-semibold tracking-[-0.04em] text-mist-50">${escapeHtml(nextPost.title)}</strong>
        <span class="mt-6 inline-flex items-center gap-3 text-sm text-mist-200/70">
          ${escapeHtml(formatDate(nextPost.publishedAt))}
          <i data-lucide="arrow-right"></i>
        </span>
      </a>
    `
    : `
      <div class="journal-nav-card journal-nav-card--empty">
        <span class="eyebrow text-mist-200/50">Latest Entry</span>
        <strong class="mt-4 block text-xl font-semibold tracking-[-0.04em] text-mist-50">You are reading the most recent journal note.</strong>
      </div>
    `

  return `
    <div class="journal-nav-grid">
      ${previousCard}
      ${nextCard}
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

function renderPostPage(post, previousPost, nextPost, basePath) {
  const tagChips = renderTagChips(post.tags)
  const cover = resolveCover(post.cover, basePath)
  const updatedMeta = post.updatedAt
    ? `<span>Updated ${escapeHtml(formatDate(post.updatedAt))}</span>`
    : ''
  const rootPrefix = '../../'

  return `<!doctype html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeAttribute(post.description)}" />
    <meta name="theme-color" content="#0f0518" />
    <meta property="og:title" content="${escapeAttribute(post.title)} | Lunerya Journal" />
    <meta property="og:description" content="${escapeAttribute(post.description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${escapeAttribute(post.href)}" />
    <meta property="og:image" content="${escapeAttribute(cover)}" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${escapeAttribute(post.title)} | Lunerya Journal" />
    <meta property="twitter:description" content="${escapeAttribute(post.description)}" />
    <meta property="twitter:image" content="${escapeAttribute(cover)}" />
    <link rel="icon" type="image/svg+xml" href="../../favicon.svg" />
    <link rel="manifest" href="../../site.webmanifest" />
    <title>${escapeHtml(post.title)} | Lunerya Journal</title>
    <script type="module" src="../../src/blog-post.js"></script>
  </head>
  <body data-page-kind="journal" class="min-w-[320px] bg-void-950 text-mist-50 antialiased">
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-30 bg-void-gradient opacity-90"></div>
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-20 cosmic-grid opacity-60"></div>
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 scanline opacity-40"></div>

    <header data-site-header class="fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-all duration-300">
      <nav class="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-8 lg:px-10">
        <a href="${rootPrefix}" class="group inline-flex items-center gap-3">
          <span class="logo-wordmark text-2xl font-semibold tracking-tight text-mist-50 md:text-3xl">Lunerya</span>
          <span class="chip chip-ghost text-[0.65rem] tracking-[0.32em] text-amethyst-200">JOURNAL</span>
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

    <main class="relative z-10 pb-24 pt-28">
      <section class="section-shell !pb-16 !pt-10">
        <div class="section-inner">
          <a href="../" class="journal-back-link">
            <i data-lucide="arrow-left"></i>
            Back to Journal
          </a>

          <article data-blog-post data-blog-slug="${escapeAttribute(post.slug)}" class="blog-post-shell mt-8">
            <div class="blog-post-kicker">
              <span class="section-kicker text-topaz-300">Journal Entry</span>
              <span class="chip chip-ghost">${escapeHtml(formatDate(post.publishedAt))}</span>
            </div>

            <h1 class="blog-post-title">${escapeHtml(post.title)}</h1>
            <p class="blog-post-excerpt">${escapeHtml(post.excerpt)}</p>

            <div class="blog-post-meta">
              <span>${escapeHtml(formatDate(post.publishedAt))}</span>
              <span>${post.readingTime} min read</span>
              ${updatedMeta}
            </div>

            <div class="blog-tag-row">
              ${tagChips}
            </div>

            <div class="blog-prose">
              ${post.html}
            </div>
          </article>

          <div class="mt-14">
            ${renderPostNavigation(previousPost, nextPost)}
          </div>

          <section class="mt-16">
            <div class="section-heading">
              <div>
                <p class="section-kicker">Related Entries</p>
                <h2 class="text-3xl font-display font-semibold tracking-[-0.05em] text-mist-50 md:text-4xl">Continue Reading</h2>
              </div>
              <p class="max-w-xl text-sm leading-7 text-mist-200/65 md:text-base">
                Further notes on systems, motion control, performance boundaries, and shipping polished static experiences.
              </p>
            </div>

            <div data-related-posts class="mt-10 grid gap-6 lg:grid-cols-3"></div>
          </section>

          <article class="glass-panel mt-16 rounded-[2rem] p-8 md:p-10">
            <p class="eyebrow text-topaz-300">Build with Intent</p>
            <h2 class="mt-4 max-w-2xl text-3xl font-display font-semibold tracking-[-0.05em] text-mist-50 md:text-4xl">
              Need this level of frontend thinking in a real product or launch site?
            </h2>
            <p class="mt-6 max-w-2xl text-sm leading-7 text-mist-200/70 md:text-base">
              The same discipline used in these entries is available for product pages, portfolio systems, and motion-heavy frontend architecture.
            </p>
            <div class="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="${rootPrefix}#contact" class="void-button">
                Start a conversation
                <i data-lucide="send"></i>
              </a>
              <a href="${rootPrefix}projects/" class="void-button void-button-ghost">
                View projects
                <i data-lucide="arrow-right"></i>
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>

    <footer class="relative z-10 border-t border-white/10 bg-black/20">
      <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 md:px-8 lg:px-10">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="logo-wordmark text-2xl font-semibold tracking-tight text-mist-50">Lunerya</div>
            <p class="mt-2 text-sm text-mist-200/60">Journal notes on systems, motion, and premium frontend delivery.</p>
          </div>

          <div data-socials-footer data-social-style="footer" class="flex flex-wrap gap-3"></div>
        </div>

        <div class="flex flex-col gap-5 border-t border-white/10 pt-6 text-sm text-mist-200/70 md:flex-row md:items-center md:justify-between">
          <p>&copy; <span data-current-year></span> Lunerya. Journal edition.</p>
          <a href="${rootPrefix}#contact" class="transition hover:text-topaz-300">serhat.yavuz@agu.edu.tr</a>
        </div>
      </div>
    </footer>
  </body>
</html>
`
}

export function generateBlog({ rootDir = process.cwd(), basePath = '/' } = {}) {
  const contentDirectory = path.resolve(rootDir, 'src/content/blog')
  const blogRoot = path.resolve(rootDir, 'blog')
  const manifestPath = path.resolve(rootDir, 'src/generated/blog-manifest.js')
  const markdown = createMarkdownRenderer()
  const normalizedBase = normalizeBase(basePath)

  ensureDirectory(contentDirectory)
  ensureDirectory(blogRoot)
  ensureDirectory(path.dirname(manifestPath))

  const seenSlugs = new Set()
  const sourceFiles = readMarkdownFiles(contentDirectory)

  const posts = sourceFiles
    .map((filePath) => {
      const slug = slugFromFilename(filePath)
      const source = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(source)

      validateFrontmatter(slug, data)
      assert(!seenSlugs.has(slug), `Duplicate blog slug "${slug}".`)
      seenSlugs.add(slug)

      return {
        slug,
        title: data.title.trim(),
        excerpt: data.excerpt.trim(),
        description: data.description.trim(),
        publishedAt: data.publishedAt,
        updatedAt: data.updatedAt ?? null,
        tags: data.tags.map((tag) => String(tag).trim()).filter(Boolean),
        featured: Boolean(data.featured),
        accent: data.accent ?? 'amethyst',
        draft: Boolean(data.draft),
        cover: data.cover ?? null,
        readingTime: getReadingTime(content),
        html: markdown.render(content),
      }
    })
    .filter((post) => !post.draft)
    .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime())
    .map((post) => ({
      ...post,
      href: `${normalizedBase}blog/${post.slug}/`,
    }))

  fs.writeFileSync(manifestPath, toJavaScriptModule(posts), 'utf8')

  cleanGeneratedPostDirectories(blogRoot)

  const generatedEntries = []

  posts.forEach((post, index) => {
    const previousPost = posts[index + 1] ?? null
    const nextPost = posts[index - 1] ?? null
    const postDirectory = path.join(blogRoot, post.slug)
    const postEntry = path.join(postDirectory, 'index.html')

    ensureDirectory(postDirectory)
    fs.writeFileSync(postEntry, renderPostPage(post, previousPost, nextPost, normalizedBase), 'utf8')
    generatedEntries.push(postEntry)
  })

  return {
    posts,
    generatedEntries,
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  generateBlog({
    rootDir: process.cwd(),
    basePath: process.env.VITE_BASE_PATH || '/',
  })
}
