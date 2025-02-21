import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode, headers } from 'next/headers'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import '../globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { Store } from '@/payload-types'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const { slug, store } = await getStoreBySlug()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header slug={slug} store={store} />
          {children}
          <Footer slug={slug} store={store} />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}

async function getStoreBySlug() {
  const headersList = headers()
  const fullUrl = (await headersList)?.get('referer') || ''
  const slug = fullUrl.split('/')[3] || ''

  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'stores',
    draft: false,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    depth: 1,
    where: {
      'tenant.slug': {
        equals: slug,
      },
    },
  })

  const store: Store = docs[0] || ({} as Store)

  return { store, slug }
}
