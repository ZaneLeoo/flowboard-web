<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

import AuthMosaic from './AuthMosaic.vue'

const { t } = useI18n()

defineProps<{
  mode: 'login' | 'register'
}>()
</script>

<template>
  <main class="auth-canvas flex min-h-svh items-center px-4 py-5 sm:px-8 sm:py-10">
    <div class="auth-surface mx-auto grid w-full max-w-[76rem] overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[var(--shadow-float)] lg:min-h-[40rem] lg:grid-cols-[minmax(0,1.1fr)_minmax(25rem,0.9fr)]">
      <aside class="relative hidden min-h-[40rem] overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--surface-auth-art)] p-10 lg:flex lg:flex-col xl:p-14">
        <RouterLink to="/" class="relative z-10 inline-flex w-fit items-center gap-2.5 text-lg font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
          <span class="grid size-9 place-items-center rounded-xl bg-[var(--surface-ink)] text-white shadow-[0_9px_18px_rgba(34,38,48,0.14)]">
            <Icon icon="solar:command-linear" class="size-5" aria-hidden="true" />
          </span>
          {{ t('app.name') }}
        </RouterLink>

        <div class="flex flex-1 items-center justify-center py-10">
          <AuthMosaic />
        </div>

        <p class="relative z-10 max-w-[19rem] text-sm leading-6 text-[var(--text-secondary)]">{{ t('app.tagline') }}</p>
      </aside>

      <section class="flex min-h-[38rem] items-center px-7 py-8 sm:px-12 sm:py-11 lg:min-h-0 lg:px-14">
        <div class="mx-auto w-full max-w-[25rem] py-12">
          <slot />

          <p class="mt-9 text-sm leading-6 text-[var(--text-tertiary)]">
            <template v-if="mode === 'login'">
              {{ t('auth.login.noAccount') }}
              <RouterLink to="/register" class="font-semibold text-[var(--text-primary)] underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:text-[var(--accent-primary)]">{{ t('auth.login.goRegister') }}</RouterLink>
            </template>
            <template v-else>
              {{ t('auth.register.hasAccount') }}
              <RouterLink to="/login" class="font-semibold text-[var(--text-primary)] underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:text-[var(--accent-primary)]">{{ t('auth.register.goLogin') }}</RouterLink>
            </template>
          </p>
        </div>
      </section>
    </div>
  </main>
</template>
