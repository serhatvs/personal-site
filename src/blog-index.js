import './styles/index.css'
import './styles/blog.css'
import { blogManifest } from '@/generated/blog-manifest.js'
import { bootstrapBlogPage } from './modules/core/blog-bootstrap.js'
import { renderBlogArchive } from './modules/render/render-blog-archive.js'

bootstrapBlogPage({
  renderMain() {
    renderBlogArchive(document.querySelector('[data-blog-archive]'), blogManifest)
  },
})
