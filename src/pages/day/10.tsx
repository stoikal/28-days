import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import classNames from 'classnames'

type Window = {
  SpeechRecognition?: any
  webkitSpeechRecognition?: any
}

type ChatItemType = 'input' | 'response' | 'error'

type ChatItem = {
  type: ChatItemType
  message: string
}

export default function Day10 () {
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([])
  const [isListening, setIsListening] = useState(false)

  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const w = window as Window
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition

    let recognition = null

    if (SpeechRecognition) {
      recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.lang = 'id-ID'
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onresult = (e:any) => {
        const result = e.results[0][0].transcript
        pushInput(result)
      }

      recognition.onaudiostart = function () {
        setIsListening(true)
      }

      recognition.onaudioend = function () {
        setIsListening(false)
      }

      recognition.onerror = function () {
        pushError('Terjadi kesalahan!')
      }

      pushResponse('Silakan tekan tombol mikrofon dan mulai berbicara!')
    } else {
      pushResponse('Nampaknya browser kamu tidak mendukung SpeechRecognition API!')
    }

    recognitionRef.current = recognition
  }, [])

  useEffect(() => {
    const lastItem = chatHistory[chatHistory.length - 1]

    if (lastItem && lastItem.type === 'input') {
      const index = chatHistory.length

      // pseudo loading
      pushResponse('...')

      scrollTo(0, document.body.scrollHeight)

      setTimeout(() => {
        setChatHistory(prev => [
          ...prev.slice(0, index),
          {
            type: 'response' as ChatItemType,
            message: generateResponse()
          },
          ...prev.slice(index + 1)
        ])
      }, 500)
    }
  }, [chatHistory])

  const startRecognition = () => {
    const recognition = recognitionRef.current

    if (recognition) {
      recognition.start()
    }
  }

  const stopRecognition = () => {
    const recognition = recognitionRef.current

    if (recognition) {
      recognition.stop()
    }
  }

  const generateResponse = () => {
    const str = [
      'ya begitulah',
      'lalu?',
      'aku tidak yakin',
      'bagaikan buah simalakama',
      'kita coba lagi besok!',
      'mungkin...',
      'kau yakin?',
      'mungkin saja',
      'meragukan',
      'tak ada yang pasti',
      'tak ada yang abadi di dunia ini',
      'aku akan menjawabnya saat aku telah lebih bijaksana nanti',
      'itu rahasia',
      'aku tidak tahu',
      'tak ada yang tahu',
      '42',
      'bro...',
      'jika saja bisa kuulang waktu',
      'semua tak lagi sama',
      'aku bukan siapa-siapa'
    ]

    const randomInt = Math.floor(Math.random() * str.length)

    return str[randomInt]
  }

  const pushInput = (message: string) => {
    setChatHistory(prev => [...prev, {
      type: 'input',
      message
    }])
  }

  const pushResponse = (message: string) => {
    setChatHistory(prev => [...prev, {
      type: 'response',
      message
    }])
  }

  const pushError = (message: string) => {
    setChatHistory(prev => [...prev, {
      type: 'error',
      message
    }])
  }

  return (
    <>
      <Head>
        <title>Day 10 - Pengenalan Suara</title>
      </Head>
      <main className="bg-gray-800">
        <div
          className="text-white max-w-xl mx-auto min-h-screen pt-6 pb-24"
        >
          {
            chatHistory.map((chatItem, index) => (
              <div
                key={index}
                className={
                  classNames(
                    'p-4', 'flex',
                    {
                      'justify-end': chatItem.type === 'input',
                      'justify-start': chatItem.type === 'response' || chatItem.type === 'error'
                    }
                  )
                }
              >
                <div
                  className={
                    classNames('border py-2 px-4 rounded-xl', {
                      'ml-4 md:ml-24 bg-gray-700 ': chatItem.type === 'input',
                      'mr-4 md:mr-24': chatItem.type === 'response',
                      'mr-4 md:mr-24 bg-red-700': chatItem.type === 'error'
                    })
                  }
                >
                  {chatItem.message}
                </div>
              </div>
            ))
          }

        </div>
        <div className="text-center text-white fixed bottom-0 w-full p-6">
          {
            isListening && (
              <button
                type="button"
                className="border p-2 rounded-full bg-red-700"
                onClick={stopRecognition}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
                    />
                  </svg>
              </button>
            )
          }
          {
            !isListening && (
              <button
                type="button"
                className="border p-2 rounded-full bg-gray-800"
                onClick={startRecognition}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
            )
          }
        </div>
      </main>
    </>
  )
}
