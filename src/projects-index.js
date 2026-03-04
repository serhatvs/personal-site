import './styles/index.css'
import './styles/editorial.css'
import { projectsManifest } from '@/generated/projects-manifest.js'
import { bootstrapEditorialPage } from './modules/core/editorial-bootstrap.js'
import { renderProjectArchive } from './modules/render/render-project-archive.js'

bootstrapEditorialPage({
  pageKind: 'projects',
  renderMain() {
    renderProjectArchive(document.querySelector('[data-projects-archive]'), projectsManifest)
  },
})
