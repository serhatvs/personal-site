import { formatBlogDate, formatReadingTime, getJournalHref, getPreviewPosts } from './blog-utils.js'

function renderTags(tags) {
  return tags
    .slice(0, 3)
    .map((tag) => `<span class="chip !px-3 !py-1.5 !text-[0.65rem] !tracking-[0.2em]">${tag}</span>`)
    .join('')
}

export function renderBlogPreview(container, posts, options = {}) {
  if (!container) {
    return
  }

  const previewPosts = getPreviewPosts(posts, options.previewCount ?? 3)
  const journalHref = getJournalHref()

  if (!previewPosts.length) {
    container.innerHTML = `
      <article data-reveal-item class="glass-panel rounded-[2rem] p-8 text-sm text-mist-200/70">
        Journal entries are being prepared.
      </article>
    `
    return
  }

  container.innerHTML = `
    <div class="journal-preview-grid">
      ${previewPosts
        .map(
          (post, index) => `
            <article data-reveal-item class="journal-card ${index === 0 ? 'journal-card--feature' : ''}">
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
                <span class="eyebrow text-amethyst-200">${post.featured ? 'Featured entry' : 'Recent note'}</span>
                <a href="${post.href}" class="social-link">
                  Read entry
                  <i data-lucide="arrow-up-right"></i>
                </a>
              </div>
            </article>
          `,
        )
        .join('')}
    </div>

    <div data-reveal-item class="mt-8 flex justify-end">
      <a href="${journalHref}" data-journal-cta class="void-button">
        View all writing
        <i data-lucide="arrow-right"></i>
      </a>
    </div>
  `
}
