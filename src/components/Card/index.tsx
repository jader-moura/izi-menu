'use client'
import { cn } from '@/utilities/ui'
import React from 'react'

import type { Product } from '@/payload-types'

import { ImageMedia } from '../Media/ImageMedia'

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: Product
  relationTo?: 'products'
  title?: string
}> = (props) => {
  const { className, doc, title: titleFromProps } = props

  const { title, price, image, description, salePrice } = doc || {}

  const titleToUse = titleFromProps || title

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer p-4 flex align-center gap-3',
        className,
      )}
    >
      <div className="flex-1 flex flex-col justify-center">
        {titleToUse && (
          <div className="prose">
            <h3>{titleToUse}</h3>
          </div>
        )}
        {description && <div className="mt-2 opacity-75 text-sm">{description}</div>}
        <div className="mt-2 flex items-center gap-2">
          {price && (
            <p
              className={
                salePrice ? 'text-base line-through font-thin' : 'text-main font-bold text-base'
              }
            >
              R$ {price?.toString().replace('.', ',')}
            </p>
          )}
          {salePrice && (
            <p className="text-main font-bold text-base">
              R$ {salePrice?.toString().replace('.', ',')}
            </p>
          )}
        </div>
      </div>
      {typeof image === 'number' || typeof image?.url !== 'string' ? (
        <div className="">No image</div>
      ) : (
        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
          <ImageMedia
            alt={titleToUse || 'Product card image'}
            size="33vw"
            fill
            imgClassName="object-contain"
            // @ts-ignore
            src={image?.url}
          />
        </div>
      )}
    </article>
  )
}
