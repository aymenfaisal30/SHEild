'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Field, FormError, SubmitButton } from './field'
import { authService } from '@/lib/api/services'

const PHONE_PATTERN = /^(\+92|0)3\d{2}[\s-]?\d{7}$/

export function SignupForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const password = String(form.get('password'))
    const confirm = String(form.get('confirm'))
    const phone = String(form.get('phone')).trim()

    if (!PHONE_PATTERN.test(phone.replace(/\s/g, ''))) {
      setError('Enter a valid Pakistani mobile number, e.g. 0300 1234567.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setPending(true)
    setError(null)
    try {
      await authService.register({
        fullName: String(form.get('fullName')).trim(),
        email: String(form.get('email')).trim(),
        phone,
        city: String(form.get('city')).trim() || undefined,
        password,
      })
      router.push('/contacts?welcome=1')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Field id="fullName" label="Full name" autoComplete="name" placeholder="Ayesha Khan" required />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="phone" label="Mobile number" type="tel" autoComplete="tel" placeholder="0300 1234567" required />
        <Field id="city" label="City" autoComplete="address-level2" placeholder="Islamabad" />
      </div>
      <Field id="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" required />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="password" label="Password" type="password" autoComplete="new-password" placeholder="8+ characters" required />
        <Field id="confirm" label="Confirm password" type="password" autoComplete="new-password" placeholder="Repeat password" required />
      </div>
      <FormError message={error} />
      <SubmitButton pending={pending}>{pending ? 'Creating account' : 'Create account'}</SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}
