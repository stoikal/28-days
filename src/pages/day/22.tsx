import Head from 'next/head'
import { useState } from 'react'
import { useGamepad } from '@/hooks/useGamepad'
import { useTouchAsTrigger } from '@/hooks/useTouchAsTrigger'

const EYE_HEIGHT = 300
const IRIS_RADIUS = 80

export default function Day22 () {
  // [lx, ly, rt, ry]
  const [lXIndex] = useState(0)
  const [lYIndex] = useState(1)
  const [rXIndex] = useState(2)
  const [rYIndex] = useState(3)

  const { axes, triggers } = useGamepad()
  const { amount } = useTouchAsTrigger()

  const lX = axes[lXIndex] ?? 0
  const lY = axes[lYIndex] ?? 0

  const rX = axes[rXIndex] ?? 0
  const rY = axes[rYIndex] ?? 0

  const lTrigger = triggers[0] ?? 0
  const rTrigger = triggers[1] ?? 0

  const lBlink = Math.max(amount, lTrigger)
  const rBlink = Math.max(amount, rTrigger)

  return (
    <>
      <Head>
        <title>Day 22 - Eyes</title>
      </Head>
      <main
        className="h-full bg-[skyblue] overflow-hidden"
      >
        <div
          className="flex items-center justify-center lg:justify-between lg:w-[1000px] h-full mx-auto"
        >
          <svg height="400" width="400">
            <rect x="0" y="0" width="400" height="400" fill="white" />
            <circle
              cx={200 + (120 * lX)}
              cy={200 + (80 * lY)}
              r={IRIS_RADIUS}
              fill="black"
            />
            <path
              d={`
                M 0 0
                L 400 0
                L 400 200
                L 390 200
                q -190 ${EYE_HEIGHT * lBlink - EYE_HEIGHT / 2} -380 0
                q 190 ${EYE_HEIGHT / 2} 380 0
                L 400 200
                L 400 400
                L 0 400
                L 0 0
              `}
              stroke="black"
              strokeWidth="0"
              fill="skyblue"
            />
            Sorry, your browser does not support inline SVG.
          </svg>
          <svg height="400" width="400" className="hidden lg:block">
            <rect x="0" y="0" width="400" height="400" fill="white" />
            <circle
              cx={200 + (120 * rX)}
              cy={200 + (80 * rY)}
              r={IRIS_RADIUS}
              fill="black"
            />
            <path
              d={`
                M 0 0
                L 400 0
                L 400 200
                L 390 200
                q -190 ${EYE_HEIGHT * rBlink - EYE_HEIGHT / 2} -380 0
                q 190 ${EYE_HEIGHT / 2} 380 0
                L 400 200
                L 400 400
                L 0 400
                L 0 0
              `}
              stroke="black"
              strokeWidth="0"
              fill="skyblue"
            />
            Sorry, your browser does not support inline SVG.
          </svg>
        </div>
      </main>
    </>
  )
}
