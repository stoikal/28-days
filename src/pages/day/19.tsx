import Head from 'next/head'
import { useEffect, useRef } from 'react'

// Conway's Game of Life rules:
// 1. Any live cell with two or three live neighbours survives.
// 2. Any dead cell with three live neighbours becomes a live cell.
// 3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.

type Coordinate = [x: number, y: number]

type Boundary = {
  min: {
    x: number
    y: number
  }
  max: {
    x: number
    y: number
  }
}

type State = Record<string, number>

const CELL_SIZE = 12
const INITIAL_DENSITY = 0.5
const FPS = 12

const getNeighboringCoordinates = (coord: Coordinate) => {
  const coordinates: Coordinate[] = []

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const isSelf = i === 0 && j === 0
      if (isSelf) continue

      const nx = coord[0] + i
      const ny = coord[1] + j

      coordinates.push([nx, ny])
    }
  }

  return coordinates
}

const getLiveCells = (coords: Coordinate[], state: State) => {
  let count = 0

  coords.forEach((coord) => {
    const liveCell = state[String(coord)]

    if (liveCell) {
      count++
    }
  })

  return count
}

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getInitialState = (count: number, boundary: Boundary) => {
  const state: State = {}

  for (let i = 0; i < count; i++) {
    let coord: Coordinate | null = null

    while (coord === null || state[String(coord)]) {
      coord = [
        getRandomInt(boundary.min.x, boundary.max.x),
        getRandomInt(boundary.min.y, boundary.max.y)
      ]
    }

    state[String(coord)] = 1
  }

  return state
}

const stringToCoord = (str: string) => {
  const arr = str.split(',')

  return [Number(arr[0]), Number(arr[1])] as Coordinate
}

const getNextState = (state: State) => {
  const nextState: State = {}
  const checked: Record<string, boolean> = {}

  Object.entries(state).forEach(([key, age]) => {
    const coord = stringToCoord(key)
    const neighboringCoords = getNeighboringCoordinates(coord)
    const neighbourCount = getLiveCells(neighboringCoords, state)

    if (neighbourCount === 2 || neighbourCount === 3) {
      nextState[key] = age + 1
    }

    for (const coord of neighboringCoords) {
      // skip because it is already checked
      if (state[String(coord)] > 0) continue
      if (checked[String(coord)]) continue

      const neighborNeighboringCoords = getNeighboringCoordinates(coord)
      const count = getLiveCells(neighborNeighboringCoords, state)

      if (count === 3) {
        nextState[String(coord)] = 1
      }

      checked[String(coord)] = true
    }
  })

  return nextState
}

export default function Day19 () {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (
      containerRef.current === null ||
      canvasRef.current === null
    ) {
      return
    }

    const container = containerRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    canvas.width = container.clientWidth
    canvas.height = container.clientHeight

    const xCellCount = Math.floor(canvas.width / CELL_SIZE)
    const yCellCount = Math.floor(canvas.height / CELL_SIZE)
    const initialCellCount = Math.round(INITIAL_DENSITY * xCellCount * yCellCount)

    let state = getInitialState(initialCellCount, {
      min: { x: 0, y: 0 },
      max: {
        x: xCellCount,
        y: yCellCount
      }
    })

    let animationFrameId: any
    let timeOutId: any

    const animate = () => {
      animationFrameId = requestAnimationFrame(() => {
        timeOutId = setTimeout(() => {
          animate()
        }, Math.round(1000 / FPS))
      })

      canvas.width = container.clientWidth // clear canvas

      draw(ctx, state, CELL_SIZE)
      state = getNextState(state)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearTimeout(timeOutId)
    }
  }, [])

  const draw = (ctx: CanvasRenderingContext2D, state: State, cellSize: number) => {
    Object.entries(state).forEach(([key, age]) => {
      const [x, y] = stringToCoord(key)

      ctx.beginPath()
      ctx.rect(
        x * cellSize,
        y * cellSize,
        cellSize,
        cellSize
      )

      ctx.stroke()
    })
  }

  return (
    <>
      <Head>
        <title>Day 19 - Game of Life</title>
      </Head>
      <main className="min-h-full grid place-items-center">
        <div
          ref={containerRef}
          className="w-full h-full border"
        >
          <canvas
            ref={canvasRef}
          >
            Your browser does not support HTML5 canvas.
          </canvas>
        </div>
      </main>
    </>
  )
}
