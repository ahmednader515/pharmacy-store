'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { auth } from '@/auth'

import { connectToDatabase } from '../db'
import { formatError } from '../utils'
import { ReviewInputSchema } from '../validator'
import { IReviewDetails } from '@/types'
import { getSetting } from './setting.actions'

export async function createUpdateReview({
  data,
  path,
}: {
  data: z.infer<typeof ReviewInputSchema>
  path: string
}) {
  try {
    const connection = await connectToDatabase()
    const session = await auth()
    if (!session) {
      throw new Error('User is not authenticated')
    }

    if (connection.isMock) {
      return { success: false, message: 'Cannot create review in mock mode' }
    }

    const review = ReviewInputSchema.parse({
      ...data,
      user: session?.user?.id,
    })

    const existReview = await connection.prisma.review.findFirst({
      where: {
        productId: review.product,
        userId: review.user,
      }
    })

    if (existReview) {
      await connection.prisma.review.update({
        where: { id: existReview.id },
        data: {
          comment: review.comment,
          rating: review.rating,
          title: review.title,
        }
      })
      await updateProductReview(review.product)
      revalidatePath(path)
      return {
        success: true,
        message: 'Review updated successfully',
      }
    } else {
      await connection.prisma.review.create({
        data: {
          userId: review.user,
          productId: review.product,
          isVerifiedPurchase: review.isVerifiedPurchase,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
        }
      })
      await updateProductReview(review.product)
      revalidatePath(path)
      return {
        success: true,
        message: 'Review created successfully',
      }
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

const updateProductReview = async (productId: string) => {
  const connection = await connectToDatabase()
  
  if (connection.isMock) {
    return
  }
  
  // Calculate the new average rating, number of reviews, and rating distribution
  const reviews = await connection.prisma.review.findMany({
    where: { productId },
    select: { rating: true }
  })
  
  // Calculate the total number of reviews and average rating
  const totalReviews = reviews.length
  const avgRating = totalReviews > 0 
    ? reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / totalReviews
    : 0

  // Calculate rating distribution
  const ratingMap: { [key: number]: number } = {}
  for (let i = 1; i <= 5; i++) {
    ratingMap[i] = reviews.filter((r: { rating: number }) => r.rating === i).length
  }
  
  const ratingDistribution = []
  for (let i = 1; i <= 5; i++) {
    ratingDistribution.push({ rating: i, count: ratingMap[i] || 0 })
  }
  
  // Update product fields with calculated values
  await connection.prisma.product.update({
    where: { id: productId },
    data: {
      avgRating: parseFloat(avgRating.toFixed(1)),
      numReviews: totalReviews,
      ratingDistribution,
    }
  })
}

export async function getReviews({
  productId,
  limit,
  page,
}: {
  productId: string
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  const connection = await connectToDatabase()
  
  if (connection.isMock) {
    return {
      data: [],
      totalPages: 1,
    }
  }
  
  const skipAmount = (page - 1) * limit
  const reviews = await connection.prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { name: true }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: skipAmount,
    take: limit,
  })
  const reviewsCount = await connection.prisma.review.count({
    where: { productId }
  })
  return {
    data: JSON.parse(JSON.stringify(reviews)) as IReviewDetails[],
    totalPages: reviewsCount === 0 ? 1 : Math.ceil(reviewsCount / limit),
  }
}

export const getReviewByProductId = async ({
  productId,
}: {
  productId: string
}) => {
  const connection = await connectToDatabase()
  const session = await auth()
  if (!session) {
    throw new Error('User is not authenticated')
  }
  
  if (connection.isMock) {
    return null
  }
  
  const review = await connection.prisma.review.findFirst({
    where: {
      productId,
      userId: session?.user?.id,
    },
  })
  return review ? (JSON.parse(JSON.stringify(review)) as any) : null
}
