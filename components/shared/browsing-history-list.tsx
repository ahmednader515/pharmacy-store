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

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className='p-6 text-center'>
          <Clock className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-lg font-semibold mb-2'>No browsing history</h3>
          <p className='text-muted-foreground mb-4'>
            Start browsing products to see your history here
          </p>
          <Button asChild>
            <Link href='/search'>Browse Products</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Browsing History</h2>
        <Button variant='outline' onClick={clear}>
          Clear All
        </Button>
      </div>

      <div className='grid gap-4'>
        {products.map((item) => (
          <Card key={item.id} className='overflow-hidden'>
            <CardContent className='p-4'>
              <div className='flex gap-4'>
                                  <div className='relative h-20 w-20 flex-shrink-0'>
                    <Image
                      src='/placeholder.jpg'
                      alt={item.category}
                      fill
                      className='object-cover rounded-md'
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-medium mb-1 line-clamp-2'>
                      <Link href={`/search?category=${item.category}`} className='hover:underline'>
                        {item.category}
                      </Link>
                    </h3>
                    <p className='text-sm text-muted-foreground mb-2'>
                      Category: {item.category}
                    </p>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <Clock className='h-3 w-3' />
                      <span>Recently viewed</span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button asChild variant='outline' size='sm'>
                      <Link href={`/search?category=${item.category}`}>
                        <Eye className='h-4 w-4 mr-1' />
                        View
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
