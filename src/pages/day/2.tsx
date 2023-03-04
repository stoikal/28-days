import Head from 'next/head'
import { useEffect, useState } from 'react'
import Canvas from '@/components/Canvas'

export default function Day2 () {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let id: number

    const animate = () => {
      id = requestAnimationFrame(animate)
      setTick(prev => prev + 1)
    }

    animate()

    return () => {
      cancelAnimationFrame(id)
    }
  }, [])

  return (
    <>
     <Head>
        <title>Day 2 - Spaceship pew pew</title>
      </Head>
      <main
        style={{
          height: '100vh',
          background: 'black',
          display: 'grid',
          placeItems: 'center'
        }}
      >
        <Canvas tick={tick} />
      </main>
    </>
  )
}
