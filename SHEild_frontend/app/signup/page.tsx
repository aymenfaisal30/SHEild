import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = { title: 'Create account — SHEild' }

export default function SignupPage() {
  return (
    <AuthShell title="Create your account" subtitle="Free for every woman. Set up your safety circle in under a minute.">
      <SignupForm />
    </AuthShell>
  )
}
