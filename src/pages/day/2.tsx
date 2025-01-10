import React from 'react'
import Head from 'next/head'
import SpaceshipGame from '@/components/SpaceshipGame'

export default function Day2 () {
  return (
    <>
     <Head>
        <title>Day 2 - Spaceship pew pew</title>
      </Head>
      <main
        style={{
          height: '100vh',
          background: 'black',
          display: 'grid',
          placeItems: 'center'
        }}
      >
        <SpaceshipGame />
      </main>
    </>
  )
}
