import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'

export default function Day14 () {
  const [fontSize, setFontSize] = useState(1)

  const textareaRef = useRef(null)

  useEffect(() => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const size = Math.max(1, entry.contentRect.width / 200)
        setFontSize(size)
      }

      console.log('Size changed')
    })

    resizeObserver.observe(textarea)
  }, [])

  return (
    <>
      <Head>
        <title>Day 14 - ResizeObserver</title>
      </Head>
      <main className="h-full grid place-items-center">
        <div>
          <textarea
            ref={textareaRef}
            placeholder="resize me. ukuran font mengikuti lebar element"
            className="border resize py-3 px-5"
            style={{ fontSize: `${fontSize}rem` }}
          />
        </div>
      </main>
    </>
  )
}
