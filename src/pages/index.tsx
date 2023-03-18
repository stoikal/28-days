import Head from 'next/head'
import NextLink from 'next/link'
// import Image from 'next/image'
// import { Inter } from '@next/font/google'
// import styles from '@/styles/Home.module.css'

// const inter = Inter({ subsets: ['latin'] })

const content = [
  { title: 'Responsive Canvas', subtitle: 'Canvas API' },
  { title: 'spacehip pew pew', subtitle: 'Canvas API' },
  { title: 'Overly Attached Page', subtitle: 'Page Visibility API' },
  { title: 'v i b r a t e', subtitle: 'Vibration API' },
  { title: 'Synth', subtitle: 'Web Audio API' },
  { title: 'Fullscreen Mangosteen', subtitle: 'Fullscreen API' },
  { title: 'WheelEvent', subtitle: 'WheelEvent' },
  { title: 'BroadcastChannel', subtitle: 'BroadcastChannel API' },
  { title: 'Battery', subtitle: 'Battery API' },
  { title: 'Pengenalan Suara', subtitle: 'Web Speech API' },
  { title: 'Simple Puzzle', subtitle: 'Drag and Drop API' },
  { title: 'Notification', subtitle: 'Notifications API' },
  { title: 'location', subtitle: 'Geolocation API' },
  { title: 'ResizeObserver', subtitle: 'ResizeObserver API' },
  { title: 'selection', subtitle: 'Selection API' },
  { title: 'GET IP', subtitle: 'Fetch API' },
  { title: 'Endless Colors', subtitle: 'Intersection Observer API' },
  { title: 'This Way Up', subtitle: 'Device Orientation Events' },
  { title: 'Game of Life', subtitle: 'Canvas API' },
  { title: 'video', subtitle: 'Picture-in-Picture ' }
  // { title: 'Color Collection', subtitle: 'Fetch API' },
  // { title: '-', subtitle: 'Clipboard API' },
  // { title: '-', subtitle: '' },
  // { title: '-', subtitle: '' },
  // { title: '-', subtitle: '' },
  // { title: 'Saron', subtitle: 'Web Audio API' },
  // { title: '-', subtitle: '' },
  // { title: '-', subtitle: '' }
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
            <a href="https://developer.mozilla.org/en-US/docs/Web/API">28 Days of  Web APIs</a>
          </h1>
          <div className="border border-gray-400 p-4">
            <h2 className="text-xl mb-2">Contents:</h2>
            <ul className="bg-white">
              {
                content.map((item, index) => (
                  <li
                    key={index}
                    className="mb-1 hover:underline decoration-dotted"
                  >
                    <NextLink
                      href={`/day/${index + 1}`}
                      className="flex"
                    >
                      <div>
                        <span>{index + 1}.&nbsp;</span>
                      </div>
                      <div className="flex flex-wrap">
                        <span className="break-keep">{item.title}&nbsp;</span>
                        <span className="break-keep text-gray-400">({item.subtitle})</span>
                      </div>
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
