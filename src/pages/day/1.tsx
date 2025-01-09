import React from 'react'
import Head from 'next/head'
import ResponsiveCanvas from '@/components/ResponsiveCanvas'

export default function Day1 () {
  return (
    <>
      <Head>
        <title>Day 1 - Responsive Canvas</title>
      </Head>
      <main>
        <ResponsiveCanvas />
      </main>
    </>
  )
}
