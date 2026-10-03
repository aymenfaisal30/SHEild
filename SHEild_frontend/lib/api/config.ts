/**
 * Base URL of the Spring Boot REST API, e.g. "https://api.sheild.pk".
 * When unset, the app runs in demo mode against an in-browser mock so the UI stays explorable.
 */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '')

export const IS_DEMO_MODE = API_BASE_URL === ''

/** Adjust these paths to match your Spring Boot controllers. */
export const ENDPOINTS = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  me: '/api/users/me',
  contacts: '/api/contacts',
  contact: (id: number) => `/api/contacts/${id}`,
  sos: '/api/sos',
  sosHistory: '/api/sos/history',
  sosResolve: (id: number) => `/api/sos/${id}/resolve`,
  sosCancel: (id: number) => `/api/sos/${id}/cancel`,
} as const

export const TOKEN_STORAGE_KEY = 'sheild.token'
