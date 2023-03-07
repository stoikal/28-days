import Head from 'next/head'
import { useCallback, useEffect, useRef, useState, WheelEvent } from 'react'
import * as THREE from 'three'
import { useEventListener } from '@/hooks/useEventListener'

export default function Day7 () {
  const [cube, setCube] = useState<THREE.Mesh | null>(null)
  const [isPressed, setIsPressed] = useState(false)

  const sceneContainerRef = useRef<HTMLDivElement | null>(null)

  const init = useCallback(() => {
    if (sceneContainerRef.current === null) return
    const container = sceneContainerRef.current

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 1, 1000)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(600, 600)
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0x222244))

    const light = new THREE.DirectionalLight()
    light.position.set(0.5, 0.5, 1)
    light.castShadow = true
    light.shadow.camera.zoom = 4 // tighter shadow map
    scene.add(light)

    const geometryBackground = new THREE.PlaneGeometry(100, 100)
    const materialBackground = new THREE.MeshBasicMaterial({ color: 0xffffff })

    const background = new THREE.Mesh(geometryBackground, materialBackground)
    background.position.set(0, 0, -1)
    scene.add(background)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const materialCylinder = new THREE.MeshPhongMaterial({ color: 0x008888 })

    const cube = new THREE.Mesh(geometry, materialCylinder)
    cube.castShadow = true
    cube.receiveShadow = true

    // cube.rotation.x = 90 / 180 * Math.PI
    cube.rotation.z = -45 / 180 * Math.PI
    cube.rotation.x = 45 / 180 * Math.PI

    scene.add(cube)

    camera.position.y = 90 / 180 / Math.PI
    camera.position.z = 5

    renderer.render(scene, camera)

    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }

    animate()

    return {
      cube
    }
  }, [])

  // somehow useEffect is fired twice on local dev server
  // but once on real server
  useEffect(() => {
    const res = init()

    if (res) setCube(res.cube)
  }, [init])

  const handleWheel = (ev: WheelEvent<HTMLDivElement>) => {
    if (cube) {
      const degree = 5

      if (isPressed) {
        cube.rotateY(Math.sign(ev.deltaY) * -1 * degree / 180 * Math.PI)
      } else {
        cube.rotateX(Math.sign(ev.deltaY) * degree / 180 * Math.PI)
      }
    }
  }

  useEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setIsPressed(true)
    }
  })

  useEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setIsPressed(false)
    }
  })

  return (
    <>
      <Head>
        <title>Day 7 - Wheel Event</title>
      </Head>

      <main
        className="bg-[#ffffff] h-full"
        onWheel={handleWheel}
      >
        <div
          className="container h-full mx-auto flex items-center justify-center"
        >
          <div
            ref={sceneContainerRef}
          />
        </div>
      </main>
    </>
  )
}
