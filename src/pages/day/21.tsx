import Head from 'next/head'
import rawEmojiList from '@/data/emoji.json'
import { useMemo, useState, ChangeEvent } from 'react'

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

export default function Day21 () {
  const [search, setSearch] = useState('')

  const filteredEmojiList = useMemo(() => {
    if (!search) return rawEmojiList

    return rawEmojiList.filter((emoji) => {
      const searchValue = search.toLowerCase()
      return (
        emoji.cldrShortName.includes(searchValue) ||
        emoji.keywords.some((keyword) => keyword.includes(searchValue))
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

  return (
    <>
      <Head>
        <title>Day 21 - Emoji</title>
      </Head>
      <main>
        <div className="max-w-4xl mx-auto p-4">
          <div className="pb-6">
            <input
              value={search}
              placeholder="search"
              type="text"
              className="w-full sm:w-2/3 md:w-1/2 max-w-full border px-3 py-2"
              onChange={handleSearchChange}
            />
          </div>
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
                                  className="w-1/2 sm:w-1/3 md:w-1/4 p-3 border"
                                >
                                  <div className="text-6xl text-center">
                                    {emoji.emoji}
                                  </div>
                                  <div className="text-center">
                                    {emoji.cldrShortName}
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
      </main>
    </>
  )
}
