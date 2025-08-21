import React from 'react'

export default function Loading() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen '>
      <div className='p-6 rounded-lg shadow-md w-1/3 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Loading...</h1>
        <p>Please wait while we load the page.</p>
      </div>
    </div>
  )
}
