import { useEffect, useState } from 'react'

export default function useFrame () {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    let id: number

    const animate = () => {
      id = requestAnimationFrame(animate)
      setFrame(prev => prev + 1)
    }

    animate()

    return () => {
      cancelAnimationFrame(id)
    }
  }, [])

  return frame
}
