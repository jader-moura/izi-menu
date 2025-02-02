'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import Image from 'next/image'

interface IziHeaderClientProps {
  data: Header
}

export const IziHeaderClient: React.FC<IziHeaderClientProps> = () => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className="container relative z-20   " {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-8 flex justify-between">
        <Link href="/">
          <Image
            alt="IZI MENU Logo"
            width={193}
            height={34}
            decoding="async"
            className="max-w-[9.375rem] w-full h-[34px]"
            src="/izi/logo.png"
          />
        </Link>
        <nav className="flex gap-6 items-center">
          <Link href="/admin" className="border py-1 px-3 border-black dark:border-white">
            Entrar
          </Link>
          <Link href="/search" className="bg-main text-white border py-1 px-3 border-main">
            Cadastre-se
          </Link>
        </nav>
      </div>
    </header>
  )
}
