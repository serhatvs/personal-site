export function createParticleSystem(THREE, quality) {
  const positions = new Float32Array(quality.particleCount * 3)
  const colors = new Float32Array(quality.particleCount * 3)

  const amethyst = new THREE.Color('#C59DD9')
  const topaz = new THREE.Color('#E6A520')

  for (let index = 0; index < quality.particleCount; index += 1) {
    const stride = index * 3
    const radius = 150 + Math.random() * 70
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const blend = Math.random()
    const color = new THREE.Color().lerpColors(amethyst, topaz, blend)

    positions[stride] = radius * Math.sin(phi) * Math.cos(theta)
    positions[stride + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[stride + 2] = radius * Math.cos(phi)

    colors[stride] = color.r
    colors[stride + 1] = color.g
    colors[stride + 2] = color.b
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: quality.pointSize,
    vertexColors: true,
    transparent: true,
    opacity: 0.58,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  return new THREE.Points(geometry, material)
}
