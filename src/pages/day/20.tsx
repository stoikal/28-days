import Head from 'next/head'
import { useRef, useState } from 'react'

export default function Day20 () {
  const [isSupported, setIsSupported] = useState(true)

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const requestPiP = () => {
    if (!('pictureInPictureEnabled' in document) || !videoRef.current) {
      setIsSupported(false)
      return
    }

    if (document.pictureInPictureElement) {
      document
        .exitPictureInPicture()
        .catch((err) => console.error(err))
    } else {
      const video = videoRef.current
      video.requestPictureInPicture()
    }
  }

  return (
    <>
      <Head>
        <title>Day 20 - Picture in Picture</title>
      </Head>
      <main className="relative min-h-full bg-black">
        <video
          ref={videoRef}
          loop
          autoPlay
          className="fixed min-w-full min-h-full object-cover"
          muted
        >
          <source src="/videos/waves-71122.mp4" type="video/mp4" />
          This browser does not support HTML video.
        </video>
        <button
          className="fixed left-1/2 bottom-10 -translate-x-1/2 border border-white text-white hover:bg-[rgba(255,255,255,0.2)] px-3 py-2"
          disabled={!isSupported}
          onClick={requestPiP}
        >
          <span>
            { isSupported ? 'toggle picture in picture' : 'picture in picture is not supported' }
          </span>
        </button>
      </main>
    </>
  )
}
