import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Page as PageType } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { notFound } from 'next/navigation'
import PageClient from '../page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  // Get all tenants
  const tenants = await payload.find({
    collection: 'tenants',
    draft: false,
    limit: 0,
    overrideAccess: true,
    pagination: false,
    depth: 1,
    select: {
      slug: true,
    },
  })

  const params = tenants.docs.map((tenant: any) => ({
    tenant: tenant.slug,
  }))

  return params
}

type Args = {
  params: Promise<{
    tenant: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { tenant } = await paramsPromise

  const page = await queryTenantHomePage({
    tenant,
  })

  if (!page) {
    return notFound()
  }

  const { hero, layout } = page

  return (
    <article className="pt-4 pb-20">
      <PageClient />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} tenant={tenant} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { tenant } = await paramsPromise
  const page = await queryTenantHomePage({ tenant })

  return generateMeta({ doc: page })
}

const queryTenantHomePage = cache(async ({ tenant }: { tenant: string }) => {
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
              equals: 'home',
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
