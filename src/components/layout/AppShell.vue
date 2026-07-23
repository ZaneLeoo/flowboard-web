<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

import BrandLogo from '../ui/BrandLogo.vue'

defineProps<{
  displayName: string
  email: string
}>()

defineEmits<{
  logout: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="min-h-svh bg-[var(--surface-canvas)] p-3 sm:p-4">
    <div class="mx-auto grid min-h-[calc(100svh-1.5rem)] max-w-[1600px] xl:grid-cols-[15.5rem_minmax(0,1fr)] xl:gap-4">
      <aside class="hidden min-h-0 rounded-[1.75rem] border border-white/80 bg-[var(--surface-sidebar)] p-3 shadow-[var(--shadow-subtle)] xl:flex xl:flex-col">
        <RouterLink to="/today" class="flex min-h-12 items-center rounded-xl px-2.5">
          <BrandLogo />
        </RouterLink>

        <nav class="mt-8 grid gap-1" :aria-label="t('nav.label')">
          <RouterLink to="/today" class="group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-white hover:text-[var(--text-primary)]" active-class="!bg-white !text-[var(--accent-primary)] shadow-[var(--shadow-subtle)]">
            <Icon icon="solar:calendar-date-linear" class="size-5" aria-hidden="true" />
            {{ t('nav.today') }}
          </RouterLink>
          <span class="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-[var(--text-tertiary)]" :aria-label="t('nav.projectsPending')">
            <Icon icon="solar:folder-linear" class="size-5" aria-hidden="true" />
            {{ t('nav.projects') }}
            <span class="ml-auto rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-[11px] font-semibold">{{ t('common.soon') }}</span>
          </span>
        </nav>

        <div class="mt-auto border-t border-[var(--border-subtle)] pt-3">
          <div class="rounded-2xl bg-white/75 p-3">
            <div class="flex min-w-0 items-center gap-3">
              <span class="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent-primary)]">
                {{ displayName.slice(0, 1).toUpperCase() }}
              </span>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-[var(--text-primary)]">{{ displayName }}</p>
                <p class="truncate text-xs text-[var(--text-tertiary)]">{{ email }}</p>
              </div>
            </div>
            <button class="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]" type="button" @click="$emit('logout')">
              <Icon icon="solar:logout-2-linear" class="size-4" aria-hidden="true" />
              {{ t('auth.logout') }}
            </button>
          </div>
        </div>
      </aside>

      <div class="min-w-0">
        <header class="mb-4 flex min-h-14 items-center justify-between rounded-2xl border border-white/80 bg-[var(--surface-raised)] px-4 shadow-[var(--shadow-subtle)] xl:hidden">
          <RouterLink to="/today" class="flex items-center">
            <BrandLogo size="sm" />
          </RouterLink>
          <button class="grid size-10 place-items-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]" type="button" :aria-label="t('auth.logout')" @click="$emit('logout')">
            <Icon icon="solar:logout-2-linear" class="size-5" aria-hidden="true" />
          </button>
        </header>
        <slot />
      </div>
    </div>
  </div>
</template>
