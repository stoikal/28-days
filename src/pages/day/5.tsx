import Head from 'next/head'
import { MouseEvent, TouchEvent, useEffect, useRef, useState } from 'react'

const BASE_FREQ = 246.94 // B
const BLACK_KEYS_INDICES = [2, 4, 7, 9, 11]
const PIXEL_PER_OCTAVE = 420

const getFreq = (y: number) => {
  return BASE_FREQ * Math.pow(2, y / PIXEL_PER_OCTAVE)
}

const createOsc = (initialFreq: number) => {
  const audioContext = new AudioContext()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(initialFreq, audioContext.currentTime)
  gainNode.gain.setValueAtTime(0, audioContext.currentTime)

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  return {
    oscillator,
    gainNode,
    audioContext
  }
}

// position is different than mouse
const getPosition = (
  ev: MouseEvent
) => {
  const element = ev.target as HTMLDivElement

  return {
    x: ev.clientX - element.offsetLeft,
    y: element.offsetHeight + element.offsetTop - ev.clientY
  }
}

const getPositionFromTouch = (ev: TouchEvent) => {
  const element = ev.target as HTMLDivElement

  const touch = ev.touches[0]

  return {
    x: touch.clientX - element.offsetLeft,
    y: element.offsetHeight + element.offsetTop - touch.clientY
  }
}

export default function Day5 () {
  const [isPressed, setIsPressed] = useState(false)
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null)
  const [osc, setOsc] = useState<OscillatorNode | null>(null)
  const [gain, setGain] = useState<GainNode | null>(null)
  const [initialized, setInitialized] = useState(false)

  const parentRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (parentRef.current !== null && canvasRef.current !== null) {
      const parentDiv = parentRef.current
      const canvas = canvasRef.current
      const c = canvas.getContext('2d') as CanvasRenderingContext2D

      canvas.width = parentDiv.offsetWidth
      canvas.height = parentDiv.offsetHeight

      const unitHeight = PIXEL_PER_OCTAVE / 12
      const amount = Math.round(canvas.height / unitHeight) + 1

      const gradient = c.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, '#fecdd3')
      gradient.addColorStop(1, '#bae6fd')

      for (let i = 0; i < amount; i++) {
        const y = canvas.height - (i * unitHeight - unitHeight / 2)

        const isBlack = BLACK_KEYS_INDICES.includes(i % 12)

        c.beginPath()
        c.strokeStyle = gradient
        c.moveTo(0, y)
        c.lineTo(canvas.width, y)
        c.stroke()

        if (isBlack) {
          c.beginPath()
          c.fillStyle = gradient
          c.rect(
            0,
            y - unitHeight,
            canvas.width,
            unitHeight
          )
          c.fill()
        }
      }
    }
  }, [])

  const play = (freq: number) => {
    if (audioCtx && gain && osc) {
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
      gain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.5)
    }
  }

  const stop = () => {
    if (gain && audioCtx) {
      gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5)
    }
  }

  const handleMouseDown = (ev: MouseEvent) => {
    if (!isPressed) {
      const { y } = getPosition(ev)
      const freq = getFreq(y)

      play(freq)
      setIsPressed(true)
    }
  }

  const handleMouseMove = (ev: MouseEvent) => {
    if (isPressed && osc && audioCtx) {
      const { y } = getPosition(ev)
      const freq = getFreq(y)

      osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
    }
  }

  const handleMouseUp = (ev: MouseEvent) => {
    stop()
    setIsPressed(false)
  }

  const handleMouseLeave = (ev: MouseEvent) => {
    stop()
  }

  const handleMouseEnter = (ev: MouseEvent) => {
    if (isPressed) {
      const { y } = getPosition(ev)
      const freq = getFreq(y)

      play(freq)
    }
  }

  const handleTouchStart = (ev: TouchEvent) => {
    if (!isPressed) {
      const { y } = getPositionFromTouch(ev)
      const freq = getFreq(y)

      play(freq)
      setIsPressed(true)
    }
  }

  const handleTouchEnd = () => {
    stop()
    setIsPressed(false)
  }

  const handleTouchCancel = () => {
    stop()
    setIsPressed(false)
  }

  const handleTouchMove = (ev: TouchEvent) => {
    if (isPressed && osc && audioCtx) {
      const { y } = getPositionFromTouch(ev)
      const freq = getFreq(y)

      osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
    }
  }

  const init = () => {
    const {
      oscillator,
      gainNode,
      audioContext
    } = createOsc(BASE_FREQ)

    oscillator.start()

    setOsc(oscillator)
    setGain(gainNode)
    setAudioCtx(audioContext)
    setInitialized(true)
  }

  return (
    <>
      <Head>
        <title>Day 5 - Synth</title>
      </Head>
      <main
        className="bg-gray-500 flex flex-col items-center"
        style={{ height: '100svh' }}
        onMouseUp={handleMouseUp}
      >
        <div
          style={{ height: '100svh' }}
          className="absolute mx-auto bg-white w-screen max-w-2xl h-full"
        >
          <div
            ref={parentRef}
            className="bg-white h-full cursor-pointer"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            // touch
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            onTouchMove={handleTouchMove}
          >
            <canvas ref={canvasRef} />
          </div>
        </div>
        <div
          className={`${initialized ? 'hidden' : 'block'} absolute w-full bg-rose-400 grid place-items-center`}
          style={{ height: '100svh' }}
        >
          <button
            className="text-6xl text-white"
            type="button"
            onClick={init}
          >
            START
          </button>
        </div>
      </main>
    </>
  )
}
