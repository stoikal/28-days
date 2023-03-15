import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Day15 () {
  const [selection, setSelection] = useState('')

  useEffect(() => {
    const handleSelectionChange = () => {
      const range = document.getSelection()
      if (range) {
        const str = range.toString()
        setSelection(str)
      }
    }

    document.addEventListener(
      'selectionchange',
      handleSelectionChange
    )

    return () => {
      document.removeEventListener(
        'selectionchange',
        handleSelectionChange
      )
    }
  }, [])

  return (
    <>
      <Head>
        <title>Day 15 - selection</title>
      </Head>

      <main>
        <div className="max-w-md mx-auto p-4">
          <p className="mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Condimentum mattis pellentesque id nibh. Amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus.</p>

          <p className="mb-3">Viverra ipsum nunc aliquet bibendum enim. Imperdiet massa tincidunt nunc pulvinar sapien. Consectetur purus ut faucibus pulvinar elementum integer enim neque. Risus at ultrices mi tempus imperdiet nulla malesuada. Venenatis cras sed felis eget velit aliquet. Purus ut faucibus pulvinar elementum integer. Interdum velit euismod in pellentesque massa placerat. Tempor orci dapibus ultrices in iaculis.</p>
          <p className="text-blue-800">{ selection }</p>
        </div>
      </main>
    </>
  )
}
