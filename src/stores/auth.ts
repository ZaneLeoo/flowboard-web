import { defineStore } from 'pinia'

import { authApi, type AuthResponse, type LoginInput, type RegisterInput, type UserSummary, type WorkspaceSummary } from '../features/auth/api'
import { configureHttpSessionHandlers } from '../lib/http'

let refreshPromise: Promise<boolean> | undefined

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    user: null as UserSummary | null,
    workspace: null as WorkspaceSummary | null,
    isInitialized: false,
  }),
  getters: {
    isAuthenticated: (state) => state.accessToken !== null && state.user !== null,
  },
  actions: {
    configureHttp() {
      configureHttpSessionHandlers({
        getAccessToken: () => this.accessToken,
        refreshSession: () => this.refreshSession(),
      })
    },
    async restoreSession() {
      this.configureHttp()
      const restored = await this.refreshSession()
      if (restored) {
        try {
          const currentUser = await authApi.me()
          this.user = currentUser.user
          this.workspace = currentUser.workspace
        }
        catch {
          this.clearSession()
        }
      }
      this.isInitialized = true
      return this.isAuthenticated
    },
    async register(input: RegisterInput) {
      this.configureHttp()
      this.applySession(await authApi.register(input))
    },
    async login(input: LoginInput) {
      this.configureHttp()
      this.applySession(await authApi.login(input))
    },
    async refreshSession() {
      if (!refreshPromise) {
        refreshPromise = this.performRefresh()
      }

      try {
        return await refreshPromise
      }
      finally {
        refreshPromise = undefined
      }
    },
    async logout() {
      try {
        await authApi.logout()
      }
      finally {
        this.clearSession()
      }
    },
    applySession(session: AuthResponse) {
      this.accessToken = session.accessToken
      this.user = session.user
      this.workspace = session.workspace
    },
    clearSession() {
      this.accessToken = null
      this.user = null
      this.workspace = null
    },
    async performRefresh() {
      try {
        this.applySession(await authApi.refresh())
        return true
      }
      catch {
        this.clearSession()
        return false
      }
    },
  },
})
