import { useEffect, useState, useCallback } from 'react'

type Key = 'left' | 'right' | 'up' | 'down' | 'space'

export const useKeys = () => {
  const [keys, setKeys] = useState({
    left: { pressed: false, toggled: null },
    right: { pressed: false, toggled: null },
    up: { pressed: false, toggled: null },
    down: { pressed: false, toggled: null },
    space: { pressed: false, toggled: null }
  })

  const setKeyPressed = useCallback((key: Key, isPressed = true) => {
    setKeys((prev) => {
      return {
        ...prev,
        [key]: {
          ...prev[key],
          pressed: isPressed,
          toggled: isPressed !== prev[key].pressed
        }
      }
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          setKeyPressed('left')
          break
        case 'ArrowRight':
        case 'KeyD':
          setKeyPressed('right')
          break
        case 'ArrowUp':
        case 'KeyW':
          setKeyPressed('up')
          break
        case 'ArrowDown':
        case 'KeyS':
          setKeyPressed('down')
          break
        case 'Space':
          setKeyPressed('space')
          break
      }
    }

    const handleKeyUp = (e: any) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          setKeyPressed('left', false)
          break
        case 'ArrowRight':
        case 'KeyD':
          setKeyPressed('right', false)
          break
        case 'ArrowUp':
        case 'KeyW':
          setKeyPressed('up', false)
          break
        case 'ArrowDown':
        case 'KeyS':
          setKeyPressed('down', false)
          break
        case 'Space':
          setKeyPressed('space', false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [setKeyPressed])

  return {
    keys
  }
}
