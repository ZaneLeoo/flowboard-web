import { request } from '../../lib/http'

export type UserSummary = {
  id: string
  email: string
  displayName: string
}

export type WorkspaceSummary = {
  id: string
  name: string
}

export type AuthResponse = {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: number
  user: UserSummary
  workspace: WorkspaceSummary
}

export type RegisterInput = {
  email: string
  password: string
  displayName: string
}

export type LoginInput = {
  email: string
  password: string
}

export const authApi = {
  register(input: RegisterInput) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    }, { auth: false })
  },
  login(input: LoginInput) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    }, { auth: false })
  },
  refresh() {
    return request<AuthResponse>('/auth/refresh', {
      method: 'POST',
    }, { auth: false, retryOnUnauthorized: false })
  },
  me() {
    return request<{ user: UserSummary; workspace: WorkspaceSummary }>('/me')
  },
  logout() {
    return request<void>('/auth/logout', { method: 'POST' }, { auth: false, retryOnUnauthorized: false })
  },
}
