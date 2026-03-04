import { formatBlogDate, formatReadingTime } from './blog-utils.js'

function renderTags(tags) {
  return tags
    .slice(0, 3)
    .map((tag) => `<span class="chip !px-3 !py-1.5 !text-[0.65rem] !tracking-[0.2em]">${tag}</span>`)
    .join('')
}

export function renderBlogArchive(container, posts) {
  if (!container) {
    return
  }

  if (!posts.length) {
    container.innerHTML = `
      <article class="glass-panel rounded-[2rem] p-8 text-sm text-mist-200/70">
        No journal entries published yet.
      </article>
    `
    return
  }

  container.innerHTML = posts
    .map(
      (post) => `
        <article class="journal-card journal-card--archive">
          <div class="journal-card__meta">
            <span class="chip chip-ghost">${formatBlogDate(post.publishedAt)}</span>
            <span class="journal-card__reading">${formatReadingTime(post.readingTime)}</span>
          </div>

          <h2 class="journal-card__title">${post.title}</h2>
          <p class="journal-card__excerpt">${post.excerpt}</p>

          <div class="journal-card__tags">
            ${renderTags(post.tags)}
          </div>

          <div class="journal-card__footer">
            <span class="eyebrow text-topaz-300">${post.featured ? 'Featured entry' : 'Journal entry'}</span>
            <a href="${post.href}" class="social-link">
              Read entry
              <i data-lucide="arrow-up-right"></i>
            </a>
          </div>
        </article>
      `,
    )
    .join('')
}
