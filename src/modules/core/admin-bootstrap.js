import { createToastController } from '../ui/toast.js'
import { initIcons } from '../ui/icons.js'
import {
  createBlogEntry,
  createProjectEntry,
  createToolEntry,
  getAdminStatus,
  getAdminSummary,
} from '../admin/api-client.js'
import { attachAutoSlug, slugify } from '../admin/admin-slug.js'
import { serializeBlogForm, serializeProjectForm, serializeToolForm } from '../admin/admin-serializers.js'
import {
  validateBlogPayload,
  validateProjectPayload,
  validateToolPayload,
} from '../admin/admin-validators.js'
import { createAdminState } from '../admin/admin-state.js'
import { renderAdminShell } from '../admin/render-admin-shell.js'
import { renderAdminSummary } from '../admin/render-admin-summary.js'
import { renderBlogForm } from '../admin/render-blog-form.js'
import { renderProjectForm } from '../admin/render-project-form.js'
import { renderToolForm } from '../admin/render-tool-form.js'

const submitters = {
  blog: createBlogEntry,
  project: createProjectEntry,
  tool: createToolEntry,
}

const serializers = {
  blog: serializeBlogForm,
  project: serializeProjectForm,
  tool: serializeToolForm,
}

const validators = {
  blog: validateBlogPayload,
  project: validateProjectPayload,
  tool: validateToolPayload,
}

function getDefaultDate() {
  return new Date().toISOString().slice(0, 10)
}

function getNextOrder(items) {
  const maxOrder = items.reduce((currentMax, item) => Math.max(currentMax, Number(item.order) || 0), 0)
  return maxOrder ? maxOrder + 10 : 10
}

