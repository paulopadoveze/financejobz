import { User } from '@/stores/authStore'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token?: string
  user?: User
  message?: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
}

export interface RegisterResponse {
  success: boolean
  token?: string
  user?: User
  message?: string
}