import * as THREE from 'three'
import { createParticleSystem } from './particles.js'
import { getQualityTier } from './quality.js'
import { createWireframeObject } from './wireframe.js'

function disposeScene(renderer, scene) {
  scene.traverse((object) => {
    if (object.geometry) {
      object.geometry.dispose()
    }

    if (object.material) {
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      materials.forEach((material) => material.dispose())
    }
  })

  renderer.dispose()
}

export function initThreeScene(canvas) {
  const quality = getQualityTier()
  const scene = new THREE.Scene()
  const getCanvasBounds = () => {
    const bounds = canvas.getBoundingClientRect()

    return {
      width: Math.max(bounds.width, 1),
      height: Math.max(bounds.height, 1),
      left: bounds.left,
      top: bounds.top,
    }
  }

  const initialBounds = getCanvasBounds()
  const camera = new THREE.PerspectiveCamera(55, initialBounds.width / initialBounds.height, 0.1, 420)
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: quality.antialias,
    powerPreference: 'high-performance',
  })

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.pixelRatio))
  renderer.setSize(initialBounds.width, initialBounds.height, false)
  renderer.setClearColor(0x000000, 0)

  camera.position.z = quality.cameraZ
  scene.fog = new THREE.Fog(0x0f0518, 80, 330)

  const particles = createParticleSystem(THREE, quality)
  const wireframe = createWireframeObject(THREE)

  scene.add(particles)
  scene.add(wireframe)

  const pointer = {
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
  }

  let frameId = 0
  let running = true

  const resize = () => {
    const bounds = getCanvasBounds()

    camera.aspect = bounds.width / bounds.height
    camera.updateProjectionMatrix()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.pixelRatio))
    renderer.setSize(bounds.width, bounds.height, false)
  }

  const updatePointer = (event) => {
    const bounds = getCanvasBounds()
    const localX = (event.clientX - bounds.left) / bounds.width
    const localY = (event.clientY - bounds.top) / bounds.height
    const normalizedX = Math.min(Math.max(localX, 0), 1) * 2 - 1
    const normalizedY = Math.min(Math.max(localY, 0), 1) * 2 - 1

    pointer.targetX = normalizedX * quality.parallaxX
    pointer.targetY = normalizedY * quality.parallaxY
  }

  const render = () => {
    if (!running) {
      return
    }

    frameId = window.requestAnimationFrame(render)

    pointer.currentX += (pointer.targetX - pointer.currentX) * 0.045
    pointer.currentY += (pointer.targetY - pointer.currentY) * 0.045

    camera.position.x = pointer.currentX
    camera.position.y = -pointer.currentY
    camera.lookAt(0, 0, 0)

    particles.rotation.y += quality.particleDrift
    particles.rotation.x += quality.particleTilt

    wireframe.rotation.x += quality.meshRotX
    wireframe.rotation.y += quality.meshRotY
    wireframe.position.x = pointer.currentX * 0.4
    wireframe.position.y = -pointer.currentY * 0.25

    renderer.render(scene, camera)
  }

  const pause = () => {
    running = false
    window.cancelAnimationFrame(frameId)
  }

  const resume = () => {
    if (running) {
      return
    }

    running = true
    render()
  }

  const handleVisibility = () => {
    if (document.hidden) {
      pause()
    } else {
      resume()
    }
  }

  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', updatePointer, { passive: true })
  document.addEventListener('visibilitychange', handleVisibility)

  render()

  return () => {
    pause()
    window.removeEventListener('resize', resize)
    window.removeEventListener('pointermove', updatePointer)
    document.removeEventListener('visibilitychange', handleVisibility)
    disposeScene(renderer, scene)
  }
}
