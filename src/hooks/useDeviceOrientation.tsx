import { useState, useEffect } from 'react'

export function useDeviceOrientation () {
  const [alpha, setAlpha] = useState<number | null>(null)
  const [beta, setBeta] = useState<number | null>(null)
  const [gamma, setGamma] = useState<number | null>(null)

  useEffect(() => {
    function handleOrientation (event: DeviceOrientationEvent) {
      setAlpha(event.alpha)
      setBeta(event.beta)
      setGamma(event.gamma)
    }

    window.addEventListener('deviceorientation', handleOrientation, true)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  return {
    alpha,
    beta,
    gamma
  }
}
