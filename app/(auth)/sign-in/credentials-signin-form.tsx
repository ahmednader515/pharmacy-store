'use client'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import data from '@/lib/data'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { IUserSignIn } from '@/types'
import { signInWithCredentials } from '@/lib/actions/user.actions'

import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSignInSchema } from '@/lib/validator'
import { useState } from 'react'

const signInDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        email: 'admin@example.com',
        password: '123456',
      }
    : {
        email: '',
        password: '',
      }

export default function CredentialsSignInForm() {
  const { site } = data.settings[0];
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: signInDefaultValues,
  })

  const { control, handleSubmit } = form

  const onSubmit = async (data: IUserSignIn) => {
    if (isSubmitting) return // Prevent double submission
    
    setIsSubmitting(true)
    
    try {
      const result = await signInWithCredentials({
        email: data.email,
        password: data.password,
      })
      
      if (result?.error) {
        // Handle specific sign-in errors
        let errorMessage = 'Sign in failed. Please try again.'
        
        if (result.error.includes('CredentialsSignin')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.'
        } else if (result.error.includes('EmailSignin')) {
          errorMessage = 'Email sign in is not available. Please use your email and password.'
        } else if (result.error.includes('OAuthSignin')) {
          errorMessage = 'OAuth sign in is not available. Please use your email and password.'
        } else if (result.error.includes('OAuthCallback')) {
          errorMessage = 'OAuth callback failed. Please try again.'
        } else if (result.error.includes('OAuthCreateAccount')) {
          errorMessage = 'Failed to create OAuth account. Please try again.'
        } else if (result.error.includes('OAuthAccountNotLinked')) {
          errorMessage = 'This email is already associated with another account. Please use the original sign-in method.'
        } else if (result.error.includes('EmailCreateAccount')) {
          errorMessage = 'Failed to create account. Please try again.'
        } else if (result.error.includes('Callback')) {
          errorMessage = 'Sign in callback failed. Please try again.'
        } else if (result.error.includes('OAuthSignin')) {
          errorMessage = 'OAuth sign in failed. Please try again.'
        } else if (result.error.includes('Default')) {
          errorMessage = 'Sign in failed. Please check your credentials and try again.'
        }
        
        toast({
          title: 'Sign In Failed',
          description: errorMessage,
          variant: 'destructive',
        })
        return
      }
      
      // Successfully signed in
      toast({
        title: 'Sign In Successful!',
        description: 'Welcome back! Redirecting you...',
        variant: 'default',
      })
      
      router.push(callbackUrl)
    } catch (error) {
      console.error('Sign in error:', error)
      
      // Handle different types of errors
      let errorMessage = 'An unexpected error occurred. Please try again.'
      
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.'
        } else if (error.message.includes('validation')) {
          errorMessage = 'Please check your input and try again.'
        }
      }
      
      toast({
        title: 'Sign In Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type='hidden' name='callbackUrl' value={callbackUrl} />
        <div className='space-y-6'>
          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email address' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
          <div className='text-sm'>
            By signing in, you agree to {site.name}&apos;s{' '}
            <Link href='/page/conditions-of-use'>Conditions of Use</Link> and{' '}
            <Link href='/page/privacy-policy'>Privacy Notice.</Link>
          </div>
        </div>
      </form>
    </Form>
  )
}
