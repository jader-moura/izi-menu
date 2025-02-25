import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Page as PageType } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { notFound } from 'next/navigation'
import PageClient from '../page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  // Then get all pages
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    depth: 1,
    select: {
      slug: true,
    },
    where: {
      // slug: {
      //   equals: 'home',
      // },
      tenant: {
        equals: 1,
      },
    },
  })

  const params = pages.docs.map((doc: any) => {
    return {
      slug: doc.slug,
    }
  })

  return params
}

export default async function Page() {
  const { isEnabled: draft } = await draftMode()

  const page = await queryIziPage()

  if (!page) {
    return notFound()
  }

  const { layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />

      {draft && <LivePreviewListener />}

      <RenderBlocks blocks={layout} tenant="main-admin" />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryIziPage()

  return generateMeta({ doc: page })
}

const queryIziPage = cache(async () => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  try {
    // Then query the page with the tenant ID
    const result = await payload.find({
      collection: 'pages',
      where: {
        and: [
          {
            tenant: {
              equals: 1,
            },
          },
        ],
      },
      draft: draft,
      depth: 2,
      limit: 1,
    })

    const page = result.docs?.[0]
    return page ? (page as PageType) : null
  } catch (error) {
    console.error('Error querying page:', error)
    return null
  }
})
