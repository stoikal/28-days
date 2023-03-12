import { useState, ChangeEvent, useMemo } from 'react'
import Head from 'next/head'

export default function Day12 () {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const showNotification = () => {
    if (Notification.permission === 'granted') {
      // eslint-disable-next-line no-new
      new Notification(title, { body })
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(function (permission) {
        if (permission === 'granted') {
          // eslint-disable-next-line no-new
          new Notification('notificationMessage')
        }
      })
    }
  }

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleBodyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value)
  }

  const isDisabled = useMemo(() => !title || !body, [title, body])

  return (
    <>
      <Head>
        <title>Day 12 - Notification</title>
      </Head>
      <main className="min-h-screen">
        <div>
          <div className="p-5 text-center w-auto max-w-sm mx-auto">
            <input
              value={title}
              type="text"
              placeholder='title'
              className="border mb-3 py-2 px-3 w-full"
              onChange={handleTitleChange}
            />
            <br/>
            <textarea
              value={body}
              placeholder='body'
              className="border  mb-3 py-2 px-3 w-full"
              onChange={handleBodyChange}
            />
            <br/>
            <button
              type="button"
              className={`${isDisabled ? 'bg-gray-200' : 'bg-gray-500'} p-2 px-3 w-full`}
              disabled={isDisabled}
              onClick={showNotification}
            >
              <span className='text-white'>
                show notification
              </span>
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
