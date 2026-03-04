import './styles/index.css'
import './styles/blog.css'
import { blogManifest } from '@/generated/blog-manifest.js'
import { bootstrapBlogPage } from './modules/core/blog-bootstrap.js'
import { renderRelatedPosts } from './modules/render/render-related-posts.js'

bootstrapBlogPage({
  renderMain() {
    const postRoot = document.querySelector('[data-blog-post]')
    const relatedPostsContainer = document.querySelector('[data-related-posts]')

    if (!postRoot || !relatedPostsContainer) {
      return
    }

    const currentPost = blogManifest.find((post) => post.slug === postRoot.dataset.blogSlug)
    renderRelatedPosts(relatedPostsContainer, currentPost, blogManifest)
  },
})
