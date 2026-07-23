<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

import { Checkbox } from '@/components/ui/checkbox'
import type { Task } from '../../features/workspace/api'

const props = defineProps<{
  task: Task
  selected?: boolean
  busy?: boolean
}>()

defineEmits<{
  select: []
  toggle: []
}>()

const projectDotClass = computed(() => ({
  BLUE: 'bg-[#4e8ff5]',
  VIOLET: 'bg-[#9a77ed]',
  GREEN: 'bg-[#48a66b]',
  AMBER: 'bg-[#e9a11d]',
  ROSE: 'bg-[#df6e91]',
})[props.task.projectColor ?? 'BLUE'])

const dueLabel = computed(() => {
  if (!props.task.dueDate) return null
  const today = new Date().toISOString().slice(0, 10)
  if (props.task.dueDate < today) return '已逾期'
  if (props.task.dueDate === today) return '今天到期'
  return `${Number(props.task.dueDate.slice(5, 7))} 月 ${Number(props.task.dueDate.slice(8, 10))} 日`
})
</script>

<template>
  <article
    class="group grid min-h-14 cursor-pointer grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-2 border-t border-[var(--border-subtle)] px-4 transition-colors first:border-t-0 hover:bg-[#fbfcff] sm:px-5"
    :class="{ 'bg-[var(--accent-soft)]/55': selected }"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keydown.enter.prevent="$emit('select')"
    @keydown.space.prevent="$emit('select')"
  >
    <Checkbox
      :model-value="task.status === 'DONE'"
      class="size-5 rounded-full"
      :disabled="busy"
      :aria-label="task.status === 'DONE' ? `重开：${task.title}` : `完成：${task.title}`"
      @click.stop
      @update:model-value="$emit('toggle')"
    />

    <div class="min-w-0 py-3">
      <p class="truncate text-sm font-medium text-[var(--text-primary)]" :class="{ 'text-[var(--text-secondary)] line-through': task.status === 'DONE' }">
        {{ task.title }}
      </p>
      <div class="mt-1 flex min-w-0 items-center gap-2 text-xs text-[var(--text-tertiary)]">
        <span v-if="task.projectName" class="inline-flex min-w-0 items-center gap-1.5 truncate">
          <span class="size-1.5 shrink-0 rounded-full" :class="projectDotClass" />
          <span class="truncate">{{ task.projectName }}</span>
        </span>
        <span v-if="dueLabel" class="inline-flex shrink-0 items-center gap-1" :class="{ 'text-[var(--danger)]': dueLabel === '已逾期' && task.status !== 'DONE' }">
          <Icon icon="solar:calendar-linear" class="size-3.5" aria-hidden="true" />
          {{ dueLabel }}
        </span>
        <span v-if="task.priority === 'HIGH'" class="inline-flex shrink-0 items-center gap-1 text-[#df6d5a]">
          <Icon icon="solar:flag-linear" class="size-3.5" aria-hidden="true" />
          高
        </span>
      </div>
    </div>

    <Icon icon="solar:alt-arrow-right-linear" class="size-4 text-[var(--text-tertiary)] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
  </article>
</template>
