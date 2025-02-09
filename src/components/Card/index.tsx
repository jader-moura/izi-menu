'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Product } from '@/payload-types'

import { ImageMedia } from '../Media/ImageMedia'

export type CardProductData = Pick<Product, 'slug' | 'categories' | 'meta' | 'title' | 'price'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardProductData
  relationTo?: 'products'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title, price } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer p-4',
        className,
      )}
      ref={card.ref}
    >
      {typeof metaImage === 'number' || typeof metaImage?.url !== 'string' ? (
        <div className="">No image</div>
      ) : (
        <div className="relative w-full h-64">
          <ImageMedia
            alt={titleToUse || 'Product card image'}
            size="33vw"
            fill
            imgClassName="object-contain"
            // @ts-ignore
            src={metaImage?.url}
          />
        </div>
      )}
      {showCategories && hasCategories && (
        <div className="uppercase text-sm mb-4">
          {showCategories && hasCategories && (
            <div>
              {categories?.map((category, index) => {
                if (typeof category === 'object') {
                  const { title: titleFromCategory } = category

                  const categoryTitle = titleFromCategory || 'Untitled category'

                  const isLast = index === categories.length - 1

                  return (
                    <Fragment key={index}>
                      {categoryTitle}
                      {!isLast && <Fragment>, &nbsp;</Fragment>}
                    </Fragment>
                  )
                }

                return null
              })}
            </div>
          )}
        </div>
      )}
      {titleToUse && (
        <div className="prose">
          <h3>
            <Link className="not-prose" href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        </div>
      )}
      {description && (
        <div className="mt-2 opacity-75">{description && <p>{sanitizedDescription}</p>}</div>
      )}
      {price && (
        <p className="mt-2 text-main font-bold text-base">
          R$ {price?.toString().replace('.', ',')}
        </p>
      )}
    </article>
  )
}
