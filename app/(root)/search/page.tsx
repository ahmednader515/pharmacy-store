import React from 'react'
import { notFound } from 'next/navigation'
import { getAllProducts } from '@/lib/actions/product.actions'
import ProductCard from '@/components/shared/product/product-card'
import ProductSortSelector from '@/components/shared/product/product-sort-selector'
import ServerPagination from '@/components/shared/server-pagination'
import { Separator } from '@/components/ui/separator'
import { IProduct } from '@/types'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const {
    q = '',
    category = '',
    minPrice = '',
    maxPrice = '',
    sort = 'newest',
    page = '1',
  } = params

  if (!q && !category) {
    notFound()
  }

  const currentPage = parseInt(page)
  const limit = 12
  const skip = (currentPage - 1) * limit

  const products = await getAllProducts({
    query: q || '',
    category: category || '',
    tag: '',
    price: minPrice && maxPrice ? `${minPrice}-${maxPrice}` : '',
    rating: '',
    sort,
    page: currentPage,
  })

  const totalPages = products.totalPages

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>
          {q ? `Search Results for "${q}"` : `Products in ${category}`}
        </h1>
        <p className='text-muted-foreground'>
          Found {products.totalProducts} product{products.totalProducts !== 1 ? 's' : ''}
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Filters sidebar would go here */}
        <div className='lg:w-1/4'>
          <div className='sticky top-4'>
            <h3 className='font-semibold mb-4'>Filters</h3>
            {/* Filter components would go here */}
            <p className='text-sm text-muted-foreground'>
              Filter options coming soon...
            </p>
          </div>
        </div>

        <div className='lg:w-3/4'>
          <div className='flex items-center justify-between mb-6'>
            <ProductSortSelector 
              sortOrders={[
                { value: 'newest', name: 'Newest' },
                { value: 'price-low-to-high', name: 'Price: Low to High' },
                { value: 'price-high-to-low', name: 'Price: High to Low' },
                { value: 'best-selling', name: 'Best Selling' },
                { value: 'avg-customer-review', name: 'Avg Customer Review' }
              ]}
              sort={sort}
              params={params}
            />
            <p className='text-sm text-muted-foreground'>
              Showing {products.from}-{products.to} of {products.totalProducts} products
            </p>
          </div>

          {products.products.length === 0 ? (
            <div className='text-center py-12'>
              <h3 className='text-lg font-semibold mb-2'>No products found</h3>
              <p className='text-muted-foreground'>
                Try adjusting your search criteria or browse all products
              </p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                {products.products.map((product: IProduct) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <ServerPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl="/search"
                  searchParams={params}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
