import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import { HomeCard } from '@/components/shared/home/home-card'
import HomeCarousel from '@/components/shared/home/home-carousel'
import ProductSlider from '@/components/shared/product/product-slider'
import { Card, CardContent } from '@/components/ui/card'

import { getHomePageData } from '@/lib/actions/product.actions'
import { toSlug } from '@/lib/utils'
import data from '@/lib/data'

export default async function HomePage() {
  try {
    const { carousels } = data.settings[0];
    
    // Debug: Log what we're trying to fetch
    console.log('Fetching data for homepage...')

    // Single database connection to fetch all data
    const {
      todaysDeals,
      bestSellingProducts,
      categories,
      newArrivals,
      featureds,
      bestSellers
    } = await getHomePageData()

    // Debug: Log the final data
    console.log('Final data summary:', {
      todaysDeals: todaysDeals.length,
      bestSellingProducts: bestSellingProducts.length,
      categories: categories.length,
      newArrivals: newArrivals.length,
      featureds: featureds.length,
      bestSellers: bestSellers.length
    })

    const cards = [
      {
        title: 'استكشف الفئات',
        link: {
          text: 'عرض المزيد',
          href: '/search',
        },
        items: categories.map((category: string) => ({
          name: category,
          image: `/images/${toSlug(category)}.jpg`,
          href: `/search?category=${category}`,
        })),
      },
      {
        title: 'منتجات جديدة',
        items: newArrivals.map((product) => ({
          name: product.name,
          image: product.image,
          href: `/product/${product.slug}`,
        })),
        link: {
          text: 'عرض الكل',
          href: '/search?tag=featured',
        },
      },
      {
        title: 'الأكثر مبيعاً',
        items: bestSellers.map((product) => ({
          name: product.name,
          image: product.image,
          href: `/product/${product.slug}`,
        })),
        link: {
          text: 'عرض الكل',
          href: '/search?tag=best-seller',
        },
      },
      {
        title: 'المنتجات المميزة',
        items: featureds.map((product) => ({
          name: product.name,
          image: product.image,
          href: `/product/${product.slug}`,
        })),
        link: {
          text: 'تسوق الآن',
          href: '/search?tag=featured',
        },
      },
    ]

    return (
      <div className="font-cairo" dir="rtl">
        <HomeCarousel />
        <div className='md:p-4 md:space-y-4 bg-gray-50'>
          <HomeCard cards={cards} />
          <Card className='w-full rounded-none'>
            <CardContent className='p-4 items-center gap-3'>
              <ProductSlider title="عروض اليوم" products={todaysDeals} />
            </CardContent>
          </Card>
          <Card className='w-full rounded-none'>
            <CardContent className='p-4 items-center gap-3'>
              <ProductSlider
                title='الأكثر مبيعاً'
                products={bestSellingProducts}
                hideDetails
              />
            </CardContent>
          </Card>
        </div>

        <div className='p-4 bg-white'>
          <BrowsingHistoryList />
        </div>
      </div>
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
