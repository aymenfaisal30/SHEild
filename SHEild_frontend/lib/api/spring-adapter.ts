/**
 * Talks to the SHEild Spring Boot backend and translates between the
 * backend's JSON shape and the shape the UI expects.
 *
 * Backend today: no JWT, endpoints are keyed by userId. So the "token" we keep
 * in the browser is simply the logged-in user's id, and the signed-in user is
 * cached in localStorage. (Next step for the project: real JWT auth.)
 */
import { API_BASE_URL, ENDPOINTS } from './config'
import {
  ApiError,
  type AuthResponse,
  type ContactRelation,
  type CreateSosRequest,
  type EmergencyContact,
  type EmergencyContactInput,
  type LoginRequest,
  type RegisterRequest,
  type SosAlert,
  type SosStatus,
  type User,
} from './types'

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const USER_KEY = 'sheild.user'
const profileKey = (id: number) => `sheild.profile.${id}`

/* ---------- backend shapes ---------- */
interface BackendUser {
  userId: number
  email: string
  phone: string
  createdAt?: string
}
interface BackendContact {
  contactId: number
  name: string
  phone: string
  relationship?: string | null
  isPrimary?: boolean
}
interface BackendSos {
  sosId: number
  status: string
  latitude: number | string | null
  longitude: number | string | null
  startedAt: string
  endedAt?: string | null
}

/* ---------- helpers ---------- */
function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function toUser(b: BackendUser): User {
  const profile = readJson<{ fullName?: string; city?: string }>(profileKey(b.userId))
  return {
    id: b.userId,
    email: b.email,
    phone: b.phone,
    fullName: profile?.fullName || b.email.split('@')[0],
    city: profile?.city,
    createdAt: b.createdAt,
  }
}

function toContact(b: BackendContact): EmergencyContact {
  return {
    id: b.contactId,
    name: b.name,
    phone: b.phone,
    relation: (b.relationship || 'Other') as ContactRelation,
    isPrimary: Boolean(b.isPrimary),
  }
}

function toSos(b: BackendSos): SosAlert {
  const status = (['ACTIVE', 'RESOLVED', 'CANCELLED'].includes(b.status) ? b.status : 'RESOLVED') as SosStatus
  return {
    id: b.sosId,
    latitude: b.latitude == null ? null : Number(b.latitude),
    longitude: b.longitude == null ? null : Number(b.longitude),
    address: null,
    message: null,
    status,
    contactsNotified: 0, // backend does not send SMS/notifications yet
    createdAt: b.startedAt,
    resolvedAt: b.endedAt ?? null,
  }
}

async function http<T>(path: string, method: Method, body?: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Unable to reach the SHEild server. Is the backend running?', 0)
  }
  const text = await res.text()
  let data: unknown
  try {
    data = text ? JSON.parse(text) : undefined
  } catch {
    data = undefined
  }
  if (!res.ok) {
    const msg = (data as { message?: string } | undefined)?.message
    throw new ApiError(msg || `Request failed with status ${res.status}`, res.status)
  }
  return data as T
}

function currentUserId(token: string | null): number {
  const id = Number(token)
  if (!token || Number.isNaN(id)) throw new ApiError('Please log in again.', 401)
  return id
}

/* ---------- router ---------- */
export async function springRequest<T>(
  path: string,
  opts: { method: Method; body?: unknown; token: string | null },
): Promise<T> {
  const { method, body, token } = opts

  if (path === ENDPOINTS.login && method === 'POST') {
    const b = await http<BackendUser>('/api/auth/login', 'POST', body as LoginRequest)
    const user = toUser(b)
    window.localStorage.setItem(USER_KEY, JSON.stringify(user))
    return { token: String(b.userId), user } satisfies AuthResponse as T
  }

  if (path === ENDPOINTS.register && method === 'POST') {
    const r = body as RegisterRequest
    const b = await http<BackendUser>('/api/users', 'POST', {
      email: r.email,
      password: r.password,
      phone: r.phone,
    })
    window.localStorage.setItem(profileKey(b.userId), JSON.stringify({ fullName: r.fullName, city: r.city }))
    const user = toUser(b)
    window.localStorage.setItem(USER_KEY, JSON.stringify(user))
    return { token: String(b.userId), user } satisfies AuthResponse as T
  }

  if (path === ENDPOINTS.me && method === 'GET') {
    const user = readJson<User>(USER_KEY)
    if (!user) throw new ApiError('Please log in again.', 401)
    return user as T
  }

  const uid = currentUserId(token)

  if (path === ENDPOINTS.contacts) {
    if (method === 'GET') {
      const list = await http<BackendContact[]>(`/api/emergency-contacts/${uid}`, 'GET')
      return list.map(toContact) as T
    }
    if (method === 'POST') {
      const c = body as EmergencyContactInput
      const created = await http<BackendContact>(`/api/emergency-contacts/${uid}`, 'POST', {
        name: c.name,
        phone: c.phone,
        relationship: c.relation,
        isPrimary: c.isPrimary,
      })
      return toContact(created) as T
    }
  }

  const contactMatch = path.match(/^\/api\/contacts\/(\d+)$/)
  if (contactMatch) {
    const id = Number(contactMatch[1])
    if (method === 'DELETE') {
      await http<void>(`/api/emergency-contacts/${uid}/${id}`, 'DELETE')
      return undefined as T
    }
    if (method === 'PUT') {
      // Backend has no update endpoint yet: replace = delete + create.
      const c = body as EmergencyContactInput
      await http<void>(`/api/emergency-contacts/${uid}/${id}`, 'DELETE')
      const created = await http<BackendContact>(`/api/emergency-contacts/${uid}`, 'POST', {
        name: c.name,
        phone: c.phone,
        relationship: c.relation,
        isPrimary: c.isPrimary,
      })
      return toContact(created) as T
    }
  }

  if (path === ENDPOINTS.sos && method === 'POST') {
    const s = body as CreateSosRequest
    const created = await http<BackendSos>(`/api/sos/${uid}`, 'POST', {
      triggerType: 'MANUAL',
      latitude: s.latitude ?? 0,
      longitude: s.longitude ?? 0,
    })
    return toSos(created) as T
  }

  if (path === ENDPOINTS.sosHistory && method === 'GET') {
    const list = await http<BackendSos[]>(`/api/sos/${uid}`, 'GET')
    return list.map(toSos).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)) as T
  }

  const sosMatch = path.match(/^\/api\/sos\/(\d+)\/(resolve|cancel)$/)
  if (sosMatch && method === 'PUT') {
    const status = sosMatch[2] === 'resolve' ? 'RESOLVED' : 'CANCELLED'
    const updated = await http<BackendSos>(`/api/sos/${uid}/${sosMatch[1]}/end?status=${status}`, 'PUT')
    return toSos(updated) as T
  }

  throw new ApiError(`Unsupported request: ${method} ${path}`, 404)
}
