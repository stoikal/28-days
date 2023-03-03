import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Day3 () {
  const [emoji, setEmoji] = useState('😀')
  const [message, setMessage] = useState('Hello!')

  useEffect(() => {
    let timeoutId: number

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setEmoji('😢')
        setMessage('I missed you!')
        timeoutId = window.setTimeout(() => {
          setEmoji('🥰')
          setMessage("Glad you're back!")
        }, 2000)
      } else {
        clearTimeout(timeoutId)
      }
    }

    addEventListener('visibilitychange', handleVisibility)

    return () => {
      removeEventListener('visibilitychange', handleVisibility)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Day 3 - Overly attached page</title>
      </Head>

      <main
        className="text-center flex flex-col h-full justify-center"
      >
        <div
          className="flex-grow flex flex-col justify-center"
        >
          <p className="text-7xl mb-4">{emoji}</p>
          <h1 className="text-3xl">{message}</h1>
        </div>
        <small
          className="flex-grow-0 mb-4"
        >
          try switching to another tab
        </small>
      </main>
    </>
  )
}
