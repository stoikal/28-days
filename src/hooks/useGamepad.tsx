import { useEffect, useState } from 'react'

// type GamepadButton = {
//   pressed: boolean
//   touched: boolean
//   value: number
// }

/*
*  xbox
*  [a, b, x, y, lb, rb, lt, rt]
*/

export function useGamepad () {
  const [axes, setAxes] = useState<number[]>([])
  const [triggers, setTriggers] = useState<number[]>([])

  useEffect(() => {
    let id: any

    function updateGamepadState () {
      const gamepads = navigator.getGamepads()

      const primaryGamepad = gamepads[0]

      if (primaryGamepad && primaryGamepad.axes) {
        setAxes([...primaryGamepad.axes])
      } else {
        setAxes([])
      }

      if (
        primaryGamepad &&
        primaryGamepad.buttons &&
        primaryGamepad.buttons[6] &&
        primaryGamepad.buttons[7]
      ) {
        const lt = primaryGamepad.buttons[6]
        const rt = primaryGamepad.buttons[7]
        setTriggers([lt.value, rt.value])
      } else {
        setTriggers([])
      }

      id = requestAnimationFrame(updateGamepadState)
    }

    updateGamepadState()

    return () => {
      cancelAnimationFrame(id)
    }
  }, [])

  return { axes, triggers }
}
