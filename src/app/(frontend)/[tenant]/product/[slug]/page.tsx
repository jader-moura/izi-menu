import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Product } from '@/payload-types'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{
    slug: string
    tenant: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug, tenant } = await paramsPromise
  const product = await getTenantProductBySlug(tenant, slug)

  return (
    <div className="pb-6">
      <PageClient product={product} tenant={tenant} />
    </div>
  )
}

async function getTenantProductBySlug(tenantSlug: string, slug: string) {
  const payload = await getPayload({ config: configPromise })
  const product = await payload.find({
    collection: 'products',
    depth: 5,
    limit: 1,
    overrideAccess: true,
    where: {
      'tenant.slug': {
        equals: tenantSlug,
      },
      slug: {
        equals: slug,
      },
    },
  })

  if (!product.docs[0]) {
    throw new Error('Product not found')
  }
  return product.docs[0] as Product
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Products`,
  }
}
