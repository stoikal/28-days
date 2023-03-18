import Head from 'next/head'
import { useEffect, useRef } from 'react'

// Conway's Game of Life rules:
// 1. Any live cell with two or three live neighbours survives.
// 2. Any dead cell with three live neighbours becomes a live cell.
// 3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.

type Cell = {
  x: number
  y: number
}

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

const CELL_SIZE = 16
const INITIAL_DENSITY = 0.2

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

const getLiveCells = (coords: Coordinate[], state: Cell[]) => {
  const cells: Cell[] = []

  coords.forEach((coord) => {
    const liveCell = state.find((cell) => (
      cell.x === coord[0] &&
      cell.y === coord[1]
    ))

    if (liveCell) {
      cells.push(liveCell)
    }
  })

  return cells
}

const isOccupied = (coord: Coordinate, state: Cell[]) => {
  return state.some((cell) => (
    cell.x === coord[0] &&
    cell.y === coord[1]
  ))
}

const getNextState = (state: Cell[]) => {
  const nextState: Cell[] = []
  const checked: Record<string, boolean> = {}

  state.forEach((cell) => {
    const neighboringCoords = getNeighboringCoordinates([cell.x, cell.y])
    const liveNeighbors: Cell[] = getLiveCells(neighboringCoords, state)

    if (liveNeighbors.length === 2 || liveNeighbors.length === 3) {
      nextState.push(cell)
    }

    for (const coord of neighboringCoords) {
      // skip because it is already checked
      if (isOccupied(coord, state)) continue
      if (checked[String(coord)]) continue

      const neighborNeighboringCoords = getNeighboringCoordinates(coord)
      const live = getLiveCells(neighborNeighboringCoords, state)

      if (live.length === 3) {
        nextState.push({
          x: coord[0],
          y: coord[1]
        })
      }

      checked[String(coord)] = true
    }
  })

  return nextState
}

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomCells = (count: number, boundary: Boundary) => {
  const cells: Cell[] = []
  const isDuplicate = (c: Cell) => cells.some((cell) => cell.x === c.x && cell.y === c.y)

  for (let i = 0; i < count; i++) {
    let newCell: Cell | null = null

    while (newCell === null || isDuplicate(newCell)) {
      newCell = {
        x: getRandomInt(boundary.min.x, boundary.max.x),
        y: getRandomInt(boundary.min.y, boundary.max.y)
      }
    }

    if (newCell) {
      cells.push(newCell)
    }
  }

  return cells
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

    let state: Cell[] = getRandomCells(initialCellCount, {
      min: { x: 0, y: 0 },
      max: {
        x: xCellCount,
        y: yCellCount
      }
    })

    let id: any

    const loop = () => {
      id = setTimeout(loop, 100)

      canvas.width = container.clientWidth // clear canvas

      draw(ctx, state)
      state = getNextState(state)
    }

    loop()

    return () => {
      clearTimeout(id)
    }
  }, [])

  const draw = (ctx: CanvasRenderingContext2D, state: Cell[]) => {
    state.forEach((cell) => {
      ctx.beginPath()
      ctx.rect(
        cell.x * CELL_SIZE,
        cell.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      )
      ctx.fill()
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
