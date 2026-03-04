export function getQualityTier() {
  const width = window.innerWidth
  const deviceMemory = navigator.deviceMemory || 4
  const hardwareConcurrency = navigator.hardwareConcurrency || 4

  if (width < 640 || deviceMemory <= 4 || hardwareConcurrency <= 4) {
    return {
      particleCount: 650,
      pointSize: 1.6,
      pixelRatio: 1.1,
      cameraZ: 132,
      parallaxX: 14,
      parallaxY: 9,
      particleDrift: 0.00028,
      particleTilt: 0.00008,
      meshRotX: 0.0014,
      meshRotY: 0.0018,
      antialias: false,
    }
  }

  if (width < 1024) {
    return {
      particleCount: 1200,
      pointSize: 1.45,
      pixelRatio: 1.3,
      cameraZ: 126,
      parallaxX: 17,
      parallaxY: 10,
      particleDrift: 0.00034,
      particleTilt: 0.0001,
      meshRotX: 0.0011,
      meshRotY: 0.0015,
      antialias: true,
    }
  }

  return {
    particleCount: 2400,
    pointSize: 1.25,
    pixelRatio: 1.5,
    cameraZ: 118,
    parallaxX: 20,
    parallaxY: 12,
    particleDrift: 0.00042,
    particleTilt: 0.00012,
    meshRotX: 0.0009,
    meshRotY: 0.00125,
    antialias: true,
  }
}
