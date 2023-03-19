import Head from 'next/head'
import rawEmojiList from '@/data/emoji.json'
import { useMemo, useState, useRef, ChangeEvent } from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

type MyPageProps = {
  initialSearch: string
}

type Emoji = {
  no: string
  code: string
  emoji: string
  cldrShortName: string
  keywords: string[]
  category: string
  subcategory: string
}

type Subcategory = Record<string, Emoji[]>
type Category = Record<string, Subcategory>

export default function Day21 ({ initialSearch }: MyPageProps) {
  const [search, setSearch] = useState(initialSearch)
  const [emojiCopied, setEmojiCopied] = useState<string | null>(null)

  const snackbarRef = useRef<HTMLDivElement | null>(null)
  const timeoutIdRef = useRef<any>(null)

  const filteredEmojiList = useMemo(() => {
    if (!search) return rawEmojiList

    return rawEmojiList.filter((emoji) => {
      const searchValue = search.toLowerCase()
      return (
        emoji.cldrShortName.toLowerCase().includes(searchValue) ||
        emoji.keywords.some((keyword) => keyword.toLowerCase().includes(searchValue))
      )
    })
  }, [search])

  const byCategoryEmojiList = useMemo<Category>(() => {
    return filteredEmojiList
      .reduce((res: Record<string, any>, item: Emoji) => {
        return {
          ...res,
          [item.category]: {
            ...res[item.category],
            [item.subcategory]: [
              ...res[item.category]?.[item.subcategory] || [],
              item
            ]
          }
        }
      }, {})
  }, [filteredEmojiList])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
  }

  const createClickHandler = (emoji: string) => () => {
    navigator.clipboard.writeText(emoji)
    setEmojiCopied(emoji)
    showSnackbar()
  }

  const showSnackbar = () => {
    clearTimeout(timeoutIdRef.current)
    const snackbar = snackbarRef.current

    snackbar?.classList.remove('hidden')

    timeoutIdRef.current = setTimeout(() => {
      snackbar?.classList.add('hidden')
    }, 4000)
  }

  return (
    <>
      <Head>
        <title>Day 21 - Emoji</title>
      </Head>
      <main className="relative">
        <div className="w-full sticky top-0 bg-white drop-shadow-sm">
          <div className='max-w-4xl mx-auto p-4'>
            <input
              value={search}
              placeholder="search"
              type="text"
              className="w-full sm:w-2/3 md:w-1/2 max-w-full border px-3 py-2"
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="max-w-4xl mx-auto p-4">
          <div>
            {
              Object.entries(byCategoryEmojiList).map(([category, subcategories]) => (
                <div key={category}>
                  <h2 className="text-xl font-bold mb-1">{category}</h2>
                  <div>
                    {
                      Object.entries(subcategories).map(([subcategory, items]) => (
                        <div
                          key={category + subcategory}
                          className="mb-5"
                        >
                          <h3 className="text-lg font-bold mb-1">{subcategory}</h3>
                          <div className="flex flex-wrap">
                            {
                              items.map((emoji) => (
                                <div
                                  key={emoji.no}
                                  className="w-1/2 sm:w-1/3 md:w-1/4 px-2 pt-6 pb-3 border"
                                >
                                  <div className="text-6xl text-center">
                                    <span
                                      role="button"
                                      className="inline-block hover:-translate-y-1 select-none"
                                      onClick={createClickHandler(emoji.emoji)}
                                    >
                                      {emoji.emoji}
                                    </span>
                                  </div>
                                  <div className="text-center">
                                    <span className="leading-none">
                                      {emoji.cldrShortName}
                                    </span>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div
          ref={snackbarRef}
          className="hidden fixed left-1/2 -translate-x-1/2 bottom-6 bg-black px-4 py-2 rounded text-white text-center"
        >
          {emojiCopied} copied to clipboard!
        </div>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<MyPageProps> = async (context: GetServerSidePropsContext) => {
  const { query: { q } } = context

  return {
    props: {
      initialSearch: String(q || '')
    }
  }
}
