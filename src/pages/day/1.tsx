import { useEffect, useRef } from 'react'
import Head from 'next/head'
import debounce from 'lodash/debounce'

// const Main = styled.main<{ margin: number }>`
//   height: calc(100vh - 32px);
//   margin: ${props => props.margin}px;
// `

export default function Day1 () {
  const canvasRef = useRef(null)

  const CANVAS_PADDING = 16

  const draw = () => {
    if (canvasRef.current === null) return

    const canvas = canvasRef.current as HTMLCanvasElement
    const c = canvas.getContext('2d') as CanvasRenderingContext2D

    canvas.width = innerWidth - CANVAS_PADDING * 2
    canvas.height = innerHeight - CANVAS_PADDING * 2

    c.beginPath()
    c.rect(0, 0, canvas.width, canvas.height)
    c.fillStyle = 'black'
    c.closePath()
    c.fill()

    const text = 'Hello, world!'
    const textWidth = c.measureText(text).width
    const unit = canvas.width / textWidth / 10

    c.beginPath()
    c.fillStyle = 'rgba(255, 0, 100, 0.8)'
    c.textAlign = 'center'
    c.font = `${canvas.width / text.length}px monospace`
    c.closePath()
    c.fillText(text, canvas.width / 2 + unit * 2, innerHeight / 2 - unit * 2)

    c.beginPath()
    c.fillStyle = 'white'
    c.textAlign = 'center'
    c.font = `${canvas.width / text.length}px monospace`
    c.closePath()
    c.fillText(text, canvas.width / 2, innerHeight / 2)
  }

  useEffect(() => {
    const debouncedDraw = debounce(draw, 50)

    window.addEventListener('resize', debouncedDraw)
    draw()

    return () => {
      window.removeEventListener('resize', debouncedDraw)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Day 1 - Responsive Canvas</title>
      </Head>
      <main
        style={{
          height: 'calc(100vh - 32px)',
          margin: CANVAS_PADDING,
        }}
      >
        <canvas ref={canvasRef} />
      </main>
    </>
  )
}
