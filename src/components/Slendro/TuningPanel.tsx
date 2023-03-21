import { useRef, useState, useEffect } from 'react'

type Cent = number

type Wilah = {
  name: string
  cent: Cent
}

type Props = {
  tuning: Wilah[]
  lowest: Cent
  highest: Cent
  onTuningChange: (tuning: Wilah[]) => void
}

const GUIDE_STEP = 240 // cent
// const HIGHLIGTED_GUIDE_STEP = 240 // cent
const CENT_PER_PIXEL = 2 // amount
const SNAP = 20 // cent

export default function Day28 ({ tuning, lowest, highest, onTuningChange }: Props) {
  const [tuningIndexInDrag, setTuningIndexInDrag] = useState<number | null>(null)

  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const guideLowest = lowest % GUIDE_STEP ? Math.floor(lowest / GUIDE_STEP) * GUIDE_STEP : lowest
  const guideHighest = highest % GUIDE_STEP ? Math.ceil(highest / GUIDE_STEP) * GUIDE_STEP : highest

  const guideWidth = Math.abs(guideLowest - guideHighest) / CENT_PER_PIXEL
  const guideHeight = 100
  const guideStepWidth = Math.round(GUIDE_STEP / CENT_PER_PIXEL)

  const guideLines = [...Array(Math.round(guideWidth / guideStepWidth))].map((_, index) => ({ x: index * guideStepWidth }))

  useEffect(() => {
    if (!wrapperRef.current) return

    const wrapper = wrapperRef.current

    const onMouseMove = (e: MouseEvent) => {
      if (tuningIndexInDrag !== null) {
        const { left } = wrapper.getBoundingClientRect()
        const offset = e.clientX - left

        const cent = Math.round((offset * CENT_PER_PIXEL + guideLowest) / SNAP) * SNAP

        const lowerWilah = tuning[tuningIndexInDrag - 1]
        const higherWilah = tuning[tuningIndexInDrag + 1]
        const offPanelTolerance = GUIDE_STEP

        const isLowerBound = lowerWilah ? cent > lowerWilah.cent : cent >= guideLowest - offPanelTolerance
        const isUpperBound = higherWilah ? cent < higherWilah.cent : cent <= guideHighest + offPanelTolerance

        if (isLowerBound && isUpperBound) {
          const prevTuning = tuning
          const tunedWilah = {
            ...prevTuning[tuningIndexInDrag],
            cent
          }

          const newTuning = [
            ...prevTuning.slice(0, tuningIndexInDrag),
            tunedWilah,
            ...prevTuning.slice(tuningIndexInDrag + 1)
          ]

          onTuningChange(newTuning)
        }
      }
    }

    const onMouseUp = () => {
      setTuningIndexInDrag(null)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [tuningIndexInDrag, tuning, onTuningChange, guideLowest, guideHighest])

  const createTuningItemHandler = (index: number) => (e: any) => {
    e.preventDefault()
    setTuningIndexInDrag(index)
  }

  const getLeftPosition = (cent: Cent) => {
    return (cent - guideLowest) / CENT_PER_PIXEL
  }

  return (
    <div
      style={{
        cursor: tuningIndexInDrag === null ? 'default' : 'grabbing'
      }}
    >
      <div
        ref={wrapperRef}
        className="relative"
      >
        <svg
          width={guideWidth}
          height={guideHeight}
        >
          <rect
            width={guideWidth}
            height={guideHeight}
            fill="none"
            stroke="white"
          />
          {
            guideLines
              .map((line, index) => (
                <line
                  key={index}
                  x1={line.x}
                  y1="0"
                  x2={line.x}
                  y2={guideHeight}
                  stroke="white"
                  strokeWidth={1}
                />
              ))
          }
        </svg>
        {
          tuning.map((wilah, index) => (
            <div
              key={index}
              style={{
                width: 12,
                textAlign: 'center',
                top: 0,
                left: getLeftPosition(wilah.cent),
                cursor: tuningIndexInDrag === null ? 'grab' : 'grabbing'
              }}
              role="button"
              className="absolute h-full -translate-x-1/2 bg-black text-white select-none"
              onMouseDown={createTuningItemHandler(index)}
            >
              <span>{ wilah.name }</span>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                { wilah.cent }
              </span>
            </div>
          ))
        }
      </div>
    </div>
  )
}
