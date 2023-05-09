import Head from 'next/head'
import { ChangeEvent, useEffect, useState } from 'react'

export default function Day25 () {
  const [input, setInput] = useState('https://www.example.com:443/path/to/resource?sort=ascending')
  const [, setError] = useState('')
  const [url, setUrl] = useState<URL | null>(null)

  useEffect(() => {
    setError('')
    setUrl(null)

    try {
      const url = new URL(input)
      setUrl(url)
    } catch {
      setError('Invalid URL')
    }
  }, [input])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setInput(value)
  }

  const getDomainPrefix = (url: URL) => {
    const { protocol, origin, host } = url
    const prefix = origin
      .replace(host, '')
      .replace(protocol, '')

    return prefix
  }

  const getPortPrefix = (url: URL) => {
    const { port } = url
    return port ? ':' : ''
  }

  return (
    <>
      <Head>
        <title>Day 25 - URL Anatomy</title>
      </Head>
      <main>
        <div className="max-w-4xl mx-auto p-6">
          <input
            value={input}
            type="text"
            className="border"
            onChange={handleInputChange}
          />
          <br/>

          {url && (
            <p className="text-2xl">
              <span className="text-red-600">{url.protocol}</span>
              <span className="text-gray-500">{getDomainPrefix(url)}</span>

              <span>
                <span className="text-green-600">{url.hostname}</span>
                <span className="text-gray-500">{getPortPrefix(url)}</span>
                <span className="text-purple-600">{url.port}</span>
              </span>

              <span className="text-yellow-600">{url.pathname}</span>
              <span className="text-blue-600">{url.search}</span>
              <span className="text-pink-600">{url.hash}</span>
            </p>
          )}
        </div>
      </main>
    </>
  )
}
