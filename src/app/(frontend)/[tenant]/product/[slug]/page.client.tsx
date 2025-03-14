'use client'
import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product, ProductFlavour, ProductVariant, Media } from '@/payload-types'
import { toast } from 'react-hot-toast'
import { IoCloseOutline } from 'react-icons/io5'

interface PageClientProps {
  tenant: string
  product: Product
}

interface SelectedOptions {
  [variantId: number]: string[] // For additional options from productVariant
}

const PageClient = ({ tenant, product }: PageClientProps) => {
  const router = useRouter()

  // States for product options & flavours
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})
  const [selectedFlavours, setSelectedFlavours] = useState<string[]>([])
  const [flavourCount, setFlavourCount] = useState<number>(0)

  // Modal state and quantity for modal
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalQuantity, setModalQuantity] = useState<number>(1)

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

  // New function to add the product to the cart with the chosen quantity.
  const addToCartItem = (quantity: number) => {
    // Build full details for selected additional options.
    const fullSelectedOptions: {
      [variantId: number]: any[]
    } = {}
    if (product.productVariant) {
      ;(product.productVariant as ProductVariant[]).forEach((variant) => {
        const selectedIds = selectedOptions[variant.id] || []
        const optionsDetails = variant.options?.filter(
          (option) => option.id && selectedIds.includes(option.id),
        )
        if (optionsDetails && optionsDetails.length > 0) {
          fullSelectedOptions[variant.id] = optionsDetails
        }
      })
    }

    // Build full details for selected flavours.
    let fullSelectedFlavours: any[] = []
    if (product.priceSetByFlavours && product.productFlavours) {
      fullSelectedFlavours =
        (product.productFlavours as ProductFlavour).options?.filter(
          (option) => option.id && selectedFlavours.includes(option.id),
        ) || []
    }

    const cartItem = {
      productId: product.id,
      title: product.title,
      image: product.image,
      selectedFlavours: fullSelectedFlavours,
      selectedOptions: fullSelectedOptions,
      totalPrice,
      quantity,
    }

    // Get existing cart from localStorage.
    let cart: any[] = []
    const existingCart = localStorage.getItem('cart')
    if (existingCart) {
      try {
        cart = JSON.parse(existingCart)
      } catch (error) {
        cart = []
      }
    }
    cart.push(cartItem)
    localStorage.setItem('cart', JSON.stringify(cart))
    toast.success('Item added to cart!')
  }

  // Opens the modal after validations pass.
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
            `Please select at least ${min} option${min > 1 ? 's' : ''} for "${
              (variant as ProductVariant).title
            }".`,
          )
          return
        }
      }
    }

    // Open modal for quantity selection.
    setModalQuantity(1)
    setShowModal(true)
  }

  const increaseModalQuantity = () => {
    setModalQuantity((prev) => prev + 1)
  }

  const decreaseModalQuantity = () => {
    setModalQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  // When Checkout is clicked in the modal.
  const handleCheckout = () => {
    addToCartItem(modalQuantity)
    setShowModal(false)
    router.push(`/${tenant}/cart`)
  }

  // When Add more products is clicked in the modal.
  const handleAddMoreProducts = () => {
    addToCartItem(modalQuantity)
    setShowModal(false)
    router.back()
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      {product.image && (
        <div className="relative w-full aspect-square">
          <Image
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}${(product.image as Media).url}`}
            alt={(product.image as Media).alt || product.title}
            fill
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
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
        const min = variant.atLeastChoose ?? 0
        const max = variant.atMostChoose ?? Infinity
        const currentSelected = selectedOptions[variant.id] || []
        return (
          <div key={variant.id} className="mt-6">
            <h2 className="text-lg font-semibold">{variant.title}</h2>
            {variant.description && <p className="text-sm opacity-80">{variant.description}</p>}
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
                {
                  length: (product.productFlavours as ProductFlavour).atMostChoose || 0,
                },
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

      {/* Modal for selecting quantity */}
      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full relative">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-xl">
              <IoCloseOutline />
            </button>
            <h2 className="text-xl font-bold mb-4">Select Quantity</h2>
            <p></p>
            <div className="flex items-center space-x-4">
              <button
                onClick={decreaseModalQuantity}
                className="w-8 h-8 flex items-center justify-center border border-border rounded-lg"
              >
                -
              </button>
              <span className="text-lg">{modalQuantity}</span>
              <button
                onClick={increaseModalQuantity}
                className="w-8 h-8 flex items-center justify-center border border-border rounded-lg"
              >
                +
              </button>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleAddMoreProducts}
                className="bg-transparent border border-main text-main px-4 py-2 rounded-lg"
              >
                Add more products
              </button>
              <button onClick={handleCheckout} className="bg-main text-white px-4 py-2 rounded-lg">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PageClient
