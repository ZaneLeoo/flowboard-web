import type { Pinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import TodayView from '../views/TodayView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TodayView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: '/today',
      name: 'today',
      component: TodayView,
      meta: { requiresAuth: true },
    },
  ],
})

export function installRouterGuards(pinia: Pinia) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore(pinia)

    if (!auth.isInitialized) {
      await auth.restoreSession()
    }

    if (to.name === 'home') {
      return auth.isAuthenticated ? { name: 'today' } : { name: 'login' }
    }

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      }
    }

    if (to.meta.guestOnly && auth.isAuthenticated) {
      return { name: 'today' }
    }

    return true
  })
}
