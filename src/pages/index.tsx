import Head from 'next/head'
import NextLink from 'next/link'
// import Image from 'next/image'
// import { Inter } from '@next/font/google'
// import styles from '@/styles/Home.module.css'

// const inter = Inter({ subsets: ['latin'] })

const content = [
  { title: 'Day 1 - Responsive Canvas', subtitle: 'Canvas API' },
  { title: 'Day 2 - spacehip pew pew', subtitle: 'Canvas API' },
  { title: 'Day 3 - Overly Attached Page', subtitle: 'Page Visibility API' },
  { title: 'Day 4 - v i b r a t e', subtitle: 'Vibration API' },
  { title: 'Day 5 - Synth', subtitle: 'Web Audio API' },
  { title: 'Day 6 - Fullscreen Mangosteen', subtitle: 'Fullscreen API' },
  { title: 'Day 7 - WheelEvent', subtitle: 'WheelEvent' },
  { title: 'Day 8 - BroadcastChannel', subtitle: 'BroadcastChannel API' },
  { title: 'Day 9 - Battery', subtitle: 'Battery API' }
]

export default function Home () {
  return (
    <>
      <Head>
        <title>28 Days</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-4">
        <div
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-2xl mb-3">
            <a href="https://developer.mozilla.org/en-US/docs/Web/API">Learn Web APIs</a>
          </h1>
          <div className="border p-4">
            <h2 className="text-xl mb-2">Contents:</h2>
            <ul className="bg-white">
              {
                content.map((item, index) => (
                  <li
                    key={index}
                    className="mb-1 hover:underline decoration-dotted"
                  >
                    <NextLink href={`/day/${index + 1}`}>
                      {item.title}
                      <span className="text-gray-300">&nbsp;&nbsp;({item.subtitle})</span>
                    </NextLink>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </main>
    </>
  )
}
