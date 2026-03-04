export const VALID_ACCENTS = ['amethyst', 'topaz', 'mist']
export const VALID_TOOL_ICONS = ['workflow', 'boxes', 'database', 'sparkles', 'waypoints', 'badge-check', 'cpu', 'cloud', 'mail']
export const VALID_TOOL_GROUPS = ['Foundation', 'Motion', 'Experience', 'Interface', 'Delivery']

function isKebabCase(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime())
}

function hasDuplicate(items, slug) {
  return items.some((item) => item.slug === slug)
}

function validateSections(sections, label) {
  if (sections.length < 2) {
    return [`${label} requires at least two sections.`]
  }

  const errors = []

  sections.forEach((section, index) => {
    if (!section.title) {
      errors.push(`${label} section ${index + 1} needs a title.`)
    }

    if (!Array.isArray(section.paragraphs) || section.paragraphs.length === 0) {
      errors.push(`${label} section ${index + 1} needs at least one paragraph.`)
    }
  })

  return errors
}

export function validateBlogPayload(payload, summary) {
  const errors = []

  if (!payload.title) errors.push('Blog title is required.')
  if (!payload.slug) errors.push('Blog slug is required.')
  if (payload.slug && !isKebabCase(payload.slug)) errors.push('Blog slug must be lowercase kebab-case.')
  if (payload.slug && hasDuplicate(summary.blog, payload.slug)) errors.push(`Blog slug "${payload.slug}" already exists.`)
  if (!payload.excerpt) errors.push('Blog excerpt is required.')
  if (!payload.description) errors.push('Blog description is required.')
  if (!isIsoDate(payload.publishedAt)) errors.push('Blog published date must use YYYY-MM-DD.')
  if (!VALID_ACCENTS.includes(payload.accent)) errors.push('Blog accent is invalid.')
  if (!payload.tags.length) errors.push('Blog entry needs at least one tag.')
  if (!payload.body) errors.push('Blog body is required.')

  return errors
}

export function validateProjectPayload(payload, summary) {
  const errors = []

  if (!payload.title) errors.push('Project title is required.')
  if (!payload.slug) errors.push('Project slug is required.')
  if (payload.slug && !isKebabCase(payload.slug)) errors.push('Project slug must be lowercase kebab-case.')
  if (payload.slug && hasDuplicate(summary.projects, payload.slug)) errors.push(`Project slug "${payload.slug}" already exists.`)
  if (!Number.isFinite(payload.order)) errors.push('Project order must be numeric.')
  if (!payload.category) errors.push('Project category is required.')
  if (!payload.summary) errors.push('Project summary is required.')
  if (!payload.excerpt) errors.push('Project excerpt is required.')
  if (!payload.description) errors.push('Project description is required.')
  if (!VALID_ACCENTS.includes(payload.accent)) errors.push('Project accent is invalid.')
  if (!payload.tags.length) errors.push('Project needs at least one tag.')
  if (!payload.stack.length) errors.push('Project needs at least one stack item.')
  if (!payload.role) errors.push('Project role is required.')
  errors.push(...validateSections(payload.sections, 'Project'))

  return errors
}

export function validateToolPayload(payload, summary) {
  const errors = []
  const validProjectSlugs = new Set(summary.projects.map((item) => item.slug))

  if (!payload.name) errors.push('Tool name is required.')
  if (!payload.slug) errors.push('Tool slug is required.')
  if (payload.slug && !isKebabCase(payload.slug)) errors.push('Tool slug must be lowercase kebab-case.')
  if (payload.slug && hasDuplicate(summary.tools, payload.slug)) errors.push(`Tool slug "${payload.slug}" already exists.`)
  if (!Number.isFinite(payload.order)) errors.push('Tool order must be numeric.')
  if (!VALID_TOOL_GROUPS.includes(payload.group)) errors.push('Tool group is invalid.')
  if (!VALID_TOOL_ICONS.includes(payload.icon)) errors.push('Tool icon is invalid.')
  if (!payload.summary) errors.push('Tool summary is required.')
  if (!payload.excerpt) errors.push('Tool excerpt is required.')
  if (!payload.description) errors.push('Tool description is required.')
  if (!VALID_ACCENTS.includes(payload.accent)) errors.push('Tool accent is invalid.')
  if (!payload.tags.length) errors.push('Tool needs at least one tag.')

  payload.relatedProjects.forEach((slug) => {
    if (!validProjectSlugs.has(slug)) {
      errors.push(`Tool references unknown project "${slug}".`)
    }
  })

  errors.push(...validateSections(payload.sections, 'Tool'))

  return errors
}
