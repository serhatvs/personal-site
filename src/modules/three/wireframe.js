export function createWireframeObject(THREE) {
  const group = new THREE.Group()

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(26, 1),
    new THREE.MeshBasicMaterial({
      color: '#C59DD9',
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    }),
  )

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(38, 0.22, 12, 120),
    new THREE.MeshBasicMaterial({
      color: '#E6A520',
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    }),
  )

  ring.rotation.x = Math.PI / 2.5
  ring.rotation.y = Math.PI / 5

  group.add(core, ring)
  return group
}
