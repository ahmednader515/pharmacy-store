'use client'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ChevronRight, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import data from '@/lib/data'

export default function HomeCarousel() {
  const { carousels } = data.settings[0];

  if (!carousels || carousels.length === 0) {
    return null
  }

  return (
    <div className='w-full'>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className='w-full'
      >
        <CarouselContent>
          {carousels.map((slide, index) => (
            <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/3'>
              <Card className='overflow-hidden'>
                <CardContent className='p-0'>
                  <div className='relative'>
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      width={400}
                      height={300}
                      className='w-full h-48 object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                    <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
                      <h3 className='text-lg font-semibold mb-2'>{slide.title}</h3>
                      <p className='text-sm text-gray-200 mb-3 line-clamp-2'>
                        Discover our latest pharmacy products and services.
                      </p>
                      {slide.buttonCaption && slide.url && (
                        <Button asChild size='sm'>
                          <Link href={slide.url}>
                            {slide.buttonCaption}
                            <ChevronRight className='ml-2 h-4 w-4' />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
