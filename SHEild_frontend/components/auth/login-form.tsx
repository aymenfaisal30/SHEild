'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Field, FormError, SubmitButton } from './field'
import { IS_DEMO_MODE } from '@/lib/api/config'
import { authService } from '@/lib/api/services'

export function LoginForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setPending(true)
    setError(null)
    try {
      await authService.login({
        email: String(form.get('email')).trim(),
        password: String(form.get('password')),
      })
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {IS_DEMO_MODE && (
        <div className="rounded-2xl border border-primary/25 bg-primary/10 p-4 text-sm">
          <p className="font-medium text-primary">Demo mode</p>
          <p className="mt-1 text-foreground/75">
            Use <span className="font-mono text-foreground">demo@sheild.pk</span> /{' '}
            <span className="font-mono text-foreground">demo1234</span> to explore.
          </p>
        </div>
      )}
      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        defaultValue={IS_DEMO_MODE ? 'demo@sheild.pk' : undefined}
        required
      />
      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        defaultValue={IS_DEMO_MODE ? 'demo1234' : undefined}
        required
      />
      <FormError message={error} />
      <SubmitButton pending={pending}>{pending ? 'Signing in' : 'Log in'}</SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        New to SHEild?{' '}
        <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  )
}
