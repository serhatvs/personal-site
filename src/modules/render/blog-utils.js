const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function formatBlogDate(dateString) {
  return dateFormatter.format(new Date(`${dateString}T00:00:00Z`))
}

export function formatReadingTime(minutes) {
  return `${minutes} min read`
}

export function getPreviewPosts(posts, count) {
  const featuredPosts = posts.filter((post) => post.featured)
  const featuredSlugs = new Set(featuredPosts.map((post) => post.slug))
  const nonFeaturedPosts = posts.filter((post) => !featuredSlugs.has(post.slug))

  return [...featuredPosts, ...nonFeaturedPosts].slice(0, count)
}

export function getRelatedPosts(posts, currentPost, max = 3) {
  if (!currentPost) {
    return posts.slice(0, max)
  }

  const currentTags = new Set(currentPost.tags)

  return posts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => ({
      ...post,
      sharedTags: post.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .sort((left, right) => {
      if (right.sharedTags !== left.sharedTags) {
        return right.sharedTags - left.sharedTags
      }

      return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
    })
    .slice(0, max)
}

export function getJournalHref() {
  const base = import.meta.env.BASE_URL || '/'
  return `${base.endsWith('/') ? base : `${base}/`}blog/`
}
