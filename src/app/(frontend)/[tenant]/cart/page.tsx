'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { IoTrash } from 'react-icons/io5'

interface CartItem {
  productId: number
  title: string
  image?: { url: string; alt?: string }
  // Now stores full flavour objects
  selectedFlavours?: any[]
  // Stores full additional option objects grouped by variant ID
  selectedOptions?: { [variantId: number]: any[] }
  totalPrice: number
  quantity: number
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Function to update both state and localStorage
  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  // Load cart items from localStorage on mount.
  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error('Error parsing cart data', error)
      }
    }
  }, [])

  const handleIncreaseQuantity = (index: number) => {
    const newCart = [...cartItems]
    if (newCart[index]) {
      newCart[index].quantity += 1
    }
    updateCart(newCart)
  }

  const handleDecreaseQuantity = (index: number) => {
    const newCart = [...cartItems]
    // Ensure quantity doesn't drop below 1.
    if (newCart[index] && newCart[index].quantity > 1) {
      newCart[index].quantity -= 1
      updateCart(newCart)
    }
  }

  const handleRemoveItem = (index: number) => {
    const newCart = cartItems.filter((_, i) => i !== index)
    updateCart(newCart)
  }

  // Compute grand total for all items.
  const grandTotal = cartItems.reduce((acc, item) => acc + item.totalPrice * item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="flex flex-col gap-4 overflow-y-auto">
        {cartItems.map((item, index) => (
          <div key={index} className="border p-4 rounded shadow flex-shrink-0 w-full relative">
            {item.image && (
              <div className="h-36 aspect-square relative">
                <Image
                  fill
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}${item.image.url}`}
                  alt={item.image.alt || item.title}
                  className="object-cover rounded"
                />
              </div>
            )}
            <h2 className="text-lg font-bold mt-2">{item.title}</h2>
            <p className="text-sm font-semibold">
              Price: <span className="text-main">R$ {item.totalPrice.toFixed(2)}</span>
            </p>
            {item.selectedFlavours && item.selectedFlavours.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-light py-1 uppercase">Flavours:</p>
                <ul className="list-disc ml-4">
                  {item.selectedFlavours.map((flavour, i) => (
                    <li key={i} className="text-xs">
                      {flavour.flavour.title} (R$ {flavour.flavour.price.toFixed(2)})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-light py-1 uppercase">Additional Options:</p>
                <ul className="list-disc ml-4">
                  {Object.entries(item.selectedOptions).map(([variantId, options]) => (
                    <li key={variantId} className="text-xs">
                      Variant {variantId}:{' '}
                      {options.map((opt: any) => opt.aditional.title).join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center mt-2">
              <p className="flex-1 text-xs uppercase">Quantity:</p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDecreaseQuantity(index)}
                  className="w-7 h-7 flex items-center justify-center border border-border rounded-lg"
                >
                  -
                </button>
                <span className="text-sm">{item.quantity}</span>
                <button
                  onClick={() => handleIncreaseQuantity(index)}
                  className="w-7 h-7 flex items-center justify-center border border-border rounded-lg"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => handleRemoveItem(index)}
              className="py-1 text-red-500 rounded-lg absolute top-4 right-4 text-xl"
            >
              <IoTrash />
            </button>
          </div>
        ))}
      </div>
      {/* Total and Checkout Section */}
      <div className="mt-8 border-t pt-4 flex justify-between items-center">
        <div className="text-xl font-bold">Total: R$ {grandTotal.toFixed(2)}</div>
        <button className="bg-main text-white px-4 py-2 rounded">Checkout</button>
      </div>
    </div>
  )
}

export default CartPage
