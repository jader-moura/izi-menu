import type { Product, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
    tenant: string
  }
> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    tenant,
  } = props

  const limit = limitFromProps || 3

  let products: Product[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    // First get the tenant ID
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

    // Then query products with tenant filter
    const fetchedProducts = await payload.find({
      collection: 'products',
      depth: 1,
      limit,
      where: {
        and: [
          {
            tenant: {
              equals: tenantId,
            },
          },
          ...(flattenedCategories && flattenedCategories.length > 0
            ? [
                {
                  categories: {
                    in: flattenedCategories,
                  },
                },
              ]
            : []),
        ],
      },
    })

    products = fetchedProducts.docs
  } else {
    if (selectedDocs?.length) {
      const payload = await getPayload({ config: configPromise })

      // Get tenant ID
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

      // Filter selected products by tenant
      const selectedProductIds = selectedDocs.map((doc) => {
        if (typeof doc === 'string') return doc
        return doc.value
      })

      const fetchedProducts = await payload.find({
        collection: 'products',
        depth: 1,
        overrideAccess: true,
        where: {
          and: [
            {
              tenant: {
                equals: tenantId,
              },
            },
            {
              id: {
                in: selectedProductIds,
              },
            },
          ],
        },
      })

      products = fetchedProducts.docs
    }
  }

  return (
    <div id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ml-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive products={products} />
    </div>
  )
}
