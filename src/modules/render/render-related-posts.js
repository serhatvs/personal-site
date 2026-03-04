import { formatBlogDate, formatReadingTime, getRelatedPosts } from './blog-utils.js'

function renderTags(tags) {
  return tags
    .slice(0, 2)
    .map((tag) => `<span class="chip !px-3 !py-1.5 !text-[0.65rem] !tracking-[0.2em]">${tag}</span>`)
    .join('')
}

export function renderRelatedPosts(container, currentPost, posts) {
  if (!container) {
    return
  }

  const relatedPosts = getRelatedPosts(posts, currentPost, 3)

  if (!relatedPosts.length) {
    container.innerHTML = `
      <article class="glass-panel rounded-[2rem] p-8 text-sm text-mist-200/70">
        More journal entries are being prepared.
      </article>
    `
    return
  }

  container.innerHTML = relatedPosts
    .map(
      (post) => `
        <article class="journal-card journal-card--related">
          <div class="journal-card__meta">
            <span class="chip chip-ghost">${formatBlogDate(post.publishedAt)}</span>
            <span class="journal-card__reading">${formatReadingTime(post.readingTime)}</span>
          </div>

          <h3 class="journal-card__title">${post.title}</h3>
          <p class="journal-card__excerpt">${post.excerpt}</p>

          <div class="journal-card__tags">
            ${renderTags(post.tags)}
          </div>

          <div class="journal-card__footer">
            <span class="eyebrow text-mist-200/60">Continue reading</span>
            <a href="${post.href}" class="social-link">
              Open entry
              <i data-lucide="arrow-up-right"></i>
            </a>
          </div>
        </article>
      `,
    )
    .join('')
}
