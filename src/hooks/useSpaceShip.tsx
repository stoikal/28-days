import { useState } from 'react'

export const useSpaceShip = () => {
  // angle from center; 0 is 3 o'clock
  const [angle, setAngle] = useState(90)

  const speed = 1

  const addAngle = () => {
    setAngle((prev) => {
      const delta = 360 - prev
      if (delta <= speed) {
        return 0 + speed - delta
      } else {
        return prev + speed
      }
    })
  }

  const subtractAngle = () => {
    setAngle((prev) => {
      if (prev - speed < 0) {
        return prev + 360 - speed
      } else {
        return prev - speed
      }
    })
  }

  return {
    angle,
    height: 10,
    base: 10,
    addAngle,
    subtractAngle
  }
}
