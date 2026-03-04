export function createToastController(root) {
  return {
    show(message) {
      if (!root) {
        return
      }

      const toast = document.createElement('div')
      toast.className = 'toast-card translate-y-4 opacity-0 transition duration-300'
      toast.textContent = message
      root.appendChild(toast)

      requestAnimationFrame(() => {
        toast.classList.remove('translate-y-4', 'opacity-0')
      })

      window.setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0')
        window.setTimeout(() => toast.remove(), 320)
      }, 3200)
    },
  }
}
