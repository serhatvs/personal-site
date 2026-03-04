function buildCardAnimation(card, gsap) {
  const timeline = gsap.timeline()

  timeline
    .fromTo(
      card,
      {
        scale: 0.82,
        opacity: 0.28,
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
      { xPercent: 240 },
      {
        xPercent: -240,
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
  const gallery = document.querySelector('[data-tech-gallery]')

  if (!gallery || gallery.dataset.techSliderReady === 'true') {
    return
  }

  const cards = gsap.utils.toArray('[data-tech-card]', gallery)
  const previousButton = gallery.querySelector('[data-tech-prev]')
  const nextButton = gallery.querySelector('[data-tech-next]')
  const dragProxy = document.querySelector('[data-tech-drag-proxy]')

  if (!previousButton || !nextButton || !dragProxy || cards.length < 2) {
    return
  }

  gallery.dataset.techSliderReady = 'true'
  gallery.classList.add('is-enhanced')

  gsap.set(cards, {
    xPercent: 240,
    opacity: 0.28,
    scale: 0.82,
    zIndex: 1,
  })

  const spacing = 0.12
  const snap = gsap.utils.snap(spacing)
  const seamlessLoop = buildSeamlessLoop(cards, spacing, gsap)
  const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration())
  const playhead = { offset: 0 }
  const autoplayUnitsPerSecond = spacing * 0.85
  let dragStartOffset = 0
  let paused = false
  let offsetTween

  const render = () => {
    seamlessLoop.totalTime(wrapTime(playhead.offset))
  }

  const resume = () => {
    paused = false
  }

  const pause = () => {
    paused = true
  }

  const tweenToOffset = (targetOffset) => {
    pause()
    offsetTween?.kill()

    offsetTween = gsap.to(playhead, {
      offset: snap(targetOffset),
      duration: 0.45,
      ease: 'power3.out',
      overwrite: true,
      onUpdate: render,
      onComplete: () => {
        offsetTween = undefined
        resume()
      },
      onInterrupt: () => {
        offsetTween = undefined
      },
    })
  }

  const ticker = (_, deltaMs = 16.67) => {
    if (paused) {
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

  Draggable.create(dragProxy, {
    type: 'x',
    trigger: gallery,
    dragClickables: false,
    onPress() {
      pause()
      offsetTween?.kill()
      offsetTween = undefined
      dragStartOffset = playhead.offset
      gallery.classList.add('is-dragging')
      gsap.set(dragProxy, { x: 0 })
    },
    onDrag() {
      const pixelsPerStep = Math.max(gallery.clientWidth * 0.22, 1)
      playhead.offset = dragStartOffset - (this.x / pixelsPerStep) * spacing
      render()
    },
    onRelease() {
      gallery.classList.remove('is-dragging')
      gsap.set(dragProxy, { x: 0 })
      tweenToOffset(playhead.offset)
    },
  })

  render()
  gsap.ticker.add(ticker)
}
