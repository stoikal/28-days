import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import * as Tone from 'tone'
import TuningPanel from '@/components/Slendro/TuningPanel'
import { useKeypress } from '@/hooks/useKeypress'

type Cent = number

type Wilah = {
  name: string
  cent: Cent
}

type Tuning = Wilah[]

type ExtWilah = Wilah & { note: number }
type ExtTuning = ExtWilah[]

const INITIAL_TUNING: Tuning = [
  { name: '̣5', cent: -456 },
  { name: '̣6', cent: -252 },
  { name: '1', cent: 0 },
  { name: '2', cent: 216 },
  { name: '3', cent: 480 },
  { name: '5', cent: 744 },
  { name: '6', cent: 948 },
  { name: '1̇', cent: 1200 },
  { name: '2̇', cent: 1416 }
]

const getNote = (baseFreq: number, cent: number) => {
  return Math.round(baseFreq * Math.pow(2, cent / 1200))
}

export default function Day23 () {
  const [baseFreq, setBaseFreq] = useState(274)
  const [tuning, setTuning] = useState(INITIAL_TUNING)

  const synthRef = useRef<Tone.Synth<Tone.SynthOptions> | null>(null)

  const extTuning: ExtTuning = tuning.map((wilah) => ({
    ...wilah,
    note: getNote(baseFreq, wilah.cent)
  }))

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

  const triggerNote = (note: number) => {
    if (!synthRef.current) return
    const synth = synthRef.current
    synth.triggerAttackRelease(note, '4n')
  }

  useKeypress('a', () => triggerNote(extTuning[0].note))
  useKeypress('s', () => triggerNote(extTuning[1].note))
  useKeypress('d', () => triggerNote(extTuning[2].note))
  useKeypress('f', () => triggerNote(extTuning[3].note))
  useKeypress('g', () => triggerNote(extTuning[4].note))
  useKeypress('h', () => triggerNote(extTuning[5].note))
  useKeypress('j', () => triggerNote(extTuning[6].note))
  useKeypress('k', () => triggerNote(extTuning[7].note))
  useKeypress('l', () => triggerNote(extTuning[8].note))

  const handleButtonClick = (note: number) => (e: SyntheticEvent) => {
    e.preventDefault()
    triggerNote(note)
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
        <title>Day 23 - Laras Slendro</title>
      </Head>
      <main className="min-h-full bg-pink-400 flex flex-col items-center justify-center overflow-hidden">
        <div className="mb-32 hidden lg:block">
          <div>
            <label>Base frequency</label>:
            <br/>
            <input
              value={baseFreq}
              type="number"
              className="px-3 py-2 bg-pink-300 border mb-3"
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

        <div className="border flex flex-wrap p-3">
          {
            extTuning
              .map((wilah, index) => (
                <div
                  key={index}
                  className="p-2 w-1/3 lg:w-[11.11111%]"
                >
                  <button
                    onMouseDown={handleButtonClick(wilah.note)}
                    className="w-full border px-5 py-20 bg-pink-50 hover:bg-white"
                  >
                    <span>
                      {wilah.name}
                    </span>
                    <br/>
                    <span className="whitespace-nowrap">
                      { wilah.note } hz
                    </span>
                  </button>
                </div>
              ))
          }
        </div>
      </main>
    </>
  )
}
