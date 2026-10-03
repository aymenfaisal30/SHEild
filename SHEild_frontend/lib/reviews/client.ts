'use client'

import useSWR from 'swr'
import { tokenStore } from '@/lib/api/token'
import type { User } from '@/lib/api/types'
import { useCurrentUser, useToken } from '@/lib/hooks'
import type { Review, ReviewsResponse } from './types'

function headers(user: User | undefined): HeadersInit {
  const token = tokenStore.get()
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) h.Authorization = `Bearer ${token}`
  if (user) {
    h['x-sheild-email'] = user.email
    h['x-sheild-name'] = user.fullName
    if (user.city) h['x-sheild-city'] = user.city
  }
  return h
}

async function request<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { message?: string } | null
    throw new Error(data?.message ?? 'Something went wrong. Please try again.')
  }
  return (res.status === 204 ? null : await res.json()) as T
}

export function useReviews() {
  const token = useToken()
  const { data: user } = useCurrentUser()
  const swr = useSWR(['reviews', token ?? 'anon', user?.email ?? ''], () =>
    request<ReviewsResponse>('/api/reviews', { headers: headers(user) }),
  )

  async function save(input: { rating: number; title: string; body: string }) {
    const review = await request<Review>('/api/reviews', {
      method: 'POST',
      headers: headers(user),
      body: JSON.stringify(input),
    })
    await swr.mutate()
    return review
  }

  async function remove() {
    await request<null>('/api/reviews', { method: 'DELETE', headers: headers(user) })
    await swr.mutate()
  }

  return { ...swr, ready: Boolean(user), save, remove }
}
