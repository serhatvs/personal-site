import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import matter from 'gray-matter'
import { generateBlog } from './blog-generator.mjs'
import { generatePortfolioContent } from './portfolio-generator.mjs'

const VALID_ACCENTS = new Set(['amethyst', 'topaz', 'mist'])
const VALID_TOOL_ICONS = new Set([
  'workflow',
  'boxes',
  'database',
  'sparkles',
  'waypoints',
  'badge-check',
  'cpu',
  'cloud',
  'mail',
])

function normalizeBase(basePath = '/') {
  if (!basePath || basePath === '/') {
    return '/'
  }

  const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true })
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime())
}

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

function normalizeString(value) {
  return String(value ?? '').trim()
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => normalizeString(item)).filter(Boolean)
}

function normalizeParagraphs(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => normalizeString(item)).filter(Boolean)
}

function normalizeHighlights(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => ({
      label: normalizeString(item?.label),
      value: normalizeString(item?.value),
    }))
    .filter((item) => item.label && item.value)
}

function normalizeSections(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((section) => ({
      title: normalizeString(section?.title),
      paragraphs: normalizeParagraphs(section?.paragraphs),
    }))
    .filter((section) => section.title || section.paragraphs.length)
}

function ensureKebabCase(value, label) {
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), `${label} must be lowercase kebab-case.`)
}

function toJavaScriptModule(name, value) {
  return `export const ${name} = ${JSON.stringify(value, null, 2)}\n`
}

async function importRecords(filePath, exportName) {
  const moduleUrl = `${pathToFileURL(filePath).href}?t=${Date.now()}`
  const loadedModule = await import(moduleUrl)
  return loadedModule[exportName] || []
}

function readBlogEntries(contentDirectory, basePath) {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  return fs
    .readdirSync(contentDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => {
      const slug = path.basename(entry.name, '.md')
      const source = fs.readFileSync(path.join(contentDirectory, entry.name), 'utf8')
      const { data } = matter(source)

      return {
        slug,
        title: normalizeString(data.title) || slug,
        draft: Boolean(data.draft),
        href: Boolean(data.draft) ? null : `${basePath}blog/${slug}/`,
      }
    })
    .sort((left, right) => left.slug.localeCompare(right.slug))
}

function validateBlogPayload(payload, existingSlugs) {
  const title = normalizeString(payload.title)
  const slug = slugify(payload.slug || title)
  const excerpt = normalizeString(payload.excerpt)
  const description = normalizeString(payload.description)
  const publishedAt = normalizeString(payload.publishedAt)
  const accent = normalizeString(payload.accent) || 'amethyst'
  const cover = normalizeString(payload.cover) || null
  const body = String(payload.body ?? '').trim()
  const tags = normalizeStringArray(payload.tags)

  assert(title, 'Blog entry requires "title".')
  assert(slug, 'Blog entry requires "slug".')
  ensureKebabCase(slug, 'Blog slug')
  assert(!existingSlugs.has(slug), `Duplicate blog slug "${slug}".`)
  assert(excerpt, 'Blog entry requires "excerpt".')
  assert(description, 'Blog entry requires "description".')
  assert(isIsoDate(publishedAt), 'Blog "publishedAt" must use YYYY-MM-DD format.')
  assert(tags.length > 0, 'Blog entry requires at least one tag.')
  assert(VALID_ACCENTS.has(accent), 'Blog accent must be one of: amethyst, topaz, mist.')
  assert(body, 'Blog entry requires body content.')

  return {
    title,
    slug,
    excerpt,
    description,
    publishedAt,
    accent,
    cover,
    body,
    tags,
    featured: Boolean(payload.featured),
    draft: Boolean(payload.draft),
  }
}

function validateSections(recordType, slug, sections) {
  assert(sections.length >= 2, `${recordType} "${slug}" must include at least two sections.`)

  sections.forEach((section, index) => {
    assert(section.title, `${recordType} "${slug}" section ${index + 1} is missing a title.`)
    assert(
      Array.isArray(section.paragraphs) && section.paragraphs.length > 0,
      `${recordType} "${slug}" section ${index + 1} must include at least one paragraph.`,
    )
  })
}

