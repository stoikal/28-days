import Head from 'next/head'
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation'

export default function Day18 () {
  const { gamma, beta } = useDeviceOrientation()

  const clamp = (num: number, min: number, max: number) => {
    if (num < min) return min
    if (num > max) return max
    return num
  }

  const getTheta = () => {
    if (gamma === null || beta === null) return 0

    const x = clamp(beta, -90, 90) / 90
    const y = clamp(-gamma, -90, 90) / 90

    return Math.atan2(y, x)
  }

  const theta = getTheta()

  return (
    <>
      <Head>
        <title>Day 18 - This Way Up</title>
      </Head>
      <main className='grid place-items-center min-h-full'>
        <div
          className="border border-black rounded-full aspect-square grid place-items-center w-60"
          style={{ transform: `rotate(${theta}rad)` }}
        >
          <div>
            <div className="text-center text-2xl">&#8679;&#8679;</div>
            {/* <div className="text-6xl">🙂</div> */}
            <div className="font-regular">This Way Up</div>
          </div>
        </div>
      </main>
    </>
  )
}
