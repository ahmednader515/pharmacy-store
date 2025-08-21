'use client'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ProductPriceProps {
  price: number
  originalPrice?: number
  currency?: string
  className?: string
  plain?: boolean
}

export default function ProductPrice({
  price,
  originalPrice,
  currency = 'USD',
  className,
  plain = false,
}: ProductPriceProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  const hasDiscount = originalPrice && originalPrice > price

  if (plain) {
    return <span>{formatPrice(price)}</span>
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className='text-2xl font-bold text-primary'>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <>
          <span className='text-lg text-muted-foreground line-through'>
            {formatPrice(originalPrice)}
          </span>
          <Badge variant='destructive' className='text-xs'>
            {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
          </Badge>
        </>
      )}
    </div>
  )
}
