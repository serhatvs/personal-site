import { VALID_ACCENTS } from './admin-validators.js'

function renderAccentOptions(selectedAccent = 'amethyst') {
  return VALID_ACCENTS.map((accent) => `<option value="${accent}" ${accent === selectedAccent ? 'selected' : ''}>${accent}</option>`).join('')
}

export function renderBlogForm({ canWrite, result, defaultDate }) {
  const statusMarkup = result
    ? `
      <div class="admin-message ${result.kind === 'error' ? 'admin-message--error' : 'admin-message--success'}" data-form-status>
        <span>${result.message}</span>
        ${result.href ? `<a href="${result.href}" class="admin-summary-link">Open route</a>` : ''}
      </div>
    `
    : '<div data-form-status></div>'

  return `
    <div class="admin-grid">
      <article class="glass-panel admin-panel">
        <div class="admin-panel__header">
          <div>
            <p class="section-kicker text-topaz-300">Add Blog Entry</p>
            <h2 class="admin-panel__title">Create a new markdown-backed journal note.</h2>
          </div>
          <p class="admin-helper">Writes a new file into <code>src/content/blog/</code> and regenerates journal routes.</p>
        </div>

        <form data-admin-form="blog" class="admin-form">
          <div class="admin-form-grid">
            <label class="field-shell">
              <span class="field-label">Title</span>
              <input name="title" type="text" class="field-input" placeholder="Motion Ownership in Static Sites" />
            </label>

            <label class="field-shell">
              <span class="field-label">Slug</span>
              <input name="slug" type="text" class="field-input" placeholder="motion-ownership-in-static-sites" />
              <span class="admin-helper" data-slug-feedback>Lowercase kebab-case slug.</span>
            </label>
          </div>

          <div class="admin-form-grid">
            <label class="field-shell">
              <span class="field-label">Published date</span>
              <input name="publishedAt" type="date" class="field-input" value="${defaultDate}" />
            </label>

            <label class="field-shell">
              <span class="field-label">Accent</span>
              <select name="accent" class="field-input admin-select">
                ${renderAccentOptions()}
              </select>
            </label>
          </div>

          <div class="admin-form-grid admin-form-grid--compact">
            <label class="admin-checkbox">
              <input name="featured" type="checkbox" />
              <span>Featured entry</span>
            </label>

            <label class="admin-checkbox">
              <input name="draft" type="checkbox" />
              <span>Draft only</span>
            </label>
          </div>

          <label class="field-shell">
            <span class="field-label">Excerpt</span>
            <textarea name="excerpt" class="field-input field-textarea admin-textarea--medium" placeholder="Short summary for cards and entry hero."></textarea>
          </label>

          <label class="field-shell">
            <span class="field-label">Description</span>
            <textarea name="description" class="field-input field-textarea admin-textarea--medium" placeholder="SEO description for the entry page."></textarea>
          </label>

          <div class="admin-form-grid">
            <label class="field-shell">
              <span class="field-label">Tags</span>
              <input name="tags" type="text" class="field-input" placeholder="GSAP, Architecture, Performance" />
              <span class="admin-helper">Comma-separated.</span>
            </label>

            <label class="field-shell">
              <span class="field-label">Cover</span>
              <input name="cover" type="text" class="field-input" placeholder="/blog-media/entry/cover.webp" />
              <span class="admin-helper">Optional asset path or URL.</span>
            </label>
          </div>

          <label class="field-shell">
            <span class="field-label">Body</span>
            <textarea name="body" class="field-input field-textarea admin-textarea--xl" placeholder="# Heading&#10;&#10;Markdown body..."></textarea>
            <span class="admin-helper">Markdown is supported. Save is disabled on static deployments.</span>
          </label>

          ${statusMarkup}

          <div class="admin-submit-row">
            <button type="submit" class="void-button" ${canWrite ? '' : 'disabled'}>
              Create blog entry
              <i data-lucide="send"></i>
            </button>
          </div>
        </form>
      </article>

      <aside data-admin-summary-slot></aside>
    </div>
  `
}
