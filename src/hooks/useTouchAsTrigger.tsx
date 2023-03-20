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

export function useTouchAsTrigger () {
  // floating number from to 1
  const [amount, setAmount] = useState(0)
  const [isTouched, setIsTouched] = useState(false)

  useEffect(() => {
    const handleTouch = () => {
      setIsTouched(true)
    }

    const handleRelease = () => {
      setIsTouched(false)
    }

    document.addEventListener('touchstart', handleTouch)
    document.addEventListener('touchend', handleRelease)

    document.addEventListener('mousedown', handleTouch)
    document.addEventListener('mouseup', handleRelease)

    return () => {
      document.removeEventListener('touchstart', handleTouch)
      document.removeEventListener('touchend', handleRelease)

      document.removeEventListener('mousedown', handleTouch)
      document.removeEventListener('mouseup', handleRelease)
    }
  }, [])

  useEffect(() => {
    let id: any

    function updateGamepadState () {
      if (isTouched) {
        setAmount(prev => Math.min(1, prev + 0.2))
      } else {
        setAmount(prev => Math.max(0, prev - 0.2))
      }

      id = requestAnimationFrame(updateGamepadState)
    }

    updateGamepadState()

    return () => {
      cancelAnimationFrame(id)
    }
  }, [isTouched])

  return { amount }
}
