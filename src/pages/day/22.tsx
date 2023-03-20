import Head from 'next/head'
import { useState } from 'react'
import { useGamepad } from '@/hooks/useGamepad'

const EYE_HEIGHT = 300
const IRIS_RADIUS = 80

export default function Day22 () {
  // [lx, ly, rt, ry]
  const [lXIndex] = useState(0)
  const [lYIndex] = useState(1)
  const [rXIndex] = useState(2)
  const [rYIndex] = useState(3)

  const { axes, triggers } = useGamepad()

  const lX = (() => {
    if (axes[lXIndex] !== undefined) {
      return axes[lXIndex]
    }

    return 0
  })()

  const lY = (() => {
    if (axes[lYIndex] !== undefined) {
      return axes[lYIndex]
    }

    return 0
  })()

  const rX = (() => {
    if (axes[rXIndex] !== undefined) {
      return axes[rXIndex]
    }

    return 0
  })()

  const rY = (() => {
    if (axes[rYIndex] !== undefined) {
      return axes[rYIndex]
    }

    return 0
  })()

  const lTrigger = (() => {
    if (triggers[0] !== undefined) {
      return triggers[0]
    }

    return 0
  })()

  const rTrigger = (() => {
    if (triggers[1] !== undefined) {
      return triggers[1]
    }

    return 0
  })()

  return (
    <>
      <Head>
        <title>Day 22 - Eyes</title>
      </Head>
      <main className="h-full bg-[skyblue] overflow-hidden">
        <div
          className="flex items-center justify-center lg:justify-between lg:w-[900px] h-full mx-auto"
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
                q -190 ${EYE_HEIGHT * lTrigger - EYE_HEIGHT / 2} -380 0
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
                q -190 ${EYE_HEIGHT * rTrigger - EYE_HEIGHT / 2} -380 0
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