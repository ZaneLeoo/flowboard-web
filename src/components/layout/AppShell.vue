<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

import type { Project } from '../../features/workspace/api'
import BrandLogo from '../ui/BrandLogo.vue'
import { Button } from '../ui/button'

withDefaults(defineProps<{
  displayName: string
  email: string
  projects?: Project[]
  selectedProjectId?: string | null
}>(), {
  projects: () => [],
  selectedProjectId: null,
})

defineEmits<{
  logout: []
  createProject: []
  selectProject: [projectId: string]
}>()

const { t } = useI18n()

function projectColorClass(color: Project['color']) {
  return {
    BLUE: 'bg-[#4e8ff5]',
    VIOLET: 'bg-[#9a77ed]',
    GREEN: 'bg-[#48a66b]',
    AMBER: 'bg-[#e9a11d]',
    ROSE: 'bg-[#df6e91]',
  }[color]
}
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
        </nav>

        <section class="mt-7">
          <div class="flex items-center justify-between px-3">
            <p class="text-[11px] font-semibold tracking-[0.1em] text-[var(--text-tertiary)]">{{ t('nav.projects') }}</p>
            <Button variant="ghost" size="icon-sm" class="text-[var(--text-secondary)] hover:bg-white hover:text-[var(--accent-primary)]" aria-label="新建项目" @click="$emit('createProject')">
              <Icon icon="solar:add-circle-linear" class="size-4" aria-hidden="true" />
            </Button>
          </div>
          <div class="mt-2 grid gap-1">
            <Button
              v-for="project in projects"
              :key="project.id"
              variant="ghost"
              class="flex min-h-10 w-full items-center justify-start gap-2.5 rounded-xl px-3 text-left text-sm font-medium text-[var(--text-secondary)] hover:bg-white hover:text-[var(--text-primary)]"
              :class="{ 'bg-white text-[var(--text-primary)] shadow-[var(--shadow-subtle)]': selectedProjectId === project.id }"
              @click="$emit('selectProject', project.id)"
            >
              <span class="size-2 shrink-0 rounded-full" :class="projectColorClass(project.color)" />
              <span class="truncate">{{ project.name }}</span>
            </Button>
            <p v-if="!projects.length" class="px-3 py-2 text-xs leading-5 text-[var(--text-tertiary)]">创建一个项目，开始整理你的节奏。</p>
          </div>
        </section>

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
            <Button variant="ghost" class="mt-3 w-full text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]" @click="$emit('logout')">
              <Icon icon="solar:logout-2-linear" class="size-4" aria-hidden="true" />
              {{ t('auth.logout') }}
            </Button>
          </div>
        </div>
      </aside>

      <div class="min-w-0">
        <header class="mb-4 flex min-h-14 items-center justify-between rounded-2xl border border-white/80 bg-[var(--surface-raised)] px-4 shadow-[var(--shadow-subtle)] xl:hidden">
          <RouterLink to="/today" class="flex items-center">
            <BrandLogo size="sm" />
          </RouterLink>
          <Button variant="ghost" size="icon" :aria-label="t('auth.logout')" @click="$emit('logout')">
            <Icon icon="solar:logout-2-linear" class="size-5" aria-hidden="true" />
          </Button>
        </header>
        <slot />
      </div>
    </div>
  </div>
</template>
