'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { SearchIcon } from '@payloadcms/ui/icons/Search'
import { Logo } from '@/components/Logo'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

import type { Store } from '@/payload-types'

interface HeaderClientProps {
  store: Store
  slug: string
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ store, slug }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const today = dayjs().day() // Day of week as number 0-6 (Sun-Sat)

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  const getNextOpenTime = () => {
    for (let i = 0; i < 7; i++) {
      const checkDay = (today + i) % 7
      const dayName = dayjs().day(checkDay).format('dddd').toLowerCase()
      const hours = store.openingHours?.[dayName as keyof typeof store.openingHours]
      if (hours && !hours.isClosed && hours.open) {
        return dayjs(hours.open).format('HH:mm')
      }
    }
    return null
  }

  const todayHours =
    store.openingHours?.[
      dayjs().day(today).format('dddd').toLowerCase() as keyof typeof store.openingHours
    ]
  const isOpen =
    todayHours &&
    !todayHours.isClosed &&
    dayjs().isBetween(dayjs(todayHours.open), dayjs(todayHours.close))
  const nextOpenTime = getNextOpenTime()

  return (
    <>
      <header className="relative z-20 bg-main">
        <div className="container">
          <div className="py-2 flex justify-between">
            <Link href={slug} className="flex items-center gap-2">
              <Logo
                alt={store.name || ''}
                {...(typeof store.logo === 'object' &&
                store.logo &&
                'url' in store.logo &&
                typeof store.logo.url === 'string'
                  ? { src: store.logo.url }
                  : {})}
                loading="eager"
                priority="high"
                className="invert dark:invert-0"
              />
              <h1 className="uppercase font-bold text-base">{store.name}</h1>
            </Link>
            <div className="flex items-center gap-4">
              <button>
                <SearchIcon />
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="container">
        <div className="text-sm p-2 flex items-center gap-2 opacity-85">
          {isOpen ? (
            <p>Open now, closes at {dayjs(todayHours.close).format('HH:mm')}</p>
          ) : (
            <p>{nextOpenTime ? `Closed, opens at ${nextOpenTime}` : 'Closed today'}</p>
          )}
          <span>&bull;</span>
          {store.delivery?.minimumValue != null && store.delivery.minimumValue > 0 && (
            <p>Minimum delivery order: ${store.delivery.minimumValue}</p>
          )}
        </div>
      </div>
      {/* Additional content can go here */}
    </>
  )
}
