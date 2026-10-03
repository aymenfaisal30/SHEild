export interface User {
  id: number
  fullName: string
  email: string
  phone: string
  city?: string
  createdAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  phone: string
  city?: string
  password: string
}

export type ContactRelation =
  | 'Mother'
  | 'Father'
  | 'Sister'
  | 'Brother'
  | 'Spouse'
  | 'Friend'
  | 'Colleague'
  | 'Other'

export interface EmergencyContact {
  id: number
  name: string
  phone: string
  relation: ContactRelation
  isPrimary: boolean
}

export type EmergencyContactInput = Omit<EmergencyContact, 'id'>

export type SosStatus = 'ACTIVE' | 'RESOLVED' | 'CANCELLED'

export interface SosAlert {
  id: number
  latitude: number | null
  longitude: number | null
  address?: string | null
  message?: string | null
  status: SosStatus
  contactsNotified: number
  createdAt: string
  resolvedAt?: string | null
}

export interface CreateSosRequest {
  latitude: number | null
  longitude: number | null
  message?: string
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
