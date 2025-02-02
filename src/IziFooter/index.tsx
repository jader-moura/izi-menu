import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import Image from 'next/image'

export async function IziFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Image
            alt="IZI MENU Logo"
            width={193}
            height={34}
            decoding="async"
            className="max-w-[9.375rem] w-full h-[34px]"
            src="/izi/logo.png"
          />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
        </div>
      </div>
    </footer>
  )
}
