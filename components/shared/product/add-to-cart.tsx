
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import useCartStore from '@/hooks/use-cart-store'
import { IProduct } from '@/types'
import SelectVariant from './select-variant'

interface AddToCartProps {
  product: IProduct
  className?: string
}

export default function AddToCart({ product, className }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const { addItem } = useCartStore()

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(99, quantity + value))
    setQuantity(newQuantity)
  }

  const handleAddToCart = async () => {
    if ((product.colors.length > 1 || product.sizes.length > 1) && !selectedVariant) {
      toast({
        title: 'Please select options',
        description: 'Choose color and size before adding to cart',
        variant: 'destructive',
      })
      return
    }

    try {
      await addItem({
        product: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        image: product.images[0],
        price: Number(product.price), // Convert to number to prevent toFixed errors
        countInStock: product.countInStock,
        color: selectedVariant || product.colors[0] || '',
        size: product.sizes[0] || '',
        quantity: 1,
        clientId: '',
      }, quantity)

      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
        variant: 'default',
      })

      // Reset quantity
      setQuantity(1)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {(product.colors.length > 1 || product.sizes.length > 1) && (
        <div className='space-y-3'>
          {product.colors.length > 1 && (
            <div>
              <label className='font-medium mb-2 block'>Color:</label>
              <div className='flex gap-2'>
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`px-3 py-1 border rounded ${
                      selectedVariant === color ? 'border-primary bg-primary text-white' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedVariant(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          {product.sizes.length > 1 && (
            <div>
              <label className='font-medium mb-2 block'>Size:</label>
              <div className='flex gap-2'>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-3 py-1 border rounded ${
                      selectedVariant === size ? 'border-primary bg-primary text-white' : 'border-gray-300'
                    }`}
                    onClick={() => setSelectedVariant(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 1}
        >
          <Minus className='h-4 w-4' />
        </Button>
        <Input
          type='number'
          min='1'
          max='99'
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className='w-20 text-center'
        />
        <Button
          variant='outline'
          size='icon'
          onClick={() => handleQuantityChange(1)}
          disabled={quantity >= 99}
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      <Button
        onClick={handleAddToCart}
        className='w-full'
        size='lg'
        disabled={product.countInStock === 0}
      >
        <ShoppingCart className='mr-2 h-5 w-5' />
        {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  )
}
