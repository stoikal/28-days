import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import * as Tone from 'tone'
import TuningPanel from '@/components/Slendro/TuningPanel'

type Cent = number

type Wilah = {
  name: string
  cent: Cent
}

type Tuning = Wilah[]

const INITIAL_TUNING: Tuning = [
  { name: '5', cent: -460 },
  { name: '6', cent: -260 },
  { name: '1', cent: 0 },
  { name: '2', cent: 220 },
  { name: '3', cent: 480 },
  { name: '5', cent: 740 },
  { name: '6', cent: 940 },
  { name: '1', cent: 1200 },
  { name: '2', cent: 1420 }
]

export default function Day23 () {
  const [baseFreq, setBaseFreq] = useState(274)
  const [tuning, setTuning] = useState(INITIAL_TUNING)

  const synthRef = useRef<Tone.Synth<Tone.SynthOptions> | null>(null)

  useEffect(() => {
    const options = {
      envelope: {
        attack: 0.001,
        decay: 1,
        sustain: 0.05,
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

  const handleBaseFrequencyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const freq = Number(e.target.value)
    if (!isNaN(freq)) {
      setBaseFreq(freq)
    }
  }

  const handleTuningChange = (tuning: Tuning) => {
    setTuning(tuning)
  }

  return (
    <>
      <Head>
        <title>Day 23 - Slendro</title>
      </Head>
      <main className="min-h-full bg-pink-400 flex flex-col items-center justify-center">
        <div className="p-4 mb-10 border">
          {
            tuning
              .map((wilah, index) => (
                <button
                  key={index}
                  onMouseDown={handleButtonClick(Math.round(baseFreq * Math.pow(2, wilah.cent / 1200)))}
                  className="border mx-1 px-6 py-20"
                >
                  <span>
                    {wilah.name}
                  </span>
                  <br/>
                  { Math.round(baseFreq * Math.pow(2, wilah.cent / 1200)) } hz
                </button>
              ))
          }
        </div>

        <div>
          <div>
            <label>Base frequency</label>:
            <br/>
            <input
              value={baseFreq}
              type="number"
              className="px-3 py-2 bg-transparent border mb-3"
              onChange={handleBaseFrequencyChange}
            />
          </div>
          Intervals:
          <TuningPanel
            tuning={tuning}
            lowest={-480}
            highest={1440}
            onTuningChange={handleTuningChange}
          />
        </div>
      </main>
    </>
  )
}
