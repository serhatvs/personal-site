const API_ROOT = '/__admin-api'

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_ROOT}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed with status ${response.status}.`)
  }

  return payload
}

export function getAdminStatus() {
  return request('/status')
}

export function getAdminSummary() {
  return request('/summary')
}

export function createBlogEntry(payload) {
  return request('/blog', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function createProjectEntry(payload) {
  return request('/project', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function createToolEntry(payload) {
  return request('/tool', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
