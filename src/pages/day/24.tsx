import Head from 'next/head'
import { ChangeEvent, useRef, useState } from 'react'

export default function Day24 () {
  const [file, setFile] = useState<File | null>(null)
  const [downloadHref, setDownloadHref] = useState<any>(null)

  const canvasWrapperRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const drawImage = (img: HTMLImageElement) => {
    if (!canvasRef.current) return
    if (!canvasWrapperRef.current) return

    const wrapper = canvasWrapperRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    canvas.width = wrapper.clientWidth
    canvas.height = canvas.width / img.width * img.height

    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)

    const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    const pixels = imgData.data
    for (let i = 0; i < pixels.length; i += 4) {
      const lightness = Math.round((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3)

      pixels[i] = lightness
      pixels[i + 1] = lightness
      pixels[i + 2] = lightness
    }
    ctx.putImageData(imgData, 0, 0)

    setDownloadHref(canvas.toDataURL())
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files) {
      const file = files[0]
      const img = new Image()

      img.onload = function () {
        drawImage(img)
        URL.revokeObjectURL(img.src)
      }

      img.src = URL.createObjectURL(file)

      console.table({
        filename: file.name,
        lastModified: new Date(file.lastModified).toString(),
        type: file.type,
        size: `${Math.round(file.size / 1024)} KB`
      })

      setFile(file)
    } else {
      setFile(null)
    }

    setDownloadHref(null)
  }

  return (
    <>
      <Head>
        <title>Day 24 - Grayscale</title>
      </Head>
      <main>
        <div className="max-w-3xl mx-auto p-4 text-center">
          <input
            type="file"
            className="border mb-2"
            accept="image/*"
            onChange={handleFileChange}
          />

          <div
            ref={canvasWrapperRef}
            className="mb-4"
          >
            <canvas
              ref={canvasRef}
              className="w-full object-contain"
            />
          </div>

          {
            !!downloadHref && (
              <a
                href={downloadHref}
                download={file?.name}
                className="underline"
              >
                download
              </a>
            )
          }
        </div>
      </main>
    </>
  )
}
