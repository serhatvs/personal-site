import './styles/index.css'
import './styles/editorial.css'
import { toolsManifest } from '@/generated/tools-manifest.js'
import { bootstrapEditorialPage } from './modules/core/editorial-bootstrap.js'
import { renderToolsArchive } from './modules/render/render-tools-archive.js'

bootstrapEditorialPage({
  pageKind: 'tools',
  renderMain() {
    renderToolsArchive(document.querySelector('[data-tools-archive]'), toolsManifest)
  },
})
