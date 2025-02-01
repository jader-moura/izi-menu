import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Page as PageType } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { notFound } from 'next/navigation'

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
      tenant: true,
    },
  })

  const params = pages.docs
    ?.filter((doc: any) => {
      return doc.slug !== 'home'
    })
    .map((doc: any) => {
      const tenant = typeof doc.tenant === 'object' ? doc.tenant : null
      return {
        slug: doc.slug,
        tenant: tenant?.slug || '',
      }
    })
    .filter((param) => param.tenant) // Filter out any entries without a valid tenant slug

  return params
}

type Args = {
  params: Promise<{
    slug?: string
    tenant: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home', tenant } = await paramsPromise

  const page = await queryPageBySlug({
    slug,
    tenant,
  })

  if (!page) {
    return notFound()
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} tenant={tenant} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home', tenant } = await paramsPromise
  const page = await queryPageBySlug({
    slug,
    tenant,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug, tenant }: { slug: string; tenant: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  try {
    // First find the tenant to get its ID
    const tenantQuery = await payload.find({
      collection: 'tenants',
      where: {
        slug: {
          equals: tenant,
        },
      },
      limit: 1,
    })

    const tenantId = tenantQuery.docs[0]?.id

    if (!tenantId) {
      return null
    }

    // Then query the page with the tenant ID
    const result = await payload.find({
      collection: 'pages',
      where: {
        and: [
          {
            tenant: {
              equals: tenantId,
            },
          },
          {
            slug: {
              equals: slug,
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
