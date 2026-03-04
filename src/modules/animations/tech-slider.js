const CARD_TRAVEL_X_PERCENT = 268
const CARD_INACTIVE_SCALE = 0.87
const CARD_INACTIVE_OPACITY = 0.32

function buildCardAnimation(card, gsap) {
  const timeline = gsap.timeline()

  timeline
    .fromTo(
      card,
      {
        scale: CARD_INACTIVE_SCALE,
        opacity: CARD_INACTIVE_OPACITY,
        zIndex: 1,
      },
      {
        scale: 1,
        opacity: 1,
        zIndex: 10,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
        immediateRender: false,
      },
    )
    .fromTo(
      card,
      { xPercent: CARD_TRAVEL_X_PERCENT },
      {
        xPercent: -CARD_TRAVEL_X_PERCENT,
        duration: 1,
        ease: 'none',
        immediateRender: false,
      },
      0,
    )

  return timeline
}

function buildSeamlessLoop(items, spacing, gsap) {
  const overlap = Math.ceil(1 / spacing)
  const startTime = items.length * spacing + 0.5
  const loopTime = (items.length + overlap) * spacing + 1
  const rawSequence = gsap.timeline({ paused: true })
  const seamlessLoop = gsap.timeline({
    paused: true,
    repeat: -1,
    onRepeat() {
      if (this._time === this._dur) {
        this._tTime += this._dur - 0.01
      }
    },
    onReverseComplete() {
      this.totalTime(this.rawTime() + this.duration() * 100)
    },
  })

  for (let index = 0; index < items.length + overlap * 2; index += 1) {
    const time = index * spacing
    const item = items[index % items.length]
    rawSequence.add(buildCardAnimation(item, gsap), time)
  }

  rawSequence.time(startTime)
  seamlessLoop
    .to(rawSequence, {
      time: loopTime,
      duration: loopTime - startTime,
      ease: 'none',
    })
    .fromTo(
      rawSequence,
      { time: overlap * spacing + 1 },
      {
        time: startTime,
        duration: startTime - (overlap * spacing + 1),
        immediateRender: false,
        ease: 'none',
      },
    )

  return seamlessLoop
}

export function initTechSlider({ gsap, Draggable }) {
  const shell = document.querySelector('.tech-gallery-shell')
  const gallery = shell?.querySelector('[data-tech-gallery]')

  if (!gallery || gallery.dataset.techSliderReady === 'true') {
    return
  }

  const cards = gsap.utils.toArray('[data-tech-card]', gallery)
  const autoplayToggle = shell.querySelector('[data-tech-autoplay-toggle]')
  const previousButton = shell.querySelector('[data-tech-prev]')
  const nextButton = shell.querySelector('[data-tech-next]')
  const dragProxy = shell.querySelector('[data-tech-drag-proxy]')

  if (!autoplayToggle || !previousButton || !nextButton || !dragProxy || cards.length < 2) {
    return
  }

  gallery.dataset.techSliderReady = 'true'
  gallery.classList.add('is-enhanced')

  gsap.set(cards, {
    xPercent: CARD_TRAVEL_X_PERCENT,
    opacity: CARD_INACTIVE_OPACITY,
    scale: CARD_INACTIVE_SCALE,
    zIndex: 1,
  })

  const spacing = 0.195
  const snap = gsap.utils.snap(spacing)
  const seamlessLoop = buildSeamlessLoop(cards, spacing, gsap)
  const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration())
  const playhead = { offset: 0 }
  const autoplayUnitsPerSecond = spacing * 0.2
  let dragStartOffset = 0
  let interactionPaused = false
  let autoplayEnabled = true
  let offsetTween

  const render = () => {
    seamlessLoop.totalTime(wrapTime(playhead.offset))
  }

  const syncAutoplayToggle = () => {
    autoplayToggle.textContent = autoplayEnabled ? 'Pause Auto' : 'Resume Auto'
    autoplayToggle.setAttribute('aria-pressed', String(!autoplayEnabled))
    autoplayToggle.setAttribute(
      'aria-label',
      autoplayEnabled ? 'Pause automatic slider rotation' : 'Resume automatic slider rotation',
    )
  }

  const resumeInteraction = () => {
    interactionPaused = false
  }

  const pauseInteraction = () => {
    interactionPaused = true
  }

  const tweenToOffset = (targetOffset) => {
    pauseInteraction()
    offsetTween?.kill()

    offsetTween = gsap.to(playhead, {
      offset: snap(targetOffset),
      duration: 0.45,
      ease: 'power3.out',
      overwrite: true,
      onUpdate: render,
      onComplete: () => {
        offsetTween = undefined
        resumeInteraction()
      },
      onInterrupt: () => {
        offsetTween = undefined
      },
    })
  }

  const ticker = (_, deltaMs = 16.67) => {
    if (interactionPaused || !autoplayEnabled) {
      return
    }

    playhead.offset += autoplayUnitsPerSecond * deltaMs / 1000
    render()
  }

  previousButton.addEventListener('click', () => {
    tweenToOffset(playhead.offset - spacing)
  })

  nextButton.addEventListener('click', () => {
    tweenToOffset(playhead.offset + spacing)
  })

  autoplayToggle.addEventListener('click', () => {
    autoplayEnabled = !autoplayEnabled
    syncAutoplayToggle()
  })

  Draggable.create(dragProxy, {
    type: 'x',
    trigger: gallery,
    dragClickables: false,
    onPress() {
      pauseInteraction()
      offsetTween?.kill()
      offsetTween = undefined
      dragStartOffset = playhead.offset
      gallery.classList.add('is-dragging')
      gsap.set(dragProxy, { x: 0 })
    },
    onDrag() {
      const pixelsPerStep = Math.max(gallery.clientWidth * 0.285, 1)
      playhead.offset = dragStartOffset - (this.x / pixelsPerStep) * spacing
      render()
    },
    onRelease() {
      gallery.classList.remove('is-dragging')
      gsap.set(dragProxy, { x: 0 })
      tweenToOffset(playhead.offset)
    },
  })

  syncAutoplayToggle()
  render()
  gsap.ticker.add(ticker)
}
