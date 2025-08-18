import { getTranslations } from 'next-intl/server'

export default async function LoadingPage() {
  const t = await getTranslations()
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='p-6 rounded-lg shadow-md w-1/3 text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
        <p className='text-lg font-medium'>{t('Loading.Loading')}</p>
        <p className='text-sm text-muted-foreground mt-2'>Please wait...</p>
      </div>
    </div>
  )
}
