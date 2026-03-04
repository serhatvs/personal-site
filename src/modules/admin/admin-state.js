export function createAdminState({ fallbackSummary }) {
  const state = {
    activeTab: 'blog',
    status: {
      mode: 'static',
      canWrite: false,
    },
    summary: fallbackSummary,
    results: {
      blog: null,
      project: null,
      tool: null,
    },
  }

  return {
    get() {
      return state
    },
    setStatus(nextStatus) {
      state.status = nextStatus
    },
    setSummary(nextSummary) {
      state.summary = nextSummary
    },
    setActiveTab(tab) {
      state.activeTab = tab
    },
    setResult(tab, result) {
      state.results[tab] = result
    },
  }
}
