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
  { name: '6', cent: -260 },
  { name: '1', cent: 0 },
  { name: '2', cent: 260 },
  { name: '3', cent: 500 },
  { name: '5', cent: 720 },
  { name: '6', cent: 940 },
  { name: '1', cent: 1200 }
]

export default function Day23 () {
  const [barangFreq, setBarangFreq] = useState(270)
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
    const freq = Number(e.target.value)
    if (!isNaN(freq)) {
      setBarangFreq(freq)
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
                  onMouseDown={handleButtonClick(Math.round(barangFreq * Math.pow(2, wilah.cent / 1200)))}
                  className="border mx-1 px-6 py-20"
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
          <div>
            <label><em>Barang</em> frequency</label>:
            <br/>
            <input
              value={barangFreq}
              type="number"
              className="px-3 py-2 bg-transparent border mb-3"
              onChange={handleBarangFreqChange}
            />
          </div>
          Intervals:
          <TuningPanel
            tuning={tuning}
            lowest={-240}
            highest={1200}
            onTuningChange={handleTuningChange}
          />
        </div>
      </main>
    </>
  )
}
