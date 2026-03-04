import './styles/index.css'
import './styles/editorial.css'
import './styles/admin.css'
import { blogManifest } from '@/generated/blog-manifest.js'
import { projectsManifest } from '@/generated/projects-manifest.js'
import { toolsManifest } from '@/generated/tools-manifest.js'
import { bootstrapAdminPage } from './modules/core/admin-bootstrap.js'

const fallbackSummary = {
  blog: blogManifest.map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    draft: false,
    href: entry.href,
  })),
  projects: projectsManifest.map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    order: entry.order,
    href: entry.href,
  })),
  tools: toolsManifest.map((entry) => ({
    slug: entry.slug,
    name: entry.name,
    order: entry.order,
    href: entry.href,
  })),
}

bootstrapAdminPage({
  root: document.querySelector('[data-admin-app]'),
  fallbackSummary,
})
