import { Metadata } from 'next'
import SignupForm from './signup-form'
import data from '@/lib/data'

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default function SignUpPage() {
  const { site } = data.settings[0];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        <SignupForm />
      </div>
    </div>
  )
}
