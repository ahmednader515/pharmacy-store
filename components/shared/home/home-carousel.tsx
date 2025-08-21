'use client'
import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import data from '@/lib/data'

export default function HomeCarousel() {
  try {
    const { carousels } = data.settings[0];
    
    if (!carousels || carousels.length === 0) {
      return null; // Don't render if no carousels
    }

    return (
      <Carousel className="w-full">
        <CarouselContent>
          {carousels.map((carousel, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[400px] md:h-[500px]">
                <Image
                  src={carousel.image}
                  alt={carousel.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">{carousel.title}</h2>
                    <Button asChild size="lg">
                      <Link href={carousel.url}>{carousel.buttonCaption}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
  } catch (error) {
    console.error('Error rendering HomeCarousel:', error);
    return null; // Fallback to prevent crash
  }
}
