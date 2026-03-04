export function getBaseHref() {
  const base = import.meta.env.BASE_URL || '/'
  return base.endsWith('/') ? base : `${base}/`
}

export function getJournalHref() {
  return `${getBaseHref()}blog/`
}

export function getProjectsHref() {
  return `${getBaseHref()}projects/`
}

export function getProjectHref(slug) {
  return `${getProjectsHref()}${slug}/`
}

export function getToolsHref() {
  return `${getBaseHref()}tools/`
}

export function getToolHref(slug) {
  return `${getToolsHref()}${slug}/`
}

export function getRelatedByTags(items, currentItem, max = 3, bonusResolver = () => 0, tieBreaker = () => 0) {
  if (!currentItem) {
    return items.slice(0, max)
  }

  const currentTags = new Set(currentItem.tags ?? [])

  return items
    .filter((item) => item.slug !== currentItem.slug)
    .map((item) => ({
      item,
      score: item.tags.reduce((count, tag) => count + (currentTags.has(tag) ? 1 : 0), 0) + bonusResolver(item, currentItem),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      return tieBreaker(left.item, right.item)
    })
    .slice(0, max)
    .map(({ item }) => item)
}

export function isExternalHref(href) {
  return /^https?:\/\//.test(href || '')
}
