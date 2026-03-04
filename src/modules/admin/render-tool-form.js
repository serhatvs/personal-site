import { VALID_ACCENTS, VALID_TOOL_GROUPS, VALID_TOOL_ICONS } from './admin-validators.js'

function renderOptions(options, selectedValue = '') {
  return options.map((option) => `<option value="${option}" ${option === selectedValue ? 'selected' : ''}>${option}</option>`).join('')
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
        <input type="text" class="field-input" data-section-title value="${section.title || ''}" placeholder="Why it is in the stack" />
      </label>
      <label class="field-shell">
        <span class="field-label">Paragraphs</span>
        <textarea class="field-input field-textarea admin-textarea--medium" data-section-paragraphs placeholder="First paragraph.&#10;&#10;Second paragraph.">${section.paragraphs?.join('\n\n') || ''}</textarea>
      </label>
    </div>
  `
}

export function renderToolForm({ canWrite, result, nextOrder }) {
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
            <p class="section-kicker text-topaz-300">Add Tech Stack Item</p>
            <h2 class="admin-panel__title">Create a new tool profile for the stack slider and tools archive.</h2>
          </div>
          <p class="admin-helper">Rewrites <code>src/data/tools.js</code> and regenerates tool detail pages.</p>
        </div>

        <form data-admin-form="tool" class="admin-form">
          <div class="admin-form-grid">
            <label class="field-shell">
              <span class="field-label">Name</span>
              <input name="name" type="text" class="field-input" placeholder="GSAP" />
            </label>

            <label class="field-shell">
              <span class="field-label">Slug</span>
              <input name="slug" type="text" class="field-input" placeholder="gsap" />
              <span class="admin-helper" data-slug-feedback>Lowercase kebab-case slug.</span>
            </label>
          </div>

          <div class="admin-form-grid admin-form-grid--triple">
            <label class="field-shell">
              <span class="field-label">Order</span>
              <input name="order" type="number" class="field-input" value="${nextOrder}" />
            </label>

            <label class="field-shell">
              <span class="field-label">Group</span>
              <select name="group" class="field-input admin-select">
                ${renderOptions(VALID_TOOL_GROUPS, 'Foundation')}
              </select>
            </label>

            <label class="field-shell">
              <span class="field-label">Accent</span>
              <select name="accent" class="field-input admin-select">
                ${renderOptions(VALID_ACCENTS, 'amethyst')}
              </select>
            </label>
          </div>

          <div class="admin-form-grid admin-form-grid--compact">
            <label class="field-shell">
              <span class="field-label">Icon</span>
              <select name="icon" class="field-input admin-select">
                ${renderOptions(VALID_TOOL_ICONS, 'workflow')}
              </select>
            </label>

            <label class="admin-checkbox admin-checkbox--align-end">
              <input name="featured" type="checkbox" />
              <span>Featured tool</span>
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
              <input name="tags" type="text" class="field-input" placeholder="Motion, Timeline, Scroll" />
              <span class="admin-helper">Comma-separated.</span>
            </label>

            <label class="field-shell">
              <span class="field-label">Official docs</span>
              <input name="officialHref" type="url" class="field-input" placeholder="https://example.com" />
            </label>
          </div>

          <div class="admin-form-grid">
            <label class="field-shell">
              <span class="field-label">Related projects</span>
              <input name="relatedProjects" type="text" class="field-input" placeholder="pulse-atlas, void-relay" />
              <span class="admin-helper">Comma-separated project slugs.</span>
            </label>

            <label class="field-shell">
              <span class="field-label">Highlights</span>
              <textarea name="highlights" class="field-input field-textarea admin-textarea--medium" placeholder="Role: Timeline engine&#10;Ownership: Page-level motion"></textarea>
              <span class="admin-helper">One line per highlight. Use <code>Label: Value</code>.</span>
            </label>
          </div>

          <div class="admin-form-grid">
            <label class="field-shell">
              <span class="field-label">Responsibilities</span>
              <textarea name="responsibilities" class="field-input field-textarea admin-textarea--medium" placeholder="Hero staging&#10;Scroll reveal"></textarea>
              <span class="admin-helper">One item per line.</span>
            </label>

            <label class="field-shell">
              <span class="field-label">Constraints</span>
              <textarea name="constraints" class="field-input field-textarea admin-textarea--medium" placeholder="Reduced-motion fallback&#10;Transform-only policy"></textarea>
              <span class="admin-helper">One item per line.</span>
            </label>
          </div>

          <div class="field-shell">
            <div class="admin-section-header">
              <span class="field-label">Sections</span>
              <button type="button" class="admin-link-button" data-add-section>Add section</button>
            </div>
            <div class="admin-section-list" data-section-list>
              ${renderSectionItem({ title: 'Why it is in the stack', paragraphs: ['First paragraph.', 'Second paragraph.'] })}
              ${renderSectionItem({ title: 'Guardrails', paragraphs: ['First paragraph.', 'Second paragraph.'] })}
            </div>
            <template data-section-template>${renderSectionItem()}</template>
          </div>

          ${statusMarkup}

          <div class="admin-submit-row">
            <button type="submit" class="void-button" ${canWrite ? '' : 'disabled'}>
              Create tech stack item
              <i data-lucide="send"></i>
            </button>
          </div>
        </form>
      </article>

      <aside data-admin-summary-slot></aside>
    </div>
  `
}
