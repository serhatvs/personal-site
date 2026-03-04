import './styles/index.css'
import './styles/editorial.css'
import { projectsManifest } from '@/generated/projects-manifest.js'
import { bootstrapEditorialPage } from './modules/core/editorial-bootstrap.js'
import { renderRelatedProjects } from './modules/render/render-project-related.js'

bootstrapEditorialPage({
  pageKind: 'projects',
  renderMain() {
    const detailRoot = document.querySelector('[data-project-detail]')
    const relatedContainer = document.querySelector('[data-related-projects]')

    if (!detailRoot || !relatedContainer) {
      return
    }

    const currentProject = projectsManifest.find((project) => project.slug === detailRoot.dataset.projectSlug)
    if (!currentProject) {
      return
    }

    renderRelatedProjects(relatedContainer, currentProject, projectsManifest)
  },
})
