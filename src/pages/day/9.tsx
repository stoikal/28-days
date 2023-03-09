import Head from 'next/head'
import { useEffect, useState } from 'react'

type Battery = {
  addEventListener: () => any
}

type GetBattery = () => Promise<Battery>

type ExtNavigator = {
  getBattery: GetBattery
}

export default function Day9 () {
  const [level, setLevel] = useState(0)
  const [isCharging, setIsCharging] = useState(false)
  const [isPercentageShown, setIsPercentageShown] = useState(false)

  useEffect(() => {
    const n = navigator as unknown as ExtNavigator

    if (typeof n.getBattery === 'function') {
      n.getBattery()
        .then((battery: any) => {
          battery.addEventListener('levelchange', () => {
            setLevel(battery.level * 100)
          })

          battery.addEventListener('chargingchange', () => {
            setIsCharging(battery.charging)
          })

          setLevel(battery.level * 100)
          setIsCharging(battery.charging)
        })
    }
  }, [])

  return (
    <>
      <Head>
        <title>Day 9</title>
      </Head>
      <main className="h-full flex justify-center items-center">
        <div className="w-full max-w-xl aspect-square relative">
          <div className="battery-head" />
          <div
            className="battery-wrapper"
            role="button"
            onClick={() => setIsPercentageShown(!isPercentageShown)}
          >
            <div className="battery-content"/>
            {
              isPercentageShown && !isCharging && (
                <span className="battery-percentage">
                  {level}%
                </span>
              )
            }
            {
              isCharging && (
                <svg width="64" height="64" className="battery-carging-indicator">
                  <polygon
                    points="
                      40,0
                      12,38 30,38
                      24,64
                      52,26 34,26
                    "
                    fill="black"
                    stroke="white"
                    stroke-width="2"
                  />
                </svg>
              )
            }
          </div>
        </div>
      </main>
      <style jsx>{`
        .battery-head {
          position: absolute;
          top: 14.5%;
          left: 50%;
          width: 10%;
          height: 5%;
          transform: translate(-50%, -50%);
          background-color: black;
          border-radius: 4px 4px 0 0;
        }

        .battery-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 2px solid black;
          width: 40%;
          height: 70%;
          border-radius: 8px;
          overflow: hidden;
          background-color: white;
        }

        .battery-content {
          position: absolute;
          bottom: 0;
          background-color: black;
          height: ${level}%;
          width: 100%;
        }

        .battery-percentage {
          font-size: 20px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: black;
          user-select: none;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
        }

        .battery-carging-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </>
  )
}
