import './styles/index.css'
import './styles/editorial.css'
import { projectsManifest } from '@/generated/projects-manifest.js'
import { toolsManifest } from '@/generated/tools-manifest.js'
import { bootstrapEditorialPage } from './modules/core/editorial-bootstrap.js'
import { renderRelatedTools } from './modules/render/render-tools-related.js'
import { renderToolProjects } from './modules/render/render-tool-projects.js'

bootstrapEditorialPage({
  pageKind: 'tools',
  renderMain() {
    const detailRoot = document.querySelector('[data-tool-detail]')
    const relatedToolsContainer = document.querySelector('[data-related-tools]')
    const relatedProjectsContainer = document.querySelector('[data-tool-projects]')

    if (!detailRoot) {
      return
    }

    const currentTool = toolsManifest.find((tool) => tool.slug === detailRoot.dataset.toolSlug)
    if (!currentTool) {
      return
    }

    if (relatedToolsContainer) {
      renderRelatedTools(relatedToolsContainer, currentTool, toolsManifest)
    }

    if (relatedProjectsContainer) {
      renderToolProjects(relatedProjectsContainer, currentTool, projectsManifest)
    }
  },
})