function validateProjectPayload(payload, existingSlugs) {
  const title = normalizeString(payload.title)
  const slug = slugify(payload.slug || title)
  const order = Number(payload.order)
  const category = normalizeString(payload.category)
  const summary = normalizeString(payload.summary)
  const excerpt = normalizeString(payload.excerpt)
  const description = normalizeString(payload.description)
  const year = normalizeString(payload.year) || null
  const status = normalizeString(payload.status) || null
  const accent = normalizeString(payload.accent) || 'amethyst'
  const tags = normalizeStringArray(payload.tags)
  const stack = normalizeStringArray(payload.stack)
  const role = normalizeString(payload.role)
  const scope = normalizeStringArray(payload.scope)
  const highlights = normalizeHighlights(payload.highlights)
  const sections = normalizeSections(payload.sections)
  const links = {
    live: normalizeString(payload.links?.live) || undefined,
    repo: normalizeString(payload.links?.repo) || undefined,
  }

  assert(title, 'Project entry requires "title".')
  assert(slug, 'Project entry requires "slug".')
  ensureKebabCase(slug, 'Project slug')
  assert(!existingSlugs.has(slug), `Duplicate project slug "${slug}".`)
  assert(Number.isFinite(order), 'Project "order" must be numeric.')
  assert(category, 'Project entry requires "category".')
  assert(summary, 'Project entry requires "summary".')
  assert(excerpt, 'Project entry requires "excerpt".')
  assert(description, 'Project entry requires "description".')
  assert(VALID_ACCENTS.has(accent), 'Project accent must be one of: amethyst, topaz, mist.')
  assert(tags.length > 0, 'Project entry requires at least one tag.')
  assert(stack.length > 0, 'Project entry requires at least one stack item.')
  assert(role, 'Project entry requires "role".')
  validateSections('Project', slug, sections)

  return {
    slug,
    order,
    featured: Boolean(payload.featured),
    title,
    category,
    summary,
    excerpt,
    description,
    year,
    status,
    accent,
    tags,
    stack,
    links,
    role,
    scope,
    highlights,
    sections,
  }
}

function validateToolPayload(payload, existingSlugs, validProjectSlugs) {
  const name = normalizeString(payload.name)
  const slug = slugify(payload.slug || name)
  const order = Number(payload.order)
  const group = normalizeString(payload.group)
  const icon = normalizeString(payload.icon)
  const summary = normalizeString(payload.summary)
  const excerpt = normalizeString(payload.excerpt)
  const description = normalizeString(payload.description)
  const accent = normalizeString(payload.accent) || 'amethyst'
  const tags = normalizeStringArray(payload.tags)
  const officialHref = normalizeString(payload.officialHref) || null
  const relatedProjects = normalizeStringArray(payload.relatedProjects)
  const responsibilities = normalizeStringArray(payload.responsibilities)
  const constraints = normalizeStringArray(payload.constraints)
  const highlights = normalizeHighlights(payload.highlights)
  const sections = normalizeSections(payload.sections)

  assert(name, 'Tool entry requires "name".')
  assert(slug, 'Tool entry requires "slug".')
  ensureKebabCase(slug, 'Tool slug')
  assert(!existingSlugs.has(slug), `Duplicate tool slug "${slug}".`)
  assert(Number.isFinite(order), 'Tool "order" must be numeric.')
  assert(group, 'Tool entry requires "group".')
  assert(icon, 'Tool entry requires "icon".')
  assert(VALID_TOOL_ICONS.has(icon), `Tool icon "${icon}" is not in the allowed list.`)
  assert(summary, 'Tool entry requires "summary".')
  assert(excerpt, 'Tool entry requires "excerpt".')
  assert(description, 'Tool entry requires "description".')
  assert(VALID_ACCENTS.has(accent), 'Tool accent must be one of: amethyst, topaz, mist.')
  assert(tags.length > 0, 'Tool entry requires at least one tag.')
  validateSections('Tool', slug, sections)

  relatedProjects.forEach((projectSlug) => {
    assert(validProjectSlugs.has(projectSlug), `Tool "${slug}" references unknown project "${projectSlug}".`)
  })

  return {
    slug,
    order,
    featured: Boolean(payload.featured),
    name,
    group,
    icon,
    summary,
    excerpt,
    description,
    accent,
    tags,
    officialHref,
    relatedProjects,
    responsibilities,
    constraints,
    highlights,
    sections,
  }
}

export async function getAdminSummary({ rootDir = process.cwd(), basePath = '/' } = {}) {
  const normalizedBase = normalizeBase(basePath)
  const blogDirectory = path.resolve(rootDir, 'src/content/blog')
  const projectsPath = path.resolve(rootDir, 'src/data/projects.js')
  const toolsPath = path.resolve(rootDir, 'src/data/tools.js')

  const blog = readBlogEntries(blogDirectory, normalizedBase)
  const projects = (await importRecords(projectsPath, 'projectRecords')).map((record) => ({
    slug: record.slug,
    title: record.title,
    order: record.order,
    href: `${normalizedBase}projects/${record.slug}/`,
  }))
  const tools = (await importRecords(toolsPath, 'toolRecords')).map((record) => ({
    slug: record.slug,
    name: record.name,
    order: record.order,
    href: `${normalizedBase}tools/${record.slug}/`,
  }))

  return {
    blog,
    projects,
    tools,
  }
}

