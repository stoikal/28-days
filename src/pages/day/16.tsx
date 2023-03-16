import { useState } from 'react'
import Head from 'next/head'
import isEmpty from 'lodash/isEmpty'

export default function Day16 () {
  const [ip, setIp] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const getIp = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      console.log('===~res~===', res)
      setIp(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Day 16 - GET IP</title>
      </Head>
      <main>
        <div className="text-center p-3">
          <button
            className="px-3 py-2 border hover:bg-gray-100"
            type="button"
            disabled={isLoading}
            onClick={getIp}
          >
            { isLoading ? 'loading...' : 'GET IP' }
          </button>
        </div>
        <div className="p-3">
          { !isEmpty(ip) && (
            Object.entries(ip).map(([key, value]) => (
              <div
                key={key}
                className="flex pb-1"
              >
                <div className="flex-1 text-gray-600 text-right">
                  { key }&nbsp;
                </div>
                <div className="flex-1">
                  { String(value as string) }
                </div>
              </div>
            ))
          ) }
        </div>
      </main>
    </>
  )
}
