import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ProfileForm } from './profile-form'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import data from '@/lib/data'

export const metadata: Metadata = {
  title: 'Manage Name',
}

export default async function ManageNamePage() {
  const session = await auth()
  if (!session) redirect('/sign-in')
  
  const { site } = data.settings[0];
  
  return (
    <div className='mb-24'>
      <div className='flex gap-2 '>
        <Link href='/account'>Your Account</Link>
        <span>›</span>
        <Link href='/account/manage'>Login & Security</Link>
        <span>›</span>
        <span>Change Your Name</span>
      </div>
      <h1 className='h1-bold py-4'>Change Your Name</h1>
      <Card className='max-w-2xl'>
        <CardContent className='p-4 flex justify-between flex-wrap'>
          <p className='text-sm py-2'>
            If you want to change the name associated with your {site.name}
            &apos;s account, you may do so below. Be sure to click the Save
            Changes button when you are done.
          </p>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  )
}
