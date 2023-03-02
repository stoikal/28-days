import { useState } from 'react'

export const useSpaceShip = () => {
  const [revolution, setRevolution] = useState(90)

  const speed = 1

  const addRevolution = () => {
    setRevolution((prev) => {
      const delta = 360 - prev
      if (delta <= speed) {
        return 0 + speed - delta
      } else {
        return prev + speed
      }
    })
  }

  const subRevolution = () => {
    setRevolution((prev) => {
      if (prev - speed < 0) {
        return prev + 360 - speed
      } else {
        return prev - speed
      }
    })
  }

  return {
    revolution,
    height: 10,
    base: 10,
    addRevolution,
    subRevolution
  }
}
