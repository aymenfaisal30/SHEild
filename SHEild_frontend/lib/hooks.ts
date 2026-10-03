'use client'

import { useSyncExternalStore } from 'react'
import useSWR from 'swr'
import { contactService, sosService, userService } from './api/services'
import { tokenStore } from './api/token'

export function useToken() {
  return useSyncExternalStore(
    tokenStore.subscribe,
    () => tokenStore.get(),
    () => undefined,
  )
}

export function useCurrentUser() {
  const token = useToken()
  return useSWR(token ? ['me', token] : null, () => userService.me())
}

export function useContacts() {
  const token = useToken()
  return useSWR(token ? ['contacts', token] : null, () => contactService.list())
}

export function useSosHistory() {
  const token = useToken()
  return useSWR(token ? ['sos-history', token] : null, () => sosService.history())
}
