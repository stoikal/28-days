import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import TuningPanel from '@/components/Slendro/TuningPanel'

type Cent = number

type Wilah = {
  name: string
  cent: Cent
}

type Tuning = Wilah[]

const INITIAL_TUNING: Tuning = [
  { name: '6', cent: -240 },
  { name: '1', cent: 0 },
  { name: '2', cent: 240 },
  { name: '3', cent: 480 },
  { name: '5', cent: 720 },
  { name: '6', cent: 960 },
  { name: '1', cent: 1200 }
]

export default function Day23 () {
  const [barangFreq, setBarangFreq] = useState(275)
  const [tuning, setTuning] = useState(INITIAL_TUNING)

  const synthRef = useRef<Tone.Synth<Tone.SynthOptions> | null>(null)

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

  const handleBarangFreqChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(e.target.value))) {
      setBarangFreq(Number(e.target.value))
    }
  }

  const handleTuningChange = (tuning: Tuning) => {
    setTuning(tuning)
  }

  return (
    <>
      <main className="h-full grid place-items-center bg-pink-400">
        <div className="p-4 border">
          {
            tuning
              .map((wilah, index) => (
                <button
                  key={index}
                  onMouseDown={handleButtonClick(Math.round(barangFreq * Math.pow(2, wilah.cent / 1200)))}
                  className="border mx-1 px-6 py-8"
                >
                  <span>
                    {wilah.name}
                  </span>
                  <br/>
                  { Math.round(barangFreq * Math.pow(2, wilah.cent / 1200)) } hz
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

        <TuningPanel
          tuning={tuning}
          lowest={-240}
          highest={1200}
          onTuningChange={handleTuningChange}
        />
      </main>
    </>
  )
}
