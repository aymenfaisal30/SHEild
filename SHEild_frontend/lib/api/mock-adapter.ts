/**
 * Demo-mode adapter used only when NEXT_PUBLIC_API_BASE_URL is not configured.
 * It mimics the Spring Boot API contract in-memory (per browser session) so the
 * interface can be previewed. It is not a backend and stores nothing server-side.
 */
import { ENDPOINTS } from './config'
import {
  ApiError,
  type AuthResponse,
  type CreateSosRequest,
  type EmergencyContact,
  type EmergencyContactInput,
  type LoginRequest,
  type RegisterRequest,
  type SosAlert,
  type User,
} from './types'

interface DemoState {
  user: User & { password: string }
  contacts: EmergencyContact[]
  alerts: SosAlert[]
  nextId: number
}

const SESSION_KEY = 'sheild.demo-state'

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3_600_000).toISOString()
}

function seed(): DemoState {
  return {
    user: {
      id: 1,
      fullName: 'Ayesha Khan',
      email: 'demo@sheild.pk',
      phone: '+92 300 1234567',
      city: 'Islamabad',
      password: 'demo1234',
      createdAt: hoursAgo(24 * 40),
    },
    contacts: [
      { id: 11, name: 'Ammi', phone: '+92 301 5550101', relation: 'Mother', isPrimary: true },
      { id: 12, name: 'Hira Malik', phone: '+92 333 5550142', relation: 'Sister', isPrimary: false },
      { id: 13, name: 'Zainab Ali', phone: '+92 345 5550177', relation: 'Friend', isPrimary: false },
    ],
    alerts: [
      {
        id: 101,
        latitude: 33.7294,
        longitude: 73.0931,
        address: 'Jinnah Avenue, Blue Area, Islamabad',
        message: 'Felt unsafe near the bus stop.',
        status: 'RESOLVED',
        contactsNotified: 3,
        createdAt: hoursAgo(26),
        resolvedAt: hoursAgo(25.6),
      },
      {
        id: 102,
        latitude: 33.6844,
        longitude: 73.0479,
        address: 'F-8 Markaz, Islamabad',
        message: null,
        status: 'CANCELLED',
        contactsNotified: 0,
        createdAt: hoursAgo(24 * 6),
        resolvedAt: hoursAgo(24 * 6 - 0.02),
      },
      {
        id: 103,
        latitude: 33.5651,
        longitude: 73.0169,
        address: 'Saddar, Rawalpindi',
        message: 'Taxi driver took a different route.',
        status: 'RESOLVED',
        contactsNotified: 3,
        createdAt: hoursAgo(24 * 19),
        resolvedAt: hoursAgo(24 * 19 - 0.5),
      },
    ],
    nextId: 200,
  }
}

function load(): DemoState {
  if (typeof window === 'undefined') return seed()
  const raw = window.sessionStorage.getItem(SESSION_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as DemoState
    } catch {
      // fall through to reseed
    }
  }
  const s = seed()
  save(s)
  return s
}

function save(state: DemoState) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(state))
  }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

function publicUser(u: DemoState['user']): User {
  const { password: _password, ...rest } = u
  return rest
}

function requireAuth(token: string | null) {
  if (!token || !token.startsWith('demo.')) throw new ApiError('Please sign in to continue.', 401)
}

export async function mockRequest<T>(
  path: string,
  { method, body, token }: { method: string; body?: unknown; token: string | null },
): Promise<T> {
  await delay(350)
  const state = load()
  const respond = (value: unknown) => {
    save(state)
    return value as T
  }

  if (path === ENDPOINTS.login && method === 'POST') {
    const { email, password } = body as LoginRequest
    if (email.toLowerCase() !== state.user.email.toLowerCase() || password !== state.user.password) {
      throw new ApiError('Invalid email or password.', 401)
    }
    return respond({ token: `demo.${Date.now()}`, user: publicUser(state.user) } satisfies AuthResponse)
  }

  if (path === ENDPOINTS.register && method === 'POST') {
    const data = body as RegisterRequest
    state.user = { ...state.user, ...data, id: 1, createdAt: new Date().toISOString() }
    state.contacts = []
    state.alerts = []
    return respond({ token: `demo.${Date.now()}`, user: publicUser(state.user) } satisfies AuthResponse)
  }

  requireAuth(token)

  if (path === ENDPOINTS.me) return respond(publicUser(state.user))

  if (path === ENDPOINTS.contacts) {
    if (method === 'GET') return respond(state.contacts)
    if (method === 'POST') {
      const input = body as EmergencyContactInput
      if (input.isPrimary) state.contacts.forEach((c) => (c.isPrimary = false))
      const created: EmergencyContact = { ...input, id: state.nextId++ }
      state.contacts.push(created)
      return respond(created)
    }
  }

  const contactMatch = path.match(/^\/api\/contacts\/(\d+)$/)
  if (contactMatch) {
    const id = Number(contactMatch[1])
    const idx = state.contacts.findIndex((c) => c.id === id)
    if (idx === -1) throw new ApiError('Contact not found.', 404)
    if (method === 'PUT') {
      const input = body as EmergencyContactInput
      if (input.isPrimary) state.contacts.forEach((c) => (c.isPrimary = false))
      state.contacts[idx] = { ...input, id }
      return respond(state.contacts[idx])
    }
    if (method === 'DELETE') {
      state.contacts.splice(idx, 1)
      return respond(undefined)
    }
  }

  if (path === ENDPOINTS.sos && method === 'POST') {
    const input = body as CreateSosRequest
    const alert: SosAlert = {
      id: state.nextId++,
      latitude: input.latitude,
      longitude: input.longitude,
      address: input.latitude != null ? null : 'Location unavailable',
      message: input.message ?? null,
      status: 'ACTIVE',
      contactsNotified: state.contacts.length,
      createdAt: new Date().toISOString(),
      resolvedAt: null,
    }
    state.alerts.unshift(alert)
    return respond(alert)
  }

  if (path === ENDPOINTS.sosHistory) {
    return respond([...state.alerts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  }

  const sosMatch = path.match(/^\/api\/sos\/(\d+)\/(resolve|cancel)$/)
  if (sosMatch) {
    const alert = state.alerts.find((a) => a.id === Number(sosMatch[1]))
    if (!alert) throw new ApiError('Alert not found.', 404)
    alert.status = sosMatch[2] === 'resolve' ? 'RESOLVED' : 'CANCELLED'
    alert.resolvedAt = new Date().toISOString()
    return respond(alert)
  }

  throw new ApiError(`Demo mode: no handler for ${method} ${path}`, 404)
}
