import './styles/index.css'
import './styles/editorial.css'
import './styles/blog.css'
import { blogManifest } from '@/generated/blog-manifest.js'
import { bootstrapEditorialPage } from './modules/core/editorial-bootstrap.js'
import { renderBlogArchive } from './modules/render/render-blog-archive.js'

bootstrapEditorialPage({
  pageKind: 'journal',
  renderMain() {
    renderBlogArchive(document.querySelector('[data-blog-archive]'), blogManifest)
  },
})
