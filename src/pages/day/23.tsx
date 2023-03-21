import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

export default function Day23 () {
  const [barangFreq, setBarangFreq] = useState(275)
  const [tuning, setTuning] = useState([-280, 0, 280, 520, 720, 920, 1200])
  const [isDragging, setIsDragging] = useState<number | null>(null)

  const lowest = -240
  const step = 40

  const noteName = ['̣6', '1', '2', '3', '5', '6', '1̇']

  const synthRef = useRef<Tone.Synth<Tone.SynthOptions> | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!wrapperRef.current) return

    const wrapper = wrapperRef.current

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging !== null) {
        const { left } = wrapper.getBoundingClientRect()
        const offset = e.clientX - left

        const cent = Math.round((offset / ((tuning.length * 100) / ((1200 - lowest) / step))) + lowest / step) * step

        if (
          cent > (tuning[isDragging - 1] ?? lowest - step * 7) &&
          cent < (tuning[isDragging + 1] ?? 1200 + step * 7)
        ) {
          setTuning(prev => {
            return [
              ...prev.slice(0, isDragging),
              cent,
              ...prev.slice(isDragging + 1)
            ]
          })
        }
      }
    }

    const onMouseUp = () => {
      setIsDragging(null)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging, tuning, lowest])

  useEffect(() => {
    const options = {
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.01,
        release: 0.5
      }
    }
    synthRef.current = new Tone.Synth(options).toDestination()
  }, [])

  const handleButtonClick = (note: number) => (e: SyntheticEvent) => {
    e.preventDefault()
    if (!synthRef.current) return
    const synth = synthRef.current
    synth.triggerAttackRelease(note, '4n')
  }

  const handleMouseDown = (index: number) => (e: MouseEvent) => {
    e.preventDefault()
    setIsDragging(index)
  }

  const handleBarangFreqChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(e.target.value))) {
      setBarangFreq(Number(e.target.value))
    }
  }

  return (
    <>
      <main className="h-full grid place-items-center bg-pink-400">
        <div className="p-4 border">
          {
            tuning
              .map((cent) => Math.round(barangFreq * Math.pow(2, cent / 1200)))
              .map((note, index) => (
                <button
                  key={index}
                  onMouseDown={handleButtonClick(note)}
                  className="border mx-1 px-6 py-8"
                >
                  <span>{noteName[index]}</span>
                  <br/>
                  { note } hz
                </button>
              ))
          }
        </div>
        <div>
          <input
            value={barangFreq}
            type="number"
            onChange={handleBarangFreqChange}
          />
        </div>
        <div className='border'>
          <div
            ref={wrapperRef}
            className="flex w-[700px] h-[200px] relative"
          >
            {
              [...Array(tuning.length - 1)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-100 w-1/5"
                />
              ))
            }
            {
              tuning.map((cent, index) => (
                <div
                  key={index}
                  style={{
                    left: Math.round((cent - lowest) * (tuning.length * 100 / (1200 - lowest))),
                    cursor: isDragging === index ? 'grabbing' : 'grab'
                  }}
                  role="button"
                  className="absolute h-full -translate-x-1/2 bg-black text-white select-none"
                  onMouseDown={handleMouseDown(index)}
                >
                  { noteName[index] }
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                    { cent }
                  </span>
                </div>
              ))
            }
          </div>
        </div>
      </main>
    </>
  )
}
