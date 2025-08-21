import React from 'react'
import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/actions/product.actions'
import ProductGallery from '@/components/shared/product/product-gallery'
import ProductPrice from '@/components/shared/product/product-price'
import AddToCart from '@/components/shared/product/add-to-cart'
import Rating from '@/components/shared/product/rating'
import ReviewList from './review-list'
import { Separator } from '@/components/ui/separator'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
        {/* Product Images */}
        <div>
          <ProductGallery images={product.images} />
        </div>

        {/* Product Info */}
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>{product.name}</h1>
            <div className='flex items-center gap-2 mb-4'>
              <Rating rating={product.rating} />
              <span className='text-sm text-muted-foreground'>
                ({product.numReviews} reviews)
              </span>
            </div>
            <ProductPrice 
              price={product.price} 
              originalPrice={product.listPrice}
              className='text-2xl'
            />
          </div>

          <div>
            <p className='text-muted-foreground mb-4'>{product.description}</p>
          </div>

          <div>
            <AddToCart product={product} />
          </div>

          <Separator />

          <div className='space-y-4'>
            <div>
              <h3 className='font-semibold mb-2'>Product Details</h3>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-muted-foreground'>Category:</span>
                  <span className='ml-2'>{product.category}</span>
                </div>
                <div>
                  <span className='text-muted-foreground'>Brand:</span>
                  <span className='ml-2'>{product.brand}</span>
                </div>
                <div>
                  <span className='text-muted-foreground'>Stock:</span>
                  <span className='ml-2'>{product.stock} available</span>
                </div>
                <div>
                  <span className='text-muted-foreground'>SKU:</span>
                  <span className='ml-2'>{product.sku}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className='mb-12'>
        <Separator className='mb-8' />
        <h2 className='text-2xl font-bold mb-6'>Customer Reviews</h2>
        <ReviewList productId={product.id} />
      </div>
    </div>
  )
}
