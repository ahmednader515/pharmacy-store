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
import PhoneInput from '@/components/shared/phone-input'

const signInDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        phone: '+201234567890',
        password: '123456',
      }
    : {
        phone: '',
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
      console.log('Attempting sign in with phone:', data.phone)
      
      const result = await signInWithCredentials({
        phone: data.phone,
        password: data.password,
      })
      
      console.log('Sign in result:', result)
      
      if (result?.error) {
        console.error('Sign in error:', result.error)
        // Handle specific sign-in errors
        let errorMessage = 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.'
        
        if (result.error.includes('CredentialsSignin')) {
          errorMessage = 'رقم الهاتف أو كلمة المرور غير صحيحة. يرجى التحقق من بياناتك والمحاولة مرة أخرى.'
        } else if (result.error.includes('PhoneSignin')) {
          errorMessage = 'تسجيل الدخول برقم الهاتف غير متاح. يرجى استخدام رقم هاتفك وكلمة المرور.'
        } else if (result.error.includes('OAuthSignin')) {
          errorMessage = 'تسجيل الدخول عبر OAuth غير متاح. يرجى استخدام رقم هاتفك وكلمة المرور.'
        } else if (result.error.includes('OAuthCallback')) {
          errorMessage = 'فشل في OAuth callback. يرجى المحاولة مرة أخرى.'
        } else if (result.error.includes('OAuthCreateAccount')) {
          errorMessage = 'فشل في إنشاء حساب OAuth. يرجى المحاولة مرة أخرى.'
        } else if (result.error.includes('OAuthAccountNotLinked')) {
          errorMessage = 'رقم الهاتف هذا مرتبط بحساب آخر بالفعل. يرجى استخدام طريقة تسجيل الدخول الأصلية.'
        } else if (result.error.includes('PhoneCreateAccount')) {
          errorMessage = 'فشل في إنشاء الحساب. يرجى المحاولة مرة أخرى.'
        } else if (result.error.includes('Callback')) {
          errorMessage = 'فشل في callback تسجيل الدخول. يرجى المحاولة مرة أخرى.'
        } else if (result.error.includes('Default')) {
          errorMessage = 'فشل تسجيل الدخول. يرجى التحقق من بياناتك والمحاولة مرة أخرى.'
        }
        
        toast({
          title: 'فشل تسجيل الدخول',
          description: errorMessage,
          variant: 'destructive',
        })
        return
      }
      
      // Successfully signed in
      toast({
        title: 'تم تسجيل الدخول بنجاح!',
        description: 'أهلاً وسهلاً بك! جاري توجيهك...',
        variant: 'default',
      })
      
      router.push(callbackUrl)
    } catch (error) {
      console.error('Sign in error:', error)
      
      // Handle different types of errors
      let errorMessage = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
      
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          errorMessage = 'خطأ في الشبكة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.'
        } else if (error.message.includes('timeout')) {
          errorMessage = 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.'
        } else if (error.message.includes('validation')) {
          errorMessage = 'يرجى التحقق من إدخالك والمحاولة مرة أخرى.'
        }
      }
      
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} dir="rtl" className="font-cairo">
        <input type='hidden' name='callbackUrl' value={callbackUrl} />
        <div className='space-y-10'>
          <FormField
            control={control}
            name='phone'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className="text-right block font-cairo text-gray-700 text-xl mb-4">رقم الهاتف</FormLabel>
                <FormControl>
                  <PhoneInput 
                    placeholder='أدخل رقم الهاتف' 
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    className="text-right font-cairo h-14 text-lg px-6"
                  />
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
                <FormLabel className="text-right block font-cairo text-gray-700 text-xl mb-4">كلمة المرور</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='أدخل كلمة المرور'
                    {...field}
                    className="text-right font-cairo h-14 text-lg px-6"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-6">
            <Button type='submit' disabled={isSubmitting} className="w-full font-cairo h-14 text-lg">
              {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </div>
          
          <div className='text-lg text-right text-gray-600 font-cairo leading-relaxed'>
            عند تسجيل الدخول، فإنك توافق على{' '}
            <Link href='/page/conditions-of-use' className="text-blue-600 hover:underline">شروط الاستخدام</Link> و{' '}
            <Link href='/page/privacy-policy' className="text-blue-600 hover:underline">سياسة الخصوصية</Link> الخاصة بـ {site.name}.
          </div>
        </div>
      </form>
    </Form>
  )
}
