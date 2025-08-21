'use client'
import React from 'react'

import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { cause?: unknown }
  reset: () => void
}) {
  // Log error details for debugging
  console.error('Error Boundary Caught:', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    cause: error.cause
  })

  return (
    <div className='flex flex-col items-center justify-center min-h-screen '>
      <div className='p-6 rounded-lg shadow-md w-1/3 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Something went wrong</h1>
        <p className='text-destructive mb-4'>{error.message}</p>
        
        {/* Show additional error details in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className='text-left bg-gray-100 p-4 rounded mb-4 text-sm'>
            <p><strong>Error Name:</strong> {error.name}</p>
            {error.stack && (
              <details className='mt-2'>
                <summary className='cursor-pointer font-semibold'>Stack Trace</summary>
                <pre className='text-xs mt-2 whitespace-pre-wrap'>{error.stack}</pre>
              </details>
            )}
          </div>
        )}
        
        <div className='flex gap-2 justify-center'>
          <Button variant='outline' onClick={() => reset()}>
            Try again
          </Button>
          <Button
            variant='outline'
            onClick={() => (window.location.href = '/')}
          >
            Back To Home
          </Button>
        </div>
      </div>
    </div>
  )
}
