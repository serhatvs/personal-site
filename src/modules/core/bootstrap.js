import { blogManifest } from '@/generated/blog-manifest.js'
import { projectsManifest } from '@/generated/projects-manifest.js'
import { toolsManifest } from '@/generated/tools-manifest.js'
import { siteContent } from '@/data/site-content.js'
import { renderBlogPreview } from '../render/render-blog-preview.js'
import { renderProjects } from '../render/render-projects.js'
import { renderSocials } from '../render/render-socials.js'
import { renderStack } from '../render/render-stack.js'
import { renderStats } from '../render/render-stats.js'
import { initContactForm } from '../ui/contact-form.js'
import { initIcons } from '../ui/icons.js'
import { initMobileMenu } from '../ui/mobile-menu.js'
import { initNavigation } from '../ui/navigation.js'
import { createToastController } from '../ui/toast.js'
import { canUseWebGL, prefersReducedMotion, scheduleEnhancement, startMotionEnhancements, startThreeEnhancement } from './motion.js'
import { getElements } from './selectors.js'

export function bootstrap() {
  const dom = getElements()

  renderProjects(dom.projects, projectsManifest, {
    previewCount: siteContent.projectsSection.previewCount,
    archiveCtaLabel: siteContent.projectsSection.archiveCtaLabel,
  })
  renderBlogPreview(dom.blogPreview, blogManifest, { previewCount: siteContent.journal.previewCount })
  renderStack(dom.stack, toolsManifest, {
    archiveCtaLabel: siteContent.toolsSection.archiveCtaLabel,
  })
  renderStats(dom.stats, siteContent.stats)
  renderSocials(dom.socials, siteContent.socials)

  dom.currentYear.forEach((node) => {
    node.textContent = String(new Date().getFullYear())
  })

  initIcons()

  const toast = createToastController(dom.toastRoot)
  const mobileMenu = initMobileMenu(dom)

  initNavigation({
    header: dom.header,
    onNavigate: mobileMenu.close,
  })

  initContactForm({
    form: dom.contactForm,
    statusElement: dom.formStatus,
    submitButton: dom.submitButton,
    endpoint: import.meta.env.VITE_CONTACT_ENDPOINT,
    fallbackEmail: siteContent.contact.email,
    toast,
  })

  const reducedMotion = prefersReducedMotion()

  if (reducedMotion) {
    document.documentElement.classList.add('motion-reduced')
  }

  const launchEnhancements = async () => {
    if (!reducedMotion) {
      await startMotionEnhancements()
    }

    if (!reducedMotion && dom.canvas && canUseWebGL()) {
      await startThreeEnhancement(dom.canvas)
    }
  }

  const runEnhancements = () =>
    scheduleEnhancement(async () => {
      try {
        await launchEnhancements()
      } catch (error) {
        console.error('Enhancement bootstrap failed', error)
      }
    })

  if (document.readyState === 'complete') {
    runEnhancements()
  } else {
    window.addEventListener('load', runEnhancements, { once: true })
  }
}
