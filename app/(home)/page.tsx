import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import { HomeCard } from '@/components/shared/home/home-card'
import HomeCarousel from '@/components/shared/home/home-carousel'
import ProductSlider from '@/components/shared/product/product-slider'
import { Card, CardContent } from '@/components/ui/card'

import {
  getProductsForCard,
  getProductsByTag,
  getAllCategories,
} from '@/lib/actions/product.actions'
import { toSlug } from '@/lib/utils'
import data from '@/lib/data'

export default async function HomePage() {
  try {
    const { carousels } = data.settings[0];
    
    // Wrap database calls in try-catch blocks with fallbacks
    let todaysDeals = []
    let bestSellingProducts = []
    let categories = []
    let newArrivals = []
    let featureds = []
    let bestSellers = []

    try {
      todaysDeals = await getProductsByTag({ tag: 'todays-deal' })
    } catch (error) {
      console.warn('Failed to fetch todays deals:', error)
      todaysDeals = []
    }

    try {
      bestSellingProducts = await getProductsByTag({ tag: 'best-seller' })
    } catch (error) {
      console.warn('Failed to fetch best selling products:', error)
      bestSellingProducts = []
    }

    try {
      categories = (await getAllCategories()).slice(0, 4)
    } catch (error) {
      console.warn('Failed to fetch categories:', error)
      categories = []
    }

    try {
      newArrivals = await getProductsForCard({
        tag: 'new-arrival',
      })
    } catch (error) {
      console.warn('Failed to fetch new arrivals:', error)
      newArrivals = []
    }

    try {
      featureds = await getProductsForCard({
        tag: 'featured',
      })
    } catch (error) {
      console.warn('Failed to fetch featured products:', error)
      featureds = []
    }

    try {
      bestSellers = await getProductsForCard({
        tag: 'best-seller',
      })
    } catch (error) {
      console.warn('Failed to fetch best sellers:', error)
      bestSellers = []
    }

    const cards = [
      {
        title: 'Categories to explore',
        link: {
          text: 'See More',
          href: '/search',
        },
        items: categories.map((category: string) => ({
          name: category,
          image: `/images/${toSlug(category)}.jpg`,
          href: `/search?category=${category}`,
        })),
      },
      {
        title: 'Explore New Arrivals',
        items: newArrivals,
        link: {
          text: 'View All',
          href: '/search?tag=new-arrival',
        },
      },
      {
        title: 'Discover Best Sellers',
        items: bestSellers,
        link: {
          text: 'View All',
          href: '/search?tag=best-seller',
        },
      },
      {
        title: 'Featured Products',
        items: featureds,
        link: {
          text: 'Shop Now',
          href: '/search?tag=new-arrival',
        },
      },
    ]

    return (
      <>
        <HomeCarousel />
        <div className='md:p-4 md:space-y-4 bg-border'>
          <HomeCard cards={cards} />
          <Card className='w-full rounded-none'>
            <CardContent className='p-4 items-center gap-3'>
              <ProductSlider title="Today's Deals" products={todaysDeals} />
            </CardContent>
          </Card>
          <Card className='w-full rounded-none'>
            <CardContent className='p-4 items-center gap-3'>
              <ProductSlider
                title='Best Selling Products'
                products={bestSellingProducts}
                hideDetails
              />
            </CardContent>
          </Card>
        </div>

        <div className='p-4 bg-background'>
          <BrowsingHistoryList />
        </div>
      </>
    )
  } catch (error) {
    console.error('Error in HomePage:', error)
    
    // Return a fallback UI instead of crashing
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to MediCare Pharmacy
          </h1>
          <p className="text-gray-600 mb-6">
            We're experiencing some technical difficulties. Please try again later.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }
}
