import { apiRequest } from './client'
import { ENDPOINTS } from './config'
import { tokenStore } from './token'
import type {
  AuthResponse,
  CreateSosRequest,
  EmergencyContact,
  EmergencyContactInput,
  LoginRequest,
  RegisterRequest,
  SosAlert,
  User,
} from './types'

export const authService = {
  async login(payload: LoginRequest) {
    const res = await apiRequest<AuthResponse>(ENDPOINTS.login, {
      method: 'POST',
      body: payload,
      auth: false,
    })
    tokenStore.set(res.token)
    return res
  },
  async register(payload: RegisterRequest) {
    const res = await apiRequest<AuthResponse>(ENDPOINTS.register, {
      method: 'POST',
      body: payload,
      auth: false,
    })
    tokenStore.set(res.token)
    return res
  },
  logout() {
    tokenStore.clear()
  },
}

export const userService = {
  me: () => apiRequest<User>(ENDPOINTS.me),
}

export const contactService = {
  list: () => apiRequest<EmergencyContact[]>(ENDPOINTS.contacts),
  create: (data: EmergencyContactInput) =>
    apiRequest<EmergencyContact>(ENDPOINTS.contacts, { method: 'POST', body: data }),
  update: (id: number, data: EmergencyContactInput) =>
    apiRequest<EmergencyContact>(ENDPOINTS.contact(id), { method: 'PUT', body: data }),
  remove: (id: number) => apiRequest<void>(ENDPOINTS.contact(id), { method: 'DELETE' }),
}

export const sosService = {
  trigger: (data: CreateSosRequest) =>
    apiRequest<SosAlert>(ENDPOINTS.sos, { method: 'POST', body: data }),
  history: () => apiRequest<SosAlert[]>(ENDPOINTS.sosHistory),
  resolve: (id: number) => apiRequest<SosAlert>(ENDPOINTS.sosResolve(id), { method: 'PUT' }),
  cancel: (id: number) => apiRequest<SosAlert>(ENDPOINTS.sosCancel(id), { method: 'PUT' }),
}
