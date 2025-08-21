import { Metadata } from 'next'
import SignupForm from './signup-form'
import data from '@/lib/data'

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default function SignUpPage() {
  const { site } = data.settings[0];