function getPreviewHref(tab, slug, form) {
  if (!slug) {
    return ''
  }

  const baseUrl = import.meta.env.BASE_URL || '/'
  const prefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`

  if (tab === 'blog' && form?.elements?.draft?.checked) {
    return `Creates src/content/blog/${slug}.md as a draft.`
  }

  const routeRoot = tab === 'blog' ? 'blog' : tab === 'project' ? 'projects' : 'tools'
  return `Will create ${prefix}${routeRoot}/${slug}/`
}

function renderPanel(tab, state) {
  const summaryMarkup = renderAdminSummary(tab, state.summary)

  if (tab === 'blog') {
    return renderBlogForm({
      canWrite: state.status.canWrite,
      result: state.results.blog,
      defaultDate: getDefaultDate(),
    }).replace('<aside data-admin-summary-slot></aside>', `<aside data-admin-summary-slot>${summaryMarkup}</aside>`)
  }

  if (tab === 'project') {
    return renderProjectForm({
      canWrite: state.status.canWrite,
      result: state.results.project,
      nextOrder: getNextOrder(state.summary.projects),
    }).replace('<aside data-admin-summary-slot></aside>', `<aside data-admin-summary-slot>${summaryMarkup}</aside>`)
  }

  return renderToolForm({
    canWrite: state.status.canWrite,
    result: state.results.tool,
    nextOrder: getNextOrder(state.summary.tools),
  }).replace('<aside data-admin-summary-slot></aside>', `<aside data-admin-summary-slot>${summaryMarkup}</aside>`)
}

function attachSectionRepeater(form) {
  const list = form.querySelector('[data-section-list]')
  const template = form.querySelector('[data-section-template]')
  const addButton = form.querySelector('[data-add-section]')

  if (!list || !template || !addButton) {
    return
  }

  addButton.addEventListener('click', () => {
    list.insertAdjacentHTML('beforeend', template.innerHTML.trim())
  })

  list.addEventListener('click', (event) => {
    const removeButton = event.target.closest('[data-remove-section]')

    if (!removeButton) {
      return
    }

    const sectionItems = [...list.querySelectorAll('[data-section-item]')]
    const sectionRoot = removeButton.closest('[data-section-item]')

    if (sectionItems.length <= 2 || !sectionRoot) {
      sectionRoot?.querySelector('[data-section-title]')?.focus()
      return
    }

    sectionRoot.remove()
  })
}

function attachSlugFeedback(form, tab, summary) {
  const slugInput = form.elements.slug
  const feedback = form.querySelector('[data-slug-feedback]')

  if (!slugInput || !feedback) {
    return
  }

  const renderFeedback = () => {
    const normalizedSlug = slugify(slugInput.value)
    const collection = tab === 'blog' ? summary.blog : tab === 'project' ? summary.projects : summary.tools

    if (!normalizedSlug) {
      feedback.textContent = 'Lowercase kebab-case slug.'
      feedback.classList.remove('admin-helper--error')
      return
    }

    if (collection.some((item) => item.slug === normalizedSlug)) {
      feedback.textContent = `Slug "${normalizedSlug}" already exists.`
      feedback.classList.add('admin-helper--error')
      return
    }

    feedback.textContent = getPreviewHref(tab, normalizedSlug, form)
    feedback.classList.remove('admin-helper--error')
  }

  slugInput.addEventListener('input', renderFeedback)

  if (tab === 'blog' && form.elements.draft) {
    form.elements.draft.addEventListener('change', renderFeedback)
  }

  renderFeedback()
}

export async function bootstrapAdminPage({ root, fallbackSummary }) {
  if (!root) {
    return
  }

  const stateStore = createAdminState({ fallbackSummary })

  try {
    const status = await getAdminStatus()
    stateStore.setStatus(status)

    if (status.canWrite) {
      stateStore.setSummary(await getAdminSummary())
    }
  } catch {
    stateStore.setStatus({
      mode: 'static',
      canWrite: false,
    })
  }

  const render = () => {
    const state = stateStore.get()
    root.innerHTML = renderAdminShell({
      status: state.status,
      activeTab: state.activeTab,
    })

    const panelHost = root.querySelector('[data-admin-panel-host]')
    panelHost.innerHTML = renderPanel(state.activeTab, state)

    root.querySelectorAll('[data-admin-tab]').forEach((button) => {
      button.addEventListener('click', () => {
        stateStore.setActiveTab(button.dataset.adminTab)
        render()
      })
    })

    const form = root.querySelector(`[data-admin-form="${state.activeTab}"]`)

    if (form) {
      attachAutoSlug(form, state.activeTab === 'tool' ? 'name' : 'title')
      attachSectionRepeater(form)
      attachSlugFeedback(form, state.activeTab, state.summary)

      form.addEventListener('submit', async (event) => {
        event.preventDefault()

        if (!stateStore.get().status.canWrite) {
          return
        }

        const submitButton = form.querySelector('button[type="submit"]')
        submitButton?.setAttribute('disabled', 'true')

        try {
          const payload = serializers[state.activeTab](form)
          const errors = validators[state.activeTab](payload, stateStore.get().summary)

          if (errors.length) {
            throw new Error(errors[0])
          }

          const result = await submitters[state.activeTab](payload)

          stateStore.setResult(state.activeTab, {
            kind: 'success',
            message: result.href
              ? `Saved successfully. Generated route for "${result.slug}".`
              : `Saved successfully. Draft stored for "${result.slug}".`,
            href: result.href,
          })

          stateStore.setSummary(await getAdminSummary())
          render()
          createToastController(root.querySelector('[data-admin-toast-root]')).show('Content saved successfully.')
        } catch (error) {
          stateStore.setResult(state.activeTab, {
            kind: 'error',
            message: error instanceof Error ? error.message : 'Unable to save this entry.',
            href: null,
          })
          render()
          createToastController(root.querySelector('[data-admin-toast-root]')).show('Save failed.')
        }
      })
    }

    initIcons(root)
  }

  render()

  if (!stateStore.get().status.canWrite) {
    createToastController(root.querySelector('[data-admin-toast-root]')).show('Admin write actions are disabled outside the local dev server.')
  }
}
