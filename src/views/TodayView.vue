<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import AppShell from '../components/layout/AppShell.vue'
import AppButton from '../components/ui/AppButton.vue'
import { useAuthStore } from '../stores/auth'

const { t, locale } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const isLoggingOut = ref(false)

const dateLabel = computed(() => new Intl.DateTimeFormat(locale.value, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(new Date()))

const displayName = computed(() => auth.user?.displayName ?? '')
const email = computed(() => auth.user?.email ?? '')
const workspaceName = computed(() => auth.workspace?.name ?? t('today.defaultWorkspace'))

async function logout() {
  if (isLoggingOut.value) {
    return
  }
  isLoggingOut.value = true
  try {
    await auth.logout()
    await router.replace('/login')
  }
  finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <AppShell :display-name="displayName" :email="email" @logout="logout">
    <main class="grid min-h-[calc(100svh-6rem)] gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <section class="rounded-[1.75rem] border border-white/80 bg-[var(--surface-raised)] p-5 shadow-[var(--shadow-subtle)] sm:p-8 lg:p-10">
        <header class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-sm font-semibold text-[var(--accent-primary)]">{{ workspaceName }}</p>
            <h1 class="mt-2 text-4xl font-semibold leading-[1.04] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl">{{ t('today.title') }}</h1>
            <p class="mt-3 text-[15px] text-[var(--text-secondary)]">{{ dateLabel }}</p>
          </div>
          <span class="inline-flex min-h-10 items-center gap-2 self-start rounded-xl border border-[var(--border-subtle)] bg-white/75 px-3 text-sm font-semibold text-[var(--text-secondary)]">
            <Icon icon="solar:bolt-circle-linear" class="size-4 text-[var(--accent-primary)]" aria-hidden="true" />
            {{ t('today.focusCount', { count: 0 }) }}
          </span>
        </header>

        <section class="mt-10 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-white/80 shadow-[var(--shadow-subtle)]">
          <div class="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4 sm:px-6">
            <div class="flex items-center gap-3">
              <span class="grid size-8 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-primary)]">
                <Icon icon="solar:star-linear" class="size-[18px]" aria-hidden="true" />
              </span>
              <div>
                <h2 class="text-sm font-semibold text-[var(--text-primary)]">{{ t('today.focusTitle') }}</h2>
                <p class="mt-0.5 text-xs text-[var(--text-tertiary)]">{{ t('today.focusSubtitle') }}</p>
              </div>
            </div>
            <span class="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]">0</span>
          </div>
          <div class="px-5 py-12 text-center sm:px-8 sm:py-16">
            <span class="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-secondary)]">
              <Icon icon="solar:checklist-minimalistic-linear" class="size-6" aria-hidden="true" />
            </span>
            <h3 class="mt-5 text-lg font-semibold tracking-[-0.025em] text-[var(--text-primary)]">{{ t('today.emptyTasksTitle') }}</h3>
            <p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">{{ t('today.emptyTasksDescription') }}</p>
          </div>
        </section>

        <section class="mt-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)]/75 p-5 sm:p-6">
          <div class="flex items-start gap-4">
            <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[var(--accent-primary)] shadow-[var(--shadow-subtle)]">
              <Icon icon="solar:folder-with-files-linear" class="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 class="text-base font-semibold tracking-[-0.025em] text-[var(--text-primary)]">{{ t('today.projectsTitle') }}</h2>
              <p class="mt-1.5 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">{{ t('today.projectsDescription') }}</p>
            </div>
          </div>
        </section>
      </section>

      <aside class="rounded-[1.75rem] border border-white/80 bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-panel)] sm:p-6 xl:sticky xl:top-4 xl:h-[calc(100svh-2rem)]">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-[var(--text-primary)]">{{ t('today.sideTitle') }}</p>
          <span class="grid size-8 place-items-center rounded-full bg-[var(--success-soft)] text-[var(--success)]">
            <Icon icon="solar:check-circle-bold" class="size-4" aria-hidden="true" />
          </span>
        </div>
        <p class="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{{ t('today.sideDescription', { name: displayName }) }}</p>

        <div class="mt-8 border-t border-[var(--border-subtle)] pt-5">
          <p class="text-xs font-semibold tracking-[0.08em] text-[var(--text-tertiary)]">{{ t('today.accountLabel') }}</p>
          <p class="mt-3 text-sm font-semibold text-[var(--text-primary)]">{{ displayName }}</p>
          <p class="mt-1 truncate text-sm text-[var(--text-secondary)]">{{ email }}</p>
        </div>

        <div class="mt-8 rounded-2xl bg-[var(--surface-muted)] p-4">
          <div class="flex gap-3">
            <Icon icon="solar:magic-stick-3-linear" class="mt-0.5 size-5 shrink-0 text-[var(--accent-primary)]" aria-hidden="true" />
            <div>
              <p class="text-sm font-semibold text-[var(--text-primary)]">{{ t('today.nextTitle') }}</p>
              <p class="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{{ t('today.nextDescription') }}</p>
            </div>
          </div>
        </div>

        <AppButton variant="ghost" :loading="isLoggingOut" class="mt-8 w-full xl:hidden" @click="logout">
          {{ t('auth.logout') }}
        </AppButton>
      </aside>
    </main>
  </AppShell>
</template>
