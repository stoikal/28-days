import Head from 'next/head'
import { useState, useEffect, SyntheticEvent } from 'react'
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel'

export default function Day8 () {
  const [sharedCount, setSharedCount] = useState(0)
  const [count, setCount] = useState(0)
  const [sharedText, setSharedText] = useState('')

  const countChannelRef = useBroadcastChannel('count')
  const textChannelRef = useBroadcastChannel('text')

  useEffect(() => {
    if (!countChannelRef.current || !textChannelRef.current) return

    const countChannel = countChannelRef.current
    const textChannel = textChannelRef.current

    countChannel.onmessage = (e: MessageEvent<number>) => {
      setSharedCount(e.data)
    }

    textChannel.onmessage = (e: MessageEvent<string>) => {
      setSharedText(e.data)
    }

    return () => {
      countChannel.close()
      textChannel.close()
    }
  }, [countChannelRef, textChannelRef])

  useEffect(() => {
    if (countChannelRef.current === null) return
    const countChannel = countChannelRef.current

    countChannel.postMessage(sharedCount)
  }, [sharedCount, countChannelRef])

  useEffect(() => {
    if (textChannelRef.current === null) return
    const textChannel = textChannelRef.current

    textChannel.postMessage(sharedText)
  }, [sharedText, textChannelRef])

  const sharedDecrement = () => setSharedCount(prev => prev - 1)
  const sharedIncrement = () => setSharedCount(prev => prev + 1)

  const decrement = () => setCount(prev => prev - 1)
  const increment = () => setCount(prev => prev + 1)

  const changeText = (e: SyntheticEvent<HTMLTextAreaElement>) => {
    const eventTarget = e.target as HTMLTextAreaElement

    setSharedText(eventTarget.value)
  }

  return (
    <>
      <Head>
        <title>Day 8 - BroadcastChannel</title>
      </Head>
      <main>
        <div className="bg-yellow-400 mb-10">
          <div className="max-w-lg mx-auto px-6 md:px-10 pb-1">
            <small>States are shared accross tabs using BroadcastChannel API</small>
          </div>
        </div>
        <div
          className="max-w-lg mx-auto px-6 md:px-10"
        >
          <div>
            <h2>shared</h2>
            <div
              className="flex items-center justify-between mb-7"
            >
              <button
                className='border px-4 rounded text-xl active:bg-cyan-100'
                onClick={sharedDecrement}
              >
                -
              </button>
              <span
                className="text-6xl font-bold"
              >
                {sharedCount}
              </span>
              <button
                className='border px-4 rounded text-xl active:bg-cyan-100'
                onClick={sharedIncrement}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <h2>private</h2>
            <div
              className="flex items-center justify-between mb-7"
            >
              <button
                className='border px-4 rounded text-xl active:bg-cyan-100'
                onClick={decrement}
              >
                -
              </button>
              <span
                className="text-6xl font-bold"
              >
                {count}
              </span>
              <button
                className='border px-4 rounded text-xl active:bg-cyan-100'
                onClick={increment}
              >
                +
              </button>
            </div>
          </div>

          <div>
            <h2 className="mb-1">shared</h2>
            <textarea
              value={sharedText}
              className="border w-full py-2 px-3"
              onChange={changeText}
            />
          </div>
        </div>
      </main>
    </>
  )
}
