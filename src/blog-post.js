import './styles/index.css'
import './styles/editorial.css'
import './styles/blog.css'
import { blogManifest } from '@/generated/blog-manifest.js'
import { bootstrapEditorialPage } from './modules/core/editorial-bootstrap.js'
import { renderRelatedPosts } from './modules/render/render-related-posts.js'

bootstrapEditorialPage({
  pageKind: 'journal',
  renderMain() {
    const postRoot = document.querySelector('[data-blog-post]')
    const relatedPostsContainer = document.querySelector('[data-related-posts]')

    if (!postRoot || !relatedPostsContainer) {
      return
    }

    const currentPost = blogManifest.find((post) => post.slug === postRoot.dataset.blogSlug)
    if (!currentPost) {
      return
    }

    renderRelatedPosts(relatedPostsContainer, currentPost, blogManifest)
  },
})
