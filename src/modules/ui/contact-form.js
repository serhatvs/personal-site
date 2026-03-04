const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_MESSAGE_LENGTH = 10
const RESUBMIT_WINDOW_MS = 60_000
const SESSION_KEY = 'lunerya-last-submit'

function setStatus(element, message, tone = 'info') {
  if (!element) {
    return
  }

  element.textContent = message
  element.classList.remove('text-amethyst-100', 'text-emerald-200', 'text-rose-200')

  if (tone === 'success') {
    element.classList.add('text-emerald-200')
    return
  }

  if (tone === 'error') {
    element.classList.add('text-rose-200')
    return
  }

  element.classList.add('text-amethyst-100')
}

function buildMailto(email, values) {
  const subject = encodeURIComponent(`Portfolio inquiry from ${values.name || 'Unknown sender'}`)
  const body = encodeURIComponent(`${values.message}\n\nFrom: ${values.name || 'Unknown'}\nEmail: ${values.email}`)
  return `mailto:${email}?subject=${subject}&body=${body}`
}

function getValues(form) {
  const formData = new FormData(form)
  return {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    message: String(formData.get('message') || '').trim(),
    honeypot: String(formData.get('company') || '').trim(),
  }
}

function validate(values) {
  if (!EMAIL_PATTERN.test(values.email)) {
    return 'Enter a valid email address.'
  }

  if (values.message.length < MIN_MESSAGE_LENGTH) {
    return `Message should be at least ${MIN_MESSAGE_LENGTH} characters.`
  }

  return ''
}

function canSubmitAgain() {
  const lastSubmit = Number(window.sessionStorage.getItem(SESSION_KEY) || '0')
  return Date.now() - lastSubmit > RESUBMIT_WINDOW_MS
}

function markSubmitted() {
  window.sessionStorage.setItem(SESSION_KEY, String(Date.now()))
}

export function initContactForm({ form, statusElement, submitButton, endpoint, fallbackEmail, toast }) {
  if (!form || !submitButton) {
    return
  }

  const idleLabel = submitButton.innerHTML

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const values = getValues(form)

    if (values.honeypot) {
      return
    }

    const validationError = validate(values)

    if (validationError) {
      setStatus(statusElement, validationError, 'error')
      toast.show(validationError)
      return
    }

    if (!canSubmitAgain()) {
      const rateLimitedMessage = 'Please wait a minute before sending another transmission.'
      setStatus(statusElement, rateLimitedMessage, 'error')
      toast.show(rateLimitedMessage)
      return
    }

    submitButton.disabled = true
    submitButton.innerHTML = 'Transmitting...'
    setStatus(statusElement, 'Routing signal...', 'info')

    try {
      if (!endpoint) {
        window.location.href = buildMailto(fallbackEmail, values)
        markSubmitted()
        form.reset()
        setStatus(statusElement, 'Email client opened. If nothing happened, use the direct email link.', 'success')
        toast.show('Transmission redirected to your email client.')
        return
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
        }),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      markSubmitted()
      form.reset()
      setStatus(statusElement, 'Transmission sent. Expect a reply within 2 to 4 business days.', 'success')
      toast.show('Transmission sent successfully.')
    } catch {
      const fallbackMessage = 'Transmission failed. Use the direct email link instead.'
      setStatus(statusElement, fallbackMessage, 'error')
      toast.show(fallbackMessage)
    } finally {
      submitButton.disabled = false
      submitButton.innerHTML = idleLabel
    }
  })
}
