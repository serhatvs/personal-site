import { VALID_ACCENTS } from './admin-validators.js'

function renderAccentOptions(selectedAccent = 'amethyst') {
  return VALID_ACCENTS.map((accent) => `<option value="${accent}" ${accent === selectedAccent ? 'selected' : ''}>${accent}</option>`).join('')
}

function renderSectionItem(section = {}) {
  return `
    <div class="admin-section-card" data-section-item>
      <div class="admin-section-card__toolbar">
        <p class="field-label">Section</p>
        <button type="button" class="admin-link-button" data-remove-section>Remove</button>
      </div>
      <label class="field-shell">
        <span class="field-label">Section title</span>
        <input type="text" class="field-input" data-section-title value="${section.title || ''}" placeholder="Challenge" />
      </label>
      <label class="field-shell">
        <span class="field-label">Paragraphs</span>
        <textarea class="field-input field-textarea admin-textarea--medium" data-section-paragraphs placeholder="First paragraph.&#10;&#10;Second paragraph.">${section.paragraphs?.join('\n\n') || ''}</textarea>
      </label>
    </div>
  `
}

export function renderProjectForm({ canWrite, result, nextOrder }) {
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
            <p class="section-kicker text-topaz-300">Add Project</p>
            <h2 class="admin-panel__title">Create a new project case for home, archive, and detail routes.</h2>
          </div>
          <p class="admin-helper">Rewrites <code>src/data/projects.js</code> and regenerates project detail pages.</p>
        </div>

        <form data-admin-form="project" class="admin-form">
          <div class="admin-form-grid">
            <label class="field-shell">
              <span class="field-label">Title</span>
              <input name="title" type="text" class="field-input" placeholder="New Project" />
            </label>

            <label class="field-shell">
              <span class="field-label">Slug</span>
              <input name="slug" type="text" class="field-input" placeholder="new-project" />
              <span class="admin-helper" data-slug-feedback>Lowercase kebab-case slug.</span>
            </label>
          </div>

          <div class="admin-form-grid admin-form-grid--triple">
            <label class="field-shell">
              <span class="field-label">Order</span>
              <input name="order" type="number" class="field-input" value="${nextOrder}" />
            </label>

            <label class="field-shell">
              <span class="field-label">Category</span>
              <input name="category" type="text" class="field-input" placeholder="Frontend Architecture" />
            </label>

            <label class="field-shell">
              <span class="field-label">Accent</span>
              <select name="accent" class="field-input admin-select">
                ${renderAccentOptions()}
              </select>
            </label>
          </div>

          <div class="admin-form-grid admin-form-grid--triple">
            <label class="field-shell">
              <span class="field-label">Year</span>
              <input name="year" type="text" class="field-input" placeholder="2026" />
            </label>

            <label class="field-shell">
              <span class="field-label">Status</span>
              <input name="status" type="text" class="field-input" placeholder="Concept Launch" />
            </label>

            <label class="admin-checkbox admin-checkbox--align-end">
              <input name="featured" type="checkbox" />
              <span>Featured project</span>
            </label>
          </div>

          <label class="field-shell">
            <span class="field-label">Summary</span>
            <textarea name="summary" class="field-input field-textarea admin-textarea--medium" placeholder="Short archive summary."></textarea>
          </label>

          <label class="field-shell">
            <span class="field-label">Excerpt</span>
            <textarea name="excerpt" class="field-input field-textarea admin-textarea--medium" placeholder="Detail hero summary."></textarea>
          </label>

          <label class="field-shell">
            <span class="field-label">Description</span>
            <textarea name="description" class="field-input field-textarea admin-textarea--medium" placeholder="SEO description."></textarea>
          </label>

          <div class="admin-form-grid">
            <label class="field-shell">
              <span class="field-label">Tags</span>
              <input name="tags" type="text" class="field-input" placeholder="Architecture, Motion" />
              <span class="admin-helper">Comma-separated.</span>
            </label>

            <label class="field-shell">
              <span class="field-label">Stack</span>
              <input name="stack" type="text" class="field-input" placeholder="Vite, GSAP, Three.js" />
              <span class="admin-helper">Comma-separated.</span>
            </label>
          </div>

          <div class="admin-form-grid">
            <label class="field-shell">
              <span class="field-label">Live link</span>
              <input name="live" type="url" class="field-input" placeholder="https://example.com" />
            </label>

            <label class="field-shell">
              <span class="field-label">Repository link</span>
              <input name="repo" type="url" class="field-input" placeholder="https://github.com/..." />
            </label>
          </div>

          <label class="field-shell">
            <span class="field-label">Role</span>
            <input name="role" type="text" class="field-input" placeholder="System Architect &amp; Developer" />
          </label>

          <div class="admin-form-grid">
            <label class="field-shell">
              <span class="field-label">Scope</span>
              <textarea name="scope" class="field-input field-textarea admin-textarea--medium" placeholder="Frontend architecture&#10;Static delivery"></textarea>
              <span class="admin-helper">One item per line.</span>
            </label>

            <label class="field-shell">
              <span class="field-label">Highlights</span>
              <textarea name="highlights" class="field-input field-textarea admin-textarea--medium" placeholder="Build Model: Static-first&#10;Motion Owner: GSAP + Three.js"></textarea>
              <span class="admin-helper">One line per highlight. Use <code>Label: Value</code>.</span>
            </label>
          </div>

          <div class="field-shell">
            <div class="admin-section-header">
              <span class="field-label">Sections</span>
              <button type="button" class="admin-link-button" data-add-section>Add section</button>
            </div>
            <div class="admin-section-list" data-section-list>
              ${renderSectionItem({ title: 'Challenge', paragraphs: ['First paragraph.', 'Second paragraph.'] })}
              ${renderSectionItem({ title: 'Outcome', paragraphs: ['First paragraph.', 'Second paragraph.'] })}
            </div>
            <template data-section-template>${renderSectionItem()}</template>
          </div>

          ${statusMarkup}

          <div class="admin-submit-row">
            <button type="submit" class="void-button" ${canWrite ? '' : 'disabled'}>
              Create project
              <i data-lucide="send"></i>
            </button>
          </div>
        </form>
      </article>

      <aside data-admin-summary-slot></aside>
    </div>
  `
}
