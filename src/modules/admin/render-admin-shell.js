function renderTabButton(id, label, icon, isActive) {
  return `
    <button
      type="button"
      role="tab"
      aria-selected="${String(isActive)}"
      data-admin-tab="${id}"
      class="admin-tab ${isActive ? 'is-active' : ''}"
    >
      <i data-lucide="${icon}"></i>
      <span>${label}</span>
    </button>
  `
}

export function renderAdminShell({ status, activeTab }) {
  return `
    <section class="section-shell !pb-16 !pt-12">
      <div class="section-inner">
        <div class="admin-topbar">
          <a href="../" class="detail-back-link">
            <i data-lucide="arrow-left"></i>
            Back to site
          </a>
          <span class="admin-status-badge ${status.canWrite ? 'admin-status-badge--live' : 'admin-status-badge--static'}">
            <i data-lucide="${status.canWrite ? 'badge-check' : 'mail'}"></i>
            ${status.canWrite ? 'Local Write Enabled' : 'Static Preview Only'}
          </span>
        </div>

        <article class="glass-panel admin-hero">
          <div>
            <p class="section-kicker text-topaz-300">Local Content Admin</p>
            <h1 class="mt-5 text-[clamp(2.8rem,6vw,4.8rem)] font-display font-semibold tracking-[-0.06em] text-mist-50">
              Add journal entries, project cases, and tech stack records from one route.
            </h1>
            <p class="admin-hero__copy">
              This panel writes directly to repo source files while the local Vite dev server is running. Static deployments can preview the interface, but save actions stay disabled there by design.
            </p>
          </div>

          <div class="admin-hero__meta">
            <div class="admin-hero__meta-card">
              <span class="eyebrow text-amethyst-200">Authoring mode</span>
              <strong>${status.canWrite ? 'Direct local writes' : 'Read-only preview'}</strong>
            </div>
            <div class="admin-hero__meta-card">
              <span class="eyebrow text-amethyst-200">Source of truth</span>
              <strong>Markdown + JS modules</strong>
            </div>
          </div>
        </article>

        ${
          status.canWrite
            ? ''
            : `
              <div class="admin-disabled-note">
                <strong>Local admin only.</strong>
                <span>This route only writes content while running the local Vite dev server.</span>
              </div>
            `
        }

        <div class="admin-tabs" role="tablist" aria-label="Admin content tabs">
          ${renderTabButton('blog', 'Blog', 'sparkles', activeTab === 'blog')}
          ${renderTabButton('project', 'Projects', 'workflow', activeTab === 'project')}
          ${renderTabButton('tool', 'Tech Stack', 'boxes', activeTab === 'tool')}
        </div>

        <div data-admin-panel-host class="mt-8"></div>
        <div data-admin-toast-root class="pointer-events-none fixed bottom-6 right-6 z-[80] flex w-full max-w-sm flex-col gap-3"></div>
      </div>
    </section>
  `
}
