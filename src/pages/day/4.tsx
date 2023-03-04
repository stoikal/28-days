import { ChangeEvent, useState } from 'react'
import Head from 'next/head'

const MORSE_CODE_MAP: Record<string, string> = {
  a: '.-',
  b: '-...',
  c: '-.-.',
  d: '-..',
  e: '.',
  f: '..-.',
  g: '--.',
  h: '....',
  i: '..',
  j: '.---',
  k: '-.-',
  l: '.-..',
  m: '--',
  n: '-.',
  o: '---',
  p: '.--.',
  q: '--.-',
  r: '.-.',
  s: '...',
  t: '-',
  u: '..-',
  v: '...-',
  w: '.--',
  x: '-..-',
  y: '-.--',
  z: '--..',

  0: '-----',
  1: '.----',
  2: '..---',
  3: '...--',
  4: '....-',
  5: '.....',
  6: '-....',
  7: '--...',
  8: '---..',
  9: '----.',

  '.': '.-.-.-', // period
  ',': '--..--', // coma
  ' ': '/' // space
}

const BASE_DURATION = 100
const multiplier: Record<string, number> = {
  '.': 1,
  '-': 3,
  ' ': 3,
  '/': 1
}
const silentChars = [' ', '/']

const toMorse = (str: string) => {
  const input = str
    .replace(/(\.|,)\s+/g, (v) => v)

  return input
    .toLowerCase()
    .split('')
    .map((char) => MORSE_CODE_MAP[char])
    .join(' ')
}

const toVibrationPattern = (morse: string) => {
  const pattern: number[] = []

  let patternItem = 0

  Array.from(morse)
    .forEach((item, index) => {
      const isSilent = silentChars.includes(item)

      if (isSilent) {
        patternItem += multiplier[item] * BASE_DURATION
      } else {
        if (patternItem) {
          pattern.push(patternItem)
          patternItem = 0
        } else if (index > 0) {
          pattern.push(BASE_DURATION)
        }

        pattern.push(multiplier[item] * BASE_DURATION)
      }
    })

  return pattern
}

export default function Day4 () {
  const [input, setInput] = useState('')

  const handleClick = () => {
    try {
      navigator.vibrate(1000)
    } catch {
      console.error('Can not v i b r a t e')
    }
  }

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    const filtered = value
      .replace(/\s+/g, ' ')
      .replace(/[^a-zA-Z0-9,.\s]/g, '')

    setInput(filtered)
  }

  const output = toMorse(input)

  const vibrateMorseCode = () => {
    try {
      const pattern = toVibrationPattern(output)

      navigator.vibrate(pattern)
    } catch {
      console.error('Can not v i b r a t e')
    }
  }

  return (
    <>
      <Head>
        <title>Day 4 - v i b r a t e</title>
      </Head>
      <main>
        <div className="max-w-xl mx-auto px-4">
          <div className="mb-6">
            <small>*Only works on some browsers (Chrome, Opera Mobile)</small>
          </div>
          <div className="mb-6">
            <button
              className="text-center w-full bg-slate-400 active:bg-slate-500  rounded-md text-3xl p-4"
              type="button"
              onClick={handleClick}
            >
              v i b r a t e
            </button>
          </div>

          <form>
            <h3 className="font-bold mb-2">or try morse code:</h3>
            <div className='mb-2'>
              <textarea
                className="border w-full py-1 px-2"
                value={input}
                rows={2}
                maxLength={10}
                onChange={handleInput}
              />
              <div className="text-right">
                <small className="text-xs">
                  {input.length} / 10
                </small>
              </div>
            </div>
            <div className="mb-4">
              <p>{output}</p>
            </div>
            <button
              className="text-center w-full bg-slate-400 active:bg-slate-500 rounded-md text-lg p-2"
              type="button"
              onClick={vibrateMorseCode}
            >
              v i b r a t e&nbsp; pattern
            </button>
          </form>
        </div>
      </main>
    </>
  )
}
