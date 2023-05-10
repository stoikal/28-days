import Head from 'next/head'
import { ChangeEvent, useEffect, useState } from 'react'

type PartProps = {
  children: string
  type: string
}

function Part ({ children, type }: PartProps) {
  const colors: Record<string, string> = {
    protocol: 'text-red-600',
    hostname: 'text-green-600',
    pathname: 'text-yellow-600',
    port: 'text-purple-600',
    search: 'text-blue-600',
    hash: 'text-pink-600'
  }

  const color = colors[type]

  const labels: Record<string, string> = {
    protocol: 'protocol',
    hostname: 'domain',
    pathname: 'path',
    port: 'port',
    search: 'query',
    hash: 'hash'
  }

  const label = labels[type]

  return (
    <div className="mb-2">
      <div className={`text-2xl flex-none ${color}`}>
        {children}
      </div>
      {children && <div>{label}</div>}
    </div>
  )
}

export default function Day25 () {
  const [input, setInput] = useState('https://www.example.com/path/to/resource?sort=ascending')
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

    if (!origin || origin === 'null') return ''

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
            id="urlInput"
            value={input}
            type="text"
            className="rounded border mb-4 px-4 py-2 w-96 max-w-full"
            onChange={handleInputChange}
          />
          <br/>

          {url && (
            <div className="flex flex-wrap">
              <Part type="protocol">{url.protocol}</Part>
              <div className="text-2xl text-gray-500">
                {getDomainPrefix(url)}
              </div>

              <Part type="hostname">{url.hostname}</Part>
              <div className="text-2xl text-gray-500">
                {getPortPrefix(url)}
              </div>
              <Part type="port">{url.port}</Part>

              <Part type="pathname">{url.pathname}</Part>
              <Part type="search">{url.search}</Part>
              <Part type="hash">{url.hash}</Part>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
