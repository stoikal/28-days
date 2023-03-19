import { useEffect, useState } from 'react'

export function useGamepad () {
  const [axes, setAxes] = useState<number[]>([])

  useEffect(() => {
    let id: any

    function updateGamepadState () {
      const gamepads = navigator.getGamepads()

      const primaryGamepad = gamepads[0]

      if (primaryGamepad) {
        setAxes([...primaryGamepad.axes])
      } else {
        setAxes([])
      }

      id = requestAnimationFrame(updateGamepadState)
    }
    // [lx, ly, lt, rx, ry, rt]
    updateGamepadState()

    return () => {
      cancelAnimationFrame(id)
    }
  }, [])

  return { axes }
}