export async function createBlogEntry({ rootDir = process.cwd(), basePath = '/', payload } = {}) {
  const normalizedBase = normalizeBase(basePath)
  const contentDirectory = path.resolve(rootDir, 'src/content/blog')
  const existingEntries = readBlogEntries(contentDirectory, normalizedBase)
  const existingSlugs = new Set(existingEntries.map((entry) => entry.slug))
  const entry = validateBlogPayload(payload, existingSlugs)
  const targetPath = path.resolve(contentDirectory, `${entry.slug}.md`)
  const previousExists = fs.existsSync(targetPath)
  const previousSource = previousExists ? fs.readFileSync(targetPath, 'utf8') : null

  ensureDirectory(contentDirectory)

  try {
    const source = matter.stringify(`${entry.body}\n`, {
      title: entry.title,
      excerpt: entry.excerpt,
      description: entry.description,
      publishedAt: entry.publishedAt,
      tags: entry.tags,
      featured: entry.featured,
      accent: entry.accent,
      draft: entry.draft,
      ...(entry.cover ? { cover: entry.cover } : {}),
    })

    fs.writeFileSync(targetPath, source, 'utf8')
    const { posts } = generateBlog({ rootDir, basePath })
    const generatedPost = posts.find((post) => post.slug === entry.slug)

    return {
      ok: true,
      slug: entry.slug,
      href: generatedPost?.href ?? null,
      file: 'src/content/blog/' + path.basename(targetPath),
    }
  } catch (error) {
    if (previousExists && previousSource !== null) {
      fs.writeFileSync(targetPath, previousSource, 'utf8')
    } else if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { force: true })
    }

    generateBlog({ rootDir, basePath })
    throw error
  }
}

export async function createProjectEntry({ rootDir = process.cwd(), basePath = '/', payload } = {}) {
  const normalizedBase = normalizeBase(basePath)
  const sourcePath = path.resolve(rootDir, 'src/data/projects.js')
  const previousSource = fs.readFileSync(sourcePath, 'utf8')
  const existingRecords = await importRecords(sourcePath, 'projectRecords')
  const existingSlugs = new Set(existingRecords.map((record) => record.slug))
  const entry = validateProjectPayload(payload, existingSlugs)

  try {
    const nextRecords = [...existingRecords, entry]
    fs.writeFileSync(sourcePath, toJavaScriptModule('projectRecords', nextRecords), 'utf8')
    await generatePortfolioContent({ rootDir, basePath })

    return {
      ok: true,
      slug: entry.slug,
      href: `${normalizedBase}projects/${entry.slug}/`,
      file: 'src/data/projects.js',
    }
  } catch (error) {
    fs.writeFileSync(sourcePath, previousSource, 'utf8')
    await generatePortfolioContent({ rootDir, basePath })
    throw error
  }
}

export async function createToolEntry({ rootDir = process.cwd(), basePath = '/', payload } = {}) {
  const normalizedBase = normalizeBase(basePath)
  const sourcePath = path.resolve(rootDir, 'src/data/tools.js')
  const projectsPath = path.resolve(rootDir, 'src/data/projects.js')
  const previousSource = fs.readFileSync(sourcePath, 'utf8')
  const existingRecords = await importRecords(sourcePath, 'toolRecords')
  const projectRecords = await importRecords(projectsPath, 'projectRecords')
  const existingSlugs = new Set(existingRecords.map((record) => record.slug))
  const projectSlugs = new Set(projectRecords.map((record) => record.slug))
  const entry = validateToolPayload(payload, existingSlugs, projectSlugs)

  try {
    const nextRecords = [...existingRecords, entry]
    fs.writeFileSync(sourcePath, toJavaScriptModule('toolRecords', nextRecords), 'utf8')
    await generatePortfolioContent({ rootDir, basePath })

    return {
      ok: true,
      slug: entry.slug,
      href: `${normalizedBase}tools/${entry.slug}/`,
      file: 'src/data/tools.js',
    }
  } catch (error) {
    fs.writeFileSync(sourcePath, previousSource, 'utf8')
    await generatePortfolioContent({ rootDir, basePath })
    throw error
  }
}

export { VALID_ACCENTS, VALID_TOOL_ICONS, slugify }
