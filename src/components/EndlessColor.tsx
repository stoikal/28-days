import { useEffect, useRef, useState } from 'react'

type Color = {
  hue: number
  saturation: number
  lightness: number
  name: string
}

type LoaderProp = {
  onIntersect: () => void
  onClick: () => void
}

function Loader ({ onIntersect, onClick }: LoaderProp) {
  const loaderRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!loaderRef.current) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onIntersect()
        }
      })
    })

    observer.observe(loaderRef.current)

    return () => {
      observer.disconnect()
    }
  }, [onIntersect])

  return (
    <div
      ref={loaderRef}
      key="loader"
      className="mb-4"
    >
      <button
        className="text-white text-center block w-full border p-6"
        onClick={onClick}
      >
        load more
      </button>
    </div>
  )
}

function EndlessColor () {
  const [colors, setColors] = useState<Color[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getRandomInt = (lessThan: number) => Math.floor(Math.random() * lessThan)

  const getColorName = (hue: number) => {
    switch (true) {
      case hue < 12:
        return 'redish'
      case hue < 36:
        return 'orangish'
      case hue < 70:
        return 'yellowish'
      case hue < 160:
        return 'greenish'
      case hue < 260:
        return 'bluish'
      case hue < 290:
        return 'purplish'
      case hue < 340:
        return 'pinkish'
      default:
        return 'redish'
    }
  }

  const loadColor = () => {
    setIsLoading(true)
    setColors((prev) => {
      const hue = getRandomInt(360)
      const saturation = getRandomInt(100)
      const lightness = getRandomInt(100)

      return prev.concat({
        hue,
        saturation,
        lightness,
        name: getColorName(hue)
      })
    })
    setTimeout(() => {
      setIsLoading(false)
    }, 10)
  }

  const toHslString = (color: Color) => {
    return `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`
  }

  const getTextColor = (color: Color) => {
    const hue = (color.hue + 360 / 2) % 360
    const saturation = (color.saturation + 100 / 2) % 100
    const lightness = (color.lightness + 100 / 2) % 100

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  return (
    <>
      <main className="bg-black min-h-full">
        <div>
          <div>
            {colors.map((color, index) => (
              <div
                key={index}
                className="px-4 py-6 mb-0"
                style={{ backgroundColor: toHslString(color) }}
              >
                <span
                  className="font-regular"
                  style={{ color: getTextColor(color) }}
                >
                  { toHslString(color) }
                </span>
              </div>
            ))}
          </div>
          {
            !isLoading && (
              <Loader
                onIntersect={loadColor}
                onClick={loadColor}
              />
            )
          }
        </div>
      </main>
    </>
  )
}

export default EndlessColor;
