import React, { ReactNode, DragEvent, useRef, useState, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import Head from 'next/head'

type DraggableProps = {
  value: number
  onDrag?: (el: any) => void
}

type CellProps = {
  value: number
  children?: ReactNode
  onDrop: (el: any) => void
  onItemDrag: (val: number) => void
}

function Draggable ({ onDrag, value }: DraggableProps) {
  const draggedRef = useRef(null)

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    const el = e.target

    if (onDrag) {
      onDrag(el)
    }
  }

  return (
    <div
      ref={draggedRef}
      draggable
      className="bg-rose-700 w-6 h-6 rounded-full mx-1 flex-shrink-0 grid place-content-center text-white cursor-pointer"
      onDragStart={handleDrag}
    >
      { value }
    </div>
  )
}

function Cell ({ value, children, onDrop, onItemDrag }: CellProps) {
  const dropzoneRef = useRef(null)

  const handleDrop = () => {
    if (!dropzoneRef.current) return

    const dropZone = dropzoneRef.current as HTMLDivElement

    if (onDrop) {
      onDrop(dropZone)
    }
  }

  const handleItemDrag = () => {
    onItemDrag(value)
  }

  return (
    <div
      ref={dropzoneRef}
      className="border w-20 h-20 flex justify-center items-center flex-wrap"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      { !!value && (
        <Draggable
          value={value}
          onDrag={handleItemDrag}
        />
      )}
      { children }
    </div>
  )
}

const DEFAULT_STATE = [1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const INITIAL_SOLUTION = [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4]

const getRandomSolution = () => {
  const temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  for (let val = 1; val <= 4; val++) {
    let randomIndex = Math.floor(Math.random() * temp.length)

    while (temp[randomIndex]) {
      randomIndex = Math.floor(Math.random() * temp.length)
    }

    temp[randomIndex] = val
  }

  return temp
}

const getColumnSums = (arr: number[]) => {
  const temp: number[] = []

  for (let i = 0; i < 4; i++) {
    const sum = arr
      .filter((_, index) => index % 4 === i)
      .reduce((a, b) => a + b, 0)

    temp.push(sum)
  }

  return temp
}

const getRowSums = (arr: number[]) => {
  const temp: number[] = []

  for (let i = 0; i < 4; i++) {
    const sum = arr
      .filter((_, index) => Math.floor(index / 4) === i)
      .reduce((a, b) => a + b, 0)

    temp.push(sum)
  }

  return temp
}

const isEqual = (arr1: number[], arr2: number[]) => {
  return (
    JSON.stringify(getColumnSums(arr1)) === JSON.stringify(getColumnSums(arr2)) &&
    JSON.stringify(getRowSums(arr1)) === JSON.stringify(getRowSums(arr2))
  )
}

export default function Day11 () {
  const [solution, setSolution] = useState(INITIAL_SOLUTION)
  const [state, setState] = useState(DEFAULT_STATE)
  const [valueInDrag, setValueInDrag] = useState<number | null>(null)
  const [isWon, setIsWon] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (isEqual(state, solution)) {
      setIsWon(true)
      setScore(prev => prev + 1)
    }
  }, [state, solution])

  const handleDrop = (index: number) => {
    const isOccupied = !!state[index]

    if (valueInDrag && !isOccupied && !isWon) {
      setState(prev => {
        const next = [...prev]
        const prevIndex = next.findIndex(item => item === valueInDrag)
        next[prevIndex] = 0
        next[index] = valueInDrag

        return next
      })

      setValueInDrag(null)
    }
  }

  const handleItemDrag = (val: number) => {
    setValueInDrag(val)
  }

  const reset = () => {
    setIsWon(false)
    setState(DEFAULT_STATE)
    setSolution(getRandomSolution())
  }

  const columnClues = useMemo(() => {
    return getColumnSums(solution)
  }, [solution])

  const rowClues = useMemo(() => {
    return getRowSums(solution)
  }, [solution])

  const currentColumns = useMemo(() => {
    return getColumnSums(state)
  }, [state])

  const currentRows = useMemo(() => {
    return getRowSums(state)
  }, [state])

  return (
    <>
      <Head>
        <title>Day 11 - Simple Puzzle</title>
      </Head>
      <main className="h-screen grid place-content-center select-none">
        <div>
          <div className="grid grid-cols-5">
            {
              [...columnClues, ''].map((item, index) => (
                <span
                  key={index + 'col'}
                  className={classNames(
                    'text-center',
                    item === currentColumns[index]
                      ? 'text-emerald-800 font-bold'
                      : 'text-rose-800'
                  )}
                >
                  {item}
                </span>
              ))
            }
            {
              state
                .map((value, cellIndex) => (
                  <React.Fragment key={cellIndex}>
                    <Cell
                      key={cellIndex}
                      value={value}
                      onItemDrag={handleItemDrag}
                      onDrop={() => handleDrop(cellIndex)}
                    />
                    {
                      cellIndex % 4 === 3 && (
                        <span
                          className={classNames(
                            'flex items-center px-3',
                            rowClues[Math.floor(cellIndex / 4)] === currentRows[Math.floor(cellIndex / 4)]
                              ? 'text-emerald-800 font-bold'
                              : 'text-rose-800'
                          )}
                        >
                          {rowClues[Math.floor(cellIndex / 4)]}
                        </span>
                      )
                    }
                  </React.Fragment>
                ))
            }
          </div>
        </div>
        <div className="h-6 py-2">
          <span className="pr-3 font-bold">Score: {score}</span>
          {
            isWon && (
              <span>
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-00 px-2 rounded"
                  onClick={reset}
                >
                  reset
                </button>
              </span>
            )
          }
        </div>
      </main>
    </>
  )
}
