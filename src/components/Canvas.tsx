import { useKeys } from '@/hooks/useKeys'
import { useSpaceShip } from '@/hooks/useSpaceShip'
import { useEffect, useRef, useState } from 'react'

type Props = {
  tick: number
}

type Bullet = [number, number]
type Enemy = {
  angle: number
  radius: number
  hit: boolean
}

export default function Canvas ({ tick }: Props) {
  const [bullets, setBullets] = useState<Bullet[]>([])
  const [enemies, setEnemies] = useState<Enemy[]>([])

  const canvasRef = useRef(null)

  const { keys } = useKeys()
  const ship = useSpaceShip()

  const updateShip = () => {
    if (
      (keys.left.pressed && ship.angle < 180) ||
      (keys.right.pressed && ship.angle >= 180) ||
      (keys.up.pressed && ship.angle >= 90 && ship.angle < 270) ||
      (keys.down.pressed && (ship.angle < 90 || ship.angle >= 270))
    ) {
      // move clockwise
      ship.addAngle()
    } else if (
      (keys.left.pressed && ship.angle !== 180) ||
      (keys.right.pressed && ship.angle !== 0) ||
      (keys.up.pressed && ship.angle !== 270) ||
      (keys.down.pressed && ship.angle !== 90)
    ) {
      // move counterclockwise
      ship.substractAngle()
    }
  }

  const [isFired, setIsFired] = useState(false)
  const updateBullets = () => {
    const fire = keys.space.pressed && keys.space.toggled && !isFired

    if (!keys.space.pressed && keys.space.toggled) {
      setIsFired(false)
    }

    setBullets((prev) => {
      const next = prev
        .map(([angle, distance]) => [angle, distance - 0.01])
        .filter(([angle, distance]) => {
          if (canvasRef.current === null) return false

          const canvas = canvasRef.current as HTMLCanvasElement
          const cx = canvas.width / 2
          const cy = canvas.height / 2
          const radius = 0.8 * (canvas.width / 2)

          const bulletX = cx + (radius * distance) * Math.cos(angle * Math.PI / 180)
          const bulletY = cy + (radius * distance) * Math.sin(angle * Math.PI / 180)

          return distance > 0 && enemies.every((enemy) => {
            const enemyCX = cx + enemy.radius * Math.cos(enemy.angle * Math.PI / 180)
            const enemyCY = cy + enemy.radius * Math.sin(enemy.angle * Math.PI / 180)

            const o = Math.abs(bulletX - enemyCX)
            const a = Math.abs(bulletY - enemyCY)
            const h = Math.sqrt(Math.pow(a, 2) + Math.pow(o, 2))

            const isColliding = h < 5 - 1

            return !isColliding
          })
        })

      if (fire) {
        setIsFired(true)
        next.push([ship.angle, 1])
      }

      return next as Bullet[]
    })
  }

  const [lastEnemySpawn, setLastEnemySpawn] = useState(0)
  const [, setHitCount] = useState(0)

  const updateEnemies = () => {
    setEnemies((prev) => {
      const next = prev
        .filter((enemy) => {
          return !enemy.hit && enemy.radius < 1000
        })
        .map((enemy) => ({
          ...enemy,
          radius: enemy.radius + 0.1,
          hit: (() => {
            if (enemy.hit) return true
            if (canvasRef.current === null) return false
            const canvas = canvasRef.current as HTMLCanvasElement
            const cx = canvas.width / 2
            const cy = canvas.height / 2
            const radius = 0.8 * (canvas.width / 2)

            const enemyCX = cx + enemy.radius * Math.cos(enemy.angle * Math.PI / 180)
            const enemyCY = cy + enemy.radius * Math.sin(enemy.angle * Math.PI / 180)

            return bullets.some(([angle, distance], index) => {
              const bulletX = cx + (radius * distance) * Math.cos(angle * Math.PI / 180)
              const bulletY = cy + (radius * distance) * Math.sin(angle * Math.PI / 180)

              const o = Math.abs(bulletX - enemyCX)
              const a = Math.abs(bulletY - enemyCY)
              const h = Math.sqrt(Math.pow(a, 2) + Math.pow(o, 2))

              const isColliding = h <= 5

              if (isColliding) {
                setHitCount(prev => prev + 1)
              }
              return isColliding
            })
          })()
        }))

      if (tick - lastEnemySpawn > 200 || lastEnemySpawn === 0) {
        setLastEnemySpawn(tick)
        next.push({
          angle: Math.random() * (359 - 0) + 0,
          radius: 5,
          hit: false
        })
      }

      return next as Enemy[]
    })
  }

  const draw = () => {
    if (canvasRef.current === null) return

    updateShip()
    updateEnemies()
    updateBullets()

    const canvas = canvasRef.current as HTMLCanvasElement
    const c = canvas.getContext('2d') as CanvasRenderingContext2D

    canvas.height = canvas.width

    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const radius = 0.8 * (canvas.width / 2)

    const r = radius

    const foot = Math.sqrt(Math.pow(r + ship.height, 2) + Math.pow(ship.base / 2, 2))
    const rad2 = Math.atan(ship.base / 2 / (r + ship.height))

    const angle = (rad2 * 180 / Math.PI) + ship.angle
    const angle3 = ship.angle - (rad2 * 180 / Math.PI)

    const x1 = cx + r * Math.cos(ship.angle * Math.PI / 180)
    const y1 = cy + r * Math.sin(ship.angle * Math.PI / 180)
    const x2 = cx + foot * Math.cos(angle * Math.PI / 180)
    const y2 = cy + foot * Math.sin(angle * Math.PI / 180)
    const x3 = cx + foot * Math.cos(angle3 * Math.PI / 180)
    const y3 = cy + foot * Math.sin(angle3 * Math.PI / 180)

    c.beginPath()
    c.moveTo(x1, y1)
    c.lineTo(x2, y2)
    c.lineTo(x3, y3)
    c.lineTo(x1, y1)
    c.strokeStyle = 'white'
    c.stroke()

    // bullets
    bullets.forEach(([angle, distance]) => {
      c.beginPath()
      c.moveTo(
        cx + (r * distance) * Math.cos(angle * Math.PI / 180),
        cy + (r * distance) * Math.sin(angle * Math.PI / 180)
      )
      c.lineTo(
        cx + (r * distance + 5) * Math.cos(angle * Math.PI / 180),
        cy + (r * distance + 5) * Math.sin(angle * Math.PI / 180)
      )
      c.strokeStyle = 'red'
      c.stroke()
    })

    enemies.forEach((enemy) => {
      c.beginPath()
      c.strokeStyle = 'white'
      if (enemy.hit) c.strokeStyle = 'red'
      c.arc(
        cx + enemy.radius * Math.cos(enemy.angle * Math.PI / 180),
        cy + enemy.radius * Math.sin(enemy.angle * Math.PI / 180),
        5,
        0,
        2 * Math.PI
      )
      c.stroke()
    })
  }

  useEffect(() => {
    draw()
  }, [tick])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          maxWidth: '100vh'
        }}
      />
    </>
  )
}
