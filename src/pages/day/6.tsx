import Head from 'next/head'
import { MouseEvent, useEffect, useState } from 'react'
import debounce from 'lodash/debounce'

type Image = {
  url: string
  by: string
  site: string
  link?: string
}

const images: Image[] = [
  {
    url: '/mangosteen/garytamin-freeimages-2.jpg',
    by: 'garytamin',
    site: 'FreeImages',
    link: 'https://www.freeimages.com/photographer/garytamin-39836'
  },
  {
    url: '/mangosteen/chinh_le_duc-unsplash-1.jpg',
    by: 'Chinh Le Duc',
    site: 'Unsplash',
    link: 'https://unsplash.com/@mero_dnt'
  },
  {
    url: '/mangosteen/art_rachen-unsplash-1.jpg',
    by: 'Art Rachen',
    site: 'Unsplash',
    link: 'https://unsplash.com/@artrachen'
  },
  {
    url: '/mangosteen/hakeem_james_hausley-pexels-1.jpg',
    by: 'Hakeem James Hausley',
    site: 'Pexels',
    link: 'https://www.pexels.com/@jameshausley/'
  },
  {
    url: '/mangosteen/art_rachen-unsplash-2.jpg',
    by: 'Art Rachen',
    site: 'Unsplash',
    link: 'https://unsplash.com/@artrachen'
  },
  {
    url: '/mangosteen/garytamin-freeimages-1.jpg',
    by: 'garytamin',
    site: 'FreeImages',
    link: 'https://www.freeimages.com/photographer/garytamin-39836'
  },

  {
    url: '/mangosteen/ivar_leidus-wikipedia-1.jpg',
    by: 'Ivar Leidus',
    site: 'Wikipedia',
    link: 'https://commons.wikimedia.org/wiki/User:Iifar'
  },
  {
    url: '/mangosteen/kingkonadventure-pexels-1.jpg',
    by: 'kingkonadventure',
    site: 'FreeImages',
    link: 'https://www.pexels.com/@kingkonadventure-173187529/'
  },
  {
    url: '/mangosteen/roman_odintsov-pexels-1.jpg',
    by: 'Roman Odintsov',
    site: 'Pexels',
    link: 'https://www.pexels.com/@roman-odintsov/'
  },
  {
    url: '/mangosteen/skyler_ewing-pexels-1.jpg',
    by: 'Skyler Ewing',
    site: 'Pexels',
    link: 'https://www.pexels.com/@skyler-ewing-266953/'
  }
]

export default function Day6 () {
  const [columns, setColumns] = useState(3)

  useEffect(() => {
    const calculateColumns = () => {
      const breakpoints = {
        sm: 640,
        lg: 1024
      }

      if (innerWidth >= breakpoints.lg) {
        setColumns(3)
      } else if (innerWidth >= breakpoints.sm) {
        setColumns(2)
      } else {
        setColumns(1)
      }
    }

    const handleResize = debounce(calculateColumns, 100)

    window.addEventListener('resize', handleResize)
    calculateColumns()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const groupedImages = (() => {
    const groups: Image[][] = Array.from({ length: columns }).map(() => [])

    images.forEach((image, index) => {
      const groupIndex = index % columns

      groups[groupIndex].push(image)
    })

    return groups
  })()

  const handleClick = (e: MouseEvent) => {
    const el = e.target as HTMLDivElement

    el.requestFullscreen()
  }

  return (
    <>
      <Head>
        <title>Day 6 - Fullscreen Mangosteen</title>
      </Head>
      <main
        className="max-w-7xl mx-auto"
      >
        <div
          className="flex p-3"
        >
          {
            groupedImages.map((group, groupIndex) => (
              <div
                className='flex-grow'
                key={groupIndex}
              >
                {group.map((image: Image, imageIndex: number) => (
                  <div
                    key={imageIndex}
                    className="p-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={`mangoosten ${imageIndex}`}
                      onClick={handleClick}
                      role="button"
                    />
                    <div className="bg-gray-100 text-gray-600 text-right px-1 pb-1">
                      <small>
                        by&nbsp;
                        <a href={image.link}>
                          <u>{image.by}</u>
                        </a>
                        &nbsp;on {image.site}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ))
          }

        </div>
      </main>

      <style jsx>{`cover
        img:fullscreen {
          object-fit: contain;
        }

        .photo-overlay {
          {/* display: none; */}
        }

        .photo-overlay:fullscreen {
          display: block
        }
      `}</style>
    </>
  )
}
