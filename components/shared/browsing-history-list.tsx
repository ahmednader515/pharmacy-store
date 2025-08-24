'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Eye, Trash2 } from 'lucide-react'
import useBrowsingHistory from '@/hooks/use-browsing-history'
import Link from 'next/link'
import Image from 'next/image'

export default function BrowsingHistoryList() {
  const { products, clear } = useBrowsingHistory()

  // Mock browsing history data when no client-side data is available
  const mockBrowsingHistory = [
    {
      id: 'mock-1',
      category: 'Pain Relief',
      image: '/images/p11-1.jpg',
      name: 'Tylenol Extra Strength',
    },
    {
      id: 'mock-2',
      category: 'Vitamins & Supplements',
      image: '/images/p13-1.jpg',
      name: 'Centrum Silver Multivitamin',
    },
    {
      id: 'mock-3',
      category: 'Allergy & Sinus',
      image: '/images/p14-1.jpg',
      name: 'Claritin 24-Hour',
    },
  ]

  // Use mock data if no client-side data is available
  const displayProducts = products.length > 0 ? products : mockBrowsingHistory

  if (displayProducts.length === 0) {
    return (
      <Card>
        <CardContent className='p-6 text-center font-cairo' dir="rtl">
          <Clock className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-lg font-semibold mb-2'>لا يوجد سجل تصفح</h3>
          <p className='text-muted-foreground mb-4'>
            ابدأ في تصفح المنتجات لرؤية سجل التصفح هنا
          </p>
          <Button asChild>
            <Link href='/search'>تصفح المنتجات</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4 font-cairo' dir="rtl">
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-800'>سجل التصفح</h2>
        {products.length > 0 && (
          <Button variant='outline' onClick={clear}>
            مسح الكل
          </Button>
        )}
      </div>

      <div className='grid gap-4'>
        {displayProducts.map((item) => (
          <Card key={item.id} className='overflow-hidden'>
            <CardContent className='p-4'>
              <div className='flex gap-4'>
                <div className='relative h-20 w-20 flex-shrink-0'>
                  <Image
                    src={item.image || '/placeholder.jpg'}
                    alt={item.category || item.name}
                    fill
                    className='object-cover rounded-md'
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-medium mb-1 line-clamp-2 text-right'>
                    <Link href={`/search?category=${item.category}`} className='hover:underline'>
                      {item.name || item.category}
                    </Link>
                  </h3>
                  <p className='text-sm text-muted-foreground mb-2 text-right'>
                    الفئة: {item.category}
                  </p>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <Clock className='h-3 w-3' />
                    <span>تم عرضه مؤخراً</span>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/search?category=${item.category}`}>
                      <Eye className='h-4 w-4 ml-1' />
                      عرض
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
