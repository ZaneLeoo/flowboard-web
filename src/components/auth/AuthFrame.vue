<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  mode: 'login' | 'register'
}>()
</script>

<template>
  <main class="auth-canvas min-h-svh px-5 py-6 sm:px-8 sm:py-8">
    <div class="mx-auto flex min-h-[calc(100svh-3rem)] max-w-[74rem] flex-col sm:min-h-[calc(100svh-4rem)]">
      <header class="flex min-h-12 items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
          <span class="grid size-9 place-items-center rounded-xl bg-[var(--surface-ink)] text-white shadow-[0_9px_18px_rgba(34,38,48,0.14)]">
            <Icon icon="solar:command-linear" class="size-5" aria-hidden="true" />
          </span>
          {{ t('app.name') }}
        </RouterLink>
        <span class="hidden text-sm font-medium text-[var(--text-tertiary)] sm:inline">{{ t('app.tagline') }}</span>
      </header>

      <div class="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[minmax(21rem,0.76fr)_minmax(30rem,1.24fr)] lg:gap-20">
        <section class="w-full max-w-[25rem] lg:justify-self-start">
          <slot />

          <p class="mt-10 text-sm leading-6 text-[var(--text-tertiary)]">
            <template v-if="mode === 'login'">
              {{ t('auth.login.noAccount') }}
              <RouterLink to="/register" class="font-semibold text-[var(--accent-primary)] transition-colors hover:text-[var(--accent-primary-hover)]">{{ t('auth.login.goRegister') }}</RouterLink>
            </template>
            <template v-else>
              {{ t('auth.register.hasAccount') }}
              <RouterLink to="/login" class="font-semibold text-[var(--accent-primary)] transition-colors hover:text-[var(--accent-primary-hover)]">{{ t('auth.register.goLogin') }}</RouterLink>
            </template>
          </p>
        </section>

        <aside class="relative hidden min-h-[29rem] overflow-hidden rounded-[2rem] border border-white bg-[var(--surface-preview)] p-6 shadow-[var(--shadow-panel)] lg:block">
          <div class="auth-preview-glow auth-preview-glow-one" />
          <div class="auth-preview-glow auth-preview-glow-two" />

          <div class="relative flex h-full flex-col">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-[var(--accent-primary)]">{{ t('auth.preview.eyebrow') }}</p>
                <h1 class="mt-2 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-[var(--text-primary)]">{{ t('auth.preview.title') }}</h1>
              </div>
              <span class="rounded-full border border-[var(--border-subtle)] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">{{ t('auth.preview.badge') }}</span>
            </div>

            <div class="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-white/90 p-5 shadow-[var(--shadow-subtle)]">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs font-semibold tracking-[0.08em] text-[var(--text-tertiary)]">{{ t('auth.preview.today') }}</p>
                  <p class="mt-1 text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">{{ t('auth.preview.focusTitle') }}</p>
                </div>
                <span class="grid size-9 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-primary)]">
                  <Icon icon="solar:star-linear" class="size-5" aria-hidden="true" />
                </span>
              </div>

              <div class="mt-5 grid gap-2.5">
                <div v-for="item in ['first', 'second', 'third']" :key="item" class="flex items-center gap-3 rounded-xl bg-[var(--surface-muted)]/80 px-3.5 py-3">
                  <span class="size-4 rounded-full border border-[var(--border-strong)] bg-white" />
                  <span class="flex-1 text-sm font-medium text-[var(--text-secondary)]">{{ t(`auth.preview.items.${item}`) }}</span>
                  <span class="size-2 rounded-full" :class="item === 'second' ? 'bg-violet-400' : item === 'third' ? 'bg-amber-400' : 'bg-blue-500'" />
                </div>
              </div>
            </div>

            <div class="mt-auto grid grid-cols-[auto_1fr] items-center gap-4 rounded-2xl bg-[var(--surface-ink)] p-4 text-white shadow-[0_15px_34px_rgba(34,38,48,0.16)]">
              <span class="grid size-10 place-items-center rounded-xl bg-white/12 text-blue-200">
                <Icon icon="solar:chart-square-linear" class="size-5" aria-hidden="true" />
              </span>
              <div>
                <p class="text-sm font-semibold">{{ t('auth.preview.progressTitle') }}</p>
                <p class="mt-0.5 text-sm text-slate-300">{{ t('auth.preview.progressDescription') }}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>
