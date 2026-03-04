export function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

export function attachAutoSlug(form, sourceFieldName) {
  const sourceInput = form.elements[sourceFieldName]
  const slugInput = form.elements.slug

  if (!sourceInput || !slugInput) {
    return
  }

  const syncSlug = () => {
    if (slugInput.dataset.slugTouched === 'true') {
      return
    }

    slugInput.value = slugify(sourceInput.value)
    slugInput.dispatchEvent(new Event('input', { bubbles: true }))
  }

  slugInput.addEventListener('input', () => {
    const autoValue = slugify(sourceInput.value)
    slugInput.dataset.slugTouched = String(Boolean(slugInput.value.trim()) && slugInput.value.trim() !== autoValue)
  })

  sourceInput.addEventListener('input', syncSlug)

  if (!slugInput.value.trim()) {
    syncSlug()
  }
}
