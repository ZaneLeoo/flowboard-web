<script setup lang="ts">
import { CalendarDays, Flag, GripVertical, Inbox } from 'lucide-vue-next'
import { computed } from 'vue'

import { Checkbox } from '@/components/ui/checkbox'
import type { Task } from '../../features/workspace/api'

const props = defineProps<{
  task: Task
  selected?: boolean
  busy?: boolean
  overdue?: boolean
  showDueDate?: boolean
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

const dueDateLabel = computed(() => {
  if (!props.task.dueDate) return ''
  const date = new Date(`${props.task.dueDate}T12:00:00`)
  if (Number.isNaN(date.getTime())) return props.task.dueDate
  return `${date.getMonth() + 1}月${date.getDate()}日`
})
</script>

<template>
  <article
    class="group grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 border-b border-[var(--border-subtle)] px-0 py-4 transition-colors last:border-b-0 hover:bg-[#fafafa] sm:gap-x-4"
    :class="{ 'bg-[var(--accent-soft)]/40 hover:bg-[var(--accent-soft)]/55': selected }"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keydown.enter.prevent="$emit('select')"
    @keydown.space.prevent="$emit('select')"
  >
    <Checkbox
      :model-value="task.status === 'DONE'"
      class="size-[18px] rounded-full"
      :disabled="busy"
      :aria-label="task.status === 'DONE' ? `重开：${task.title}` : `完成：${task.title}`"
      @click.stop
      @update:model-value="$emit('toggle')"
    />

    <div class="min-w-0">
      <p
        class="truncate text-[15px] leading-6 text-[var(--text-primary)]"
        :class="{ 'text-[var(--text-tertiary)] line-through': task.status === 'DONE' }"
      >
        {{ task.title }}
      </p>
      <div v-if="showDueDate !== false && dueDateLabel" class="mt-0.5 flex items-center gap-1.5 text-xs" :class="overdue ? 'text-[var(--danger)]' : 'text-[var(--text-tertiary)]'">
        <CalendarDays class="size-3.5" aria-hidden="true" />
        {{ dueDateLabel }}
        <span v-if="task.priority === 'HIGH'" class="inline-flex items-center gap-1 font-medium text-[#df6d5a]">
          <Flag class="size-3" aria-hidden="true" />
          高优先级
        </span>
      </div>
    </div>

    <div class="flex min-w-0 items-center justify-end gap-2">
      <span class="hidden min-w-0 max-w-36 items-center gap-1.5 truncate text-xs text-[var(--text-tertiary)] sm:inline-flex">
        <span v-if="task.projectName" class="size-1.5 shrink-0 rounded-full" :class="projectDotClass" />
        <Inbox v-else class="size-3.5 shrink-0" aria-hidden="true" />
        <span class="truncate">{{ task.projectName ?? '收集箱' }}</span>
      </span>
      <GripVertical class="size-4 shrink-0 text-[#d4d4d8]" aria-hidden="true" />
    </div>
  </article>
</template>
