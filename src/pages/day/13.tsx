import { useEffect, useState } from 'react'
import Head from 'next/head'

type Position = {
  lat: number
  lng: number
}

export default function Day13 () {
  const [position, setPosition] = useState<Position | null>(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    try {
      navigator.geolocation.watchPosition((geolocationPosition) => {
        const { coords } = geolocationPosition

        setPosition({
          lat: coords.latitude,
          lng: coords.longitude
        })
      })
    } catch {
      setIsSupported(false)
    }
  }, [])

  return (
    <>
      <Head>
        <title>
          Day 13 - location
        </title>
      </Head>
      <main className="grid place-items-center h-full">
        {isSupported && position
          ? (
              <a
                className="block border w-fit p-5 hover:shadow-lg hover:-translate-y-px"
                href={`https://www.openstreetmap.org/#map=15/${position.lat}/${position.lng}`}
                target="_blank"
              >
                <div>latitude: {position.lat}</div>
                <div>longitude: {position.lng}</div>
              </a>
            )
          : (
              <div className="block border w-fit p-5">
              </div>
            )
        }
      </main>
    </>
  )
}
