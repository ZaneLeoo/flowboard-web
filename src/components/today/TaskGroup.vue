<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { Task } from '../../features/workspace/api'
import TaskRow from './TaskRow.vue'

defineProps<{
  title: string
  subtitle: string
  icon: string
  tasks: Task[]
  selectedTaskId: string | null
  busyTaskId: string | null
  emptyText: string
}>()

defineEmits<{
  select: [task: Task]
  toggle: [task: Task]
}>()
</script>

<template>
  <section class="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] shadow-[var(--shadow-subtle)]">
    <header class="flex min-h-16 items-center justify-between px-4 sm:px-5">
      <div class="flex min-w-0 items-center gap-3">
        <span class="grid size-8 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent-primary)]">
          <Icon :icon="icon" class="size-[18px]" aria-hidden="true" />
        </span>
        <div class="min-w-0">
          <h2 class="text-sm font-semibold text-[var(--text-primary)]">{{ title }}</h2>
          <p class="mt-0.5 truncate text-xs text-[var(--text-tertiary)]">{{ subtitle }}</p>
        </div>
      </div>
      <span class="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]">{{ tasks.length }}</span>
    </header>
    <div v-if="tasks.length">
      <TaskRow
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :selected="selectedTaskId === task.id"
        :busy="busyTaskId === task.id"
        @select="$emit('select', task)"
        @toggle="$emit('toggle', task)"
      />
    </div>
    <p v-else class="border-t border-[var(--border-subtle)] px-5 py-5 text-sm text-[var(--text-tertiary)]">{{ emptyText }}</p>
  </section>
</template>
