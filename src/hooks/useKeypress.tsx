import { useEffect } from 'react'
/**
 * useKeyPress
 * @param {string} key - the name of the key to respond to, compared against event.key
 * @param {function} action - the action to perform on key press
 */
export function useKeypress (key: string, action: () => any) {
  useEffect(() => {
    function onKeyEvent (e: KeyboardEvent) {
      if (e.key.toLowerCase() === key) action()
    }
    window.addEventListener('keydown', onKeyEvent)
    return () => window.removeEventListener('keydown', onKeyEvent)
  }, [key, action])
}
