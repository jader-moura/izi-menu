'use client'
import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { Product, ProductFlavour, ProductVariant, Media } from '@/payload-types'
import { toast } from 'react-hot-toast'

interface PageClientProps {
  product: Product
}

interface SelectedOptions {
  [variantId: number]: string[] // For additional options from productVariant
}

const PageClient = ({ product }: PageClientProps) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})
  const [selectedFlavours, setSelectedFlavours] = useState<string[]>([])
  // New state to hold the user-selected number of flavours
  const [flavourCount, setFlavourCount] = useState<number>(0)

  const hasSalePrice =
    !product.priceSetByFlavours && product.salePrice && product.salePrice < product.price

  const totalPrice = useMemo(() => {
    let basePrice = 0

    if (product.priceSetByFlavours && product.productFlavours && selectedFlavours.length > 0) {
      const selectedFlavourPrices =
        (product.productFlavours as ProductFlavour)?.options
          ?.filter((option) => option.id && selectedFlavours.includes(option.id))
          ?.map((option) => option.flavour.price || 0) || []
      basePrice = Math.max(...selectedFlavourPrices)
    } else {
      basePrice = hasSalePrice ? product.salePrice || 0 : product.price || 0
    }

    let sum = basePrice

    product.productVariant?.forEach((variant) => {
      const currentSelected = selectedOptions[(variant as ProductVariant).id] || []
      currentSelected.forEach((optionId) => {
        const foundOption = (variant as ProductVariant).options?.find(
          (option) => option.id === optionId,
        )
        if (foundOption) {
          sum += foundOption.aditional?.price || 0
        }
      })
    })

    return sum
  }, [product, hasSalePrice, selectedOptions, selectedFlavours])

  const handleToggleOption = (variantId: number, optionId: string) => {
    setSelectedOptions((prev) => {
      const current = prev[variantId] || []
      const variant = product.productVariant?.find(
        (variant) => (variant as ProductVariant).id === variantId,
      )
      const max = (variant as ProductVariant)?.atMostChoose ?? Infinity

      if (current.includes(optionId)) {
        return { ...prev, [variantId]: current.filter((id) => id !== optionId) }
      } else {
        if (current.length >= max) {
          toast.error(
            `You can select up to ${max} options for "${(variant as ProductVariant)?.title}".`,
          )
          return prev
        }
        return { ...prev, [variantId]: [...current, optionId] }
      }
    })
  }

  // When toggling a flavour, use the user-selected flavourCount as the max allowed.
  const handleToggleFlavour = (optionId: string) => {
    setSelectedFlavours((prev) => {
      if (flavourCount === 0) {
        toast.error('Please select the number of flavours first.')
        return prev
      }
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId)
      } else {
        if (prev.length >= flavourCount) {
          toast.error(`You can select up to ${flavourCount} flavour(s).`)
          return prev
        }
        return [...prev, optionId]
      }
    })
  }

  const handleAddToCart = () => {
    if (product.priceSetByFlavours && product.productFlavours) {
      if (flavourCount === 0) {
        toast.error('Please select the number of flavours.')
        return
      }
      if (selectedFlavours.length !== flavourCount) {
        toast.error(`Please select exactly ${flavourCount} flavour(s).`)
        return
      }
    }

    if (product.productVariant) {
      for (const variant of product.productVariant) {
        const min = (variant as ProductVariant).atLeastChoose ?? 0
        const currentSelected = selectedOptions[(variant as ProductVariant).id] || []
        if (currentSelected.length < min) {
          alert(
            `Please select at least ${min} option${min > 1 ? 's' : ''} for "${(variant as ProductVariant).title}".`,
          )
          return
        }
      }
    }

    alert('Item added to cart!')
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      {product.image && (
        <Image
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${(product.image as Media).url}`}
          alt={(product.image as Media).alt || product.title}
          width={500}
          height={500}
          className="w-full h-auto object-cover rounded-lg"
        />
      )}

      <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
      {product.description && <p className="text-gray-700 mt-2">{product.description}</p>}

      {!product.priceSetByFlavours && (
        <div className="mt-4 flex items-center space-x-2">
          {hasSalePrice && (
            <span className="text-sm text-gray-400 line-through">
              R$ {product.price?.toFixed(2)}
            </span>
          )}
          <span className="text-xl font-semibold">
            R$ {hasSalePrice ? product.salePrice?.toFixed(2) : product.price?.toFixed(2)}
          </span>
        </div>
      )}

      {(product.productVariant as ProductVariant[])?.map((variant: ProductVariant) => {
        const min = (variant as ProductVariant).atLeastChoose ?? 0
        const max = (variant as ProductVariant).atMostChoose ?? Infinity
        const currentSelected = selectedOptions[(variant as ProductVariant).id] || []
        return (
          <div key={(variant as ProductVariant).id} className="mt-6">
            <h2 className="text-lg font-semibold">{(variant as ProductVariant).title}</h2>
            {(variant as ProductVariant).description && (
              <p className="text-sm opacity-80">{(variant as ProductVariant).description}</p>
            )}
            {(min > 0 || max < Infinity) && (
              <p className="text-xs text-gray-500 mt-1">
                {min > 0 && `Must choose at least ${min}. `}
                {max < Infinity && `Up to ${max} allowed.`}
              </p>
            )}
            <ul className="mt-2 space-y-2">
              {variant.options?.map((option) => {
                const isChecked = option.id ? currentSelected.includes(option.id) : false
                const isAtMax = currentSelected.length >= max
                return (
                  <li
                    key={option.id}
                    className="flex items-center justify-between border-b pt-2 pb-4"
                  >
                    {option.aditional.image && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SERVER_URL}${(option.aditional.image as Media).url}`}
                        alt={
                          typeof option.aditional.image !== 'number'
                            ? option.aditional.image.alt ||
                              option.aditional.title ||
                              'Additional image'
                            : option.aditional.title || 'Additional image'
                        }
                        width={40}
                        height={40}
                        className="object-cover rounded-lg w-10 h-10"
                      />
                    )}
                    <div className="flex flex-col flex-1 pl-3">
                      <span className="font-bold text-sm">{option.aditional.title}</span>
                      <span className="text-xs font-medium opacity-80">
                        + R$ {(option.aditional.price ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={isChecked}
                      onChange={() => handleToggleOption(variant.id, option.id!)}
                      disabled={!isChecked && isAtMax}
                    />
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}

      {product.priceSetByFlavours && product.productFlavours && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">
            {(product.productFlavours as ProductFlavour).title}
          </h2>
          {(product.productFlavours as ProductFlavour).description && (
            <p className="text-sm text-gray-600">
              {(product.productFlavours as ProductFlavour).description}
            </p>
          )}
          {/* Radio group for selecting the number of flavours */}
          <div className="mt-2">
            <p className="text-sm font-medium">Select number of flavours:</p>
            <div className="flex space-x-4 mt-1">
              {Array.from(
                { length: (product.productFlavours as ProductFlavour).atMostChoose || 0 },
                (_, i) => i + 1,
              ).map((count) => (
                <label key={count} className="flex items-center">
                  <input
                    type="radio"
                    name="flavourCount"
                    value={count}
                    checked={flavourCount === count}
                    onChange={() => {
                      setFlavourCount(count)
                      // Reset selected flavours if current selection exceeds new count
                      if (selectedFlavours.length > count) {
                        setSelectedFlavours(selectedFlavours.slice(0, count))
                      }
                    }}
                    className="mr-1"
                  />
                  <span>{count}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Flavour options list */}
          {flavourCount > 0 ? (
            <ul className="mt-4 space-y-2">
              {(product.productFlavours as ProductFlavour).options?.map((option) => {
                const isChecked = option.id ? selectedFlavours.includes(option.id) : false
                const allowedMax = flavourCount || 0
                const isAtMax = selectedFlavours.length >= allowedMax && !isChecked
                return (
                  <li
                    key={option.id}
                    className="flex items-center justify-between border-b pt-2 pb-4"
                  >
                    {option.flavour.image && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SERVER_URL}${(option.flavour.image as Media).url}`}
                        alt={
                          typeof option.flavour.image !== 'number'
                            ? option.flavour.image.alt || option.flavour.title || 'Flavour image'
                            : option.flavour.title || 'Flavour image'
                        }
                        width={40}
                        height={40}
                        className="object-cover rounded-lg w-10 h-10"
                      />
                    )}
                    <div className="flex flex-col flex-1 pl-3">
                      <span className="font-bold text-sm">{option.flavour.title}</span>
                      <span className="text-xs font-medium opacity-80">
                        R$ {(option.flavour.price || 0).toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={isChecked}
                      onChange={() => option.id && handleToggleFlavour(option.id)}
                      disabled={!isChecked && isAtMax}
                    />
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 mt-2">Please select the number of flavours.</p>
          )}
        </div>
      )}

      <button onClick={handleAddToCart} className="mt-6 bg-main text-white px-4 py-2 rounded-lg">
        Add to Cart R$ {totalPrice.toFixed(2)}
      </button>
    </div>
  )
}

export default PageClient
