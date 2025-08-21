'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import Rating from '@/components/shared/product/rating'
import { Separator } from '@/components/ui/separator'
import { Star, User } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Review {
  id: string
  user: {
    name: string
    email: string
  }
  rating: number
  comment: string
  createdAt: string
}

interface ReviewListProps {
  productId: string
}

export default function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingChange = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }))
  }

  const handleSubmitReview = async () => {
    if (newReview.rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a rating before submitting',
        variant: 'destructive',
      })
      return
    }

    if (!newReview.comment.trim()) {
      toast({
        title: 'Comment Required',
        description: 'Please write a comment before submitting',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Here you would submit the review to your API
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ productId, ...newReview }),
      // })

      // For now, just show success message
      toast({
        title: 'Review Submitted',
        description: 'Thank you for your review!',
        variant: 'default',
      })

      // Reset form
      setNewReview({ rating: 0, comment: '' })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Write Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <label className='text-sm font-medium mb-2 block'>Rating</label>
            <div className='flex gap-1'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  onClick={() => handleRatingChange(star)}
                  className='p-1'
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= newReview.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor='comment' className='text-sm font-medium mb-2 block'>
              Comment
            </label>
            <Textarea
              id='comment'
              placeholder='Share your thoughts about this product...'
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
            />
          </div>

          <Button 
            onClick={handleSubmitReview} 
            disabled={isSubmitting}
            className='w-full'
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Reviews List */}
      <div>
        <h3 className='text-lg font-semibold mb-4'>
          Customer Reviews ({reviews.length})
        </h3>
        
        {reviews.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>
            <User className='h-12 w-12 mx-auto mb-4 opacity-50' />
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className='p-4'>
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      <div className='w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center'>
                        <User className='h-4 w-4 text-primary' />
                      </div>
                      <span className='font-medium'>{review.user.name}</span>
                    </div>
                    <Rating rating={review.rating} />
                  </div>
                  <p className='text-muted-foreground mb-2'>{review.comment}</p>
                  <p className='text-xs text-muted-foreground'>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
