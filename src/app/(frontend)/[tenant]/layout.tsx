import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React, { Suspense } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import '../globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { Store } from '@/payload-types'

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tenant: string }
}) {
  const { tenant: slug } = await params
  const { isEnabled } = await draftMode()
  const { store } = await getStoreBySlug(slug)

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

          <Suspense fallback={<div>Loading...</div>}>
            <Header slug={slug} store={store} />
          </Suspense>
          {children}
          <Suspense fallback={<div>Loading...</div>}>
            <Footer slug={slug} store={store} />
          </Suspense>
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

async function getStoreBySlug(slug: string) {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'stores',
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      'tenant.slug': {
        equals: slug,
      },
    },
  })

  const store: Store = docs[0] || ({} as Store)

  return { store }
}
