import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Log in — SHEild' }

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Log in to reach your safety circle and dashboard.">
      <LoginForm />
    </AuthShell>
  )
}
