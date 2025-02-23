'use client'
import React, { useRef } from 'react'
import { Card } from '@/components/Card'
import { Product } from '@/payload-types'

export type Props = {
  products: Product[]
}

export const CollectionArchive: React.FC<Props> = ({ products }) => {
  const groupByCategory = (products: Product[]) => {
    return products.reduce(
      (acc, product) => {
        product.categories?.forEach((category) => {
          if (typeof category !== 'number' && category.title && !acc[category.title]) {
            acc[category.title] = []
          }
          if (typeof category !== 'number' && category.title) {
            acc[category.title]?.push(product)
          }
        })
        return acc
      },
      {} as { [key: string]: Product[] },
    )
  }

  const categorizedProducts = groupByCategory(products)
  const navRef = useRef<HTMLDivElement>(null)

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId)
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="container flex flex-col gap-4">
      <div ref={navRef} className="sticky top-0 z-10">
        <div className="flex overflow-x-auto no-scrollbar gap-4 bg-background py-2">
          {Object.keys(categorizedProducts).map((category) => (
            <button
              key={category}
              className="text-sm md:text-base font-semibold hover:underline hover:text-main transition-colors"
              onClick={() => scrollToCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      {Object.entries(categorizedProducts).map(([category, products]) => (
        <div id={category} key={category}>
          <h2 className="text-xl md:text-2xl pb-2 md:pb-4 font-bold">{category}</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
            {products.map((product, index) => (
              <div className="col-span-4" key={index}>
                <Card className="h-full" doc={product} relationTo="products" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
