function getValue(form, name) {
  return String(form.elements[name]?.value ?? '')
}

function parseCommaSeparated(value) {
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseLineSeparated(value) {
  return String(value)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseHighlights(value) {
  return parseLineSeparated(value).map((line) => {
    const separatorIndex = line.indexOf(':')

    if (separatorIndex <= 0 || separatorIndex === line.length - 1) {
      throw new Error('Highlights must use "Label: Value" format.')
    }

    return {
      label: line.slice(0, separatorIndex).trim(),
      value: line.slice(separatorIndex + 1).trim(),
    }
  })
}

function parseSectionParagraphs(value) {
  return String(value)
    .split(/\r?\n\s*\r?\n/g)
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseSections(form) {
  return [...form.querySelectorAll('[data-section-item]')].map((item) => ({
    title: String(item.querySelector('[data-section-title]')?.value ?? '').trim(),
    paragraphs: parseSectionParagraphs(item.querySelector('[data-section-paragraphs]')?.value ?? ''),
  }))
}

export function serializeBlogForm(form) {
  return {
    title: getValue(form, 'title').trim(),
    slug: getValue(form, 'slug').trim(),
    excerpt: getValue(form, 'excerpt').trim(),
    description: getValue(form, 'description').trim(),
    publishedAt: getValue(form, 'publishedAt').trim(),
    accent: getValue(form, 'accent').trim(),
    featured: form.elements.featured.checked,
    draft: form.elements.draft.checked,
    tags: parseCommaSeparated(getValue(form, 'tags')),
    cover: getValue(form, 'cover').trim(),
    body: getValue(form, 'body').trim(),
  }
}

export function serializeProjectForm(form) {
  return {
    title: getValue(form, 'title').trim(),
    slug: getValue(form, 'slug').trim(),
    order: Number(getValue(form, 'order')),
    featured: form.elements.featured.checked,
    category: getValue(form, 'category').trim(),
    summary: getValue(form, 'summary').trim(),
    excerpt: getValue(form, 'excerpt').trim(),
    description: getValue(form, 'description').trim(),
    year: getValue(form, 'year').trim(),
    status: getValue(form, 'status').trim(),
    accent: getValue(form, 'accent').trim(),
    tags: parseCommaSeparated(getValue(form, 'tags')),
    stack: parseCommaSeparated(getValue(form, 'stack')),
    links: {
      live: getValue(form, 'live').trim(),
      repo: getValue(form, 'repo').trim(),
    },
    role: getValue(form, 'role').trim(),
    scope: parseLineSeparated(getValue(form, 'scope')),
    highlights: parseHighlights(getValue(form, 'highlights')),
    sections: parseSections(form),
  }
}

export function serializeToolForm(form) {
  return {
    name: getValue(form, 'name').trim(),
    slug: getValue(form, 'slug').trim(),
    order: Number(getValue(form, 'order')),
    featured: form.elements.featured.checked,
    group: getValue(form, 'group').trim(),
    icon: getValue(form, 'icon').trim(),
    summary: getValue(form, 'summary').trim(),
    excerpt: getValue(form, 'excerpt').trim(),
    description: getValue(form, 'description').trim(),
    accent: getValue(form, 'accent').trim(),
    tags: parseCommaSeparated(getValue(form, 'tags')),
    officialHref: getValue(form, 'officialHref').trim(),
    relatedProjects: parseCommaSeparated(getValue(form, 'relatedProjects')),
    responsibilities: parseLineSeparated(getValue(form, 'responsibilities')),
    constraints: parseLineSeparated(getValue(form, 'constraints')),
    highlights: parseHighlights(getValue(form, 'highlights')),
    sections: parseSections(form),
  }
}
