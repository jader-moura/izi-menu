import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers';

import type { Header } from '@/payload-types'

export async function Header() {

  const headersList = headers();
  const fullUrl = (await headersList)?.get('referer') || "";
  const slug = fullUrl.split("/")[3]
  
  const payload = await getPayload({ config: configPromise })

  const { docs: tenants } = await payload.find({
    collection: 'tenants',
    draft: false,
    limit: 0,
    overrideAccess: true,
    pagination: false,
    depth: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const tenantId = tenants[0]?.id


  const { docs } = await payload.find({
    collection: 'stores',
    draft: false,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    depth: 1,
    where: {
      tenant: {
        equals: tenantId,
      },
    },
  })

  if(!docs[0]) return null

  return <HeaderClient store={docs[0]} slug={slug} />
}
