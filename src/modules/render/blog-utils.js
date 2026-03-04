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
