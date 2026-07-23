<script setup lang="ts">
import { Flag, GripVertical } from 'lucide-vue-next'
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
</script>

<template>
  <article
    class="group flex cursor-pointer items-center gap-3 border-t border-[var(--border-subtle)] px-4 py-3 transition-colors first:border-t-0 hover:bg-[#fafafa]"
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

    <p
      class="min-w-0 flex-1 truncate text-sm text-[var(--text-primary)]"
      :class="{ 'text-[var(--text-tertiary)] line-through': task.status === 'DONE' }"
    >
      {{ task.title }}
    </p>

    <span
      v-if="task.priority === 'HIGH'"
      class="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[#df6d5a]"
    >
      <Flag class="size-3.5" aria-hidden="true" />
      高
    </span>

    <span
      v-if="task.projectName"
      class="hidden shrink-0 items-center gap-1.5 text-xs text-[var(--text-tertiary)] sm:inline-flex"
    >
      <span class="size-1.5 rounded-full" :class="projectDotClass" />
      {{ task.projectName }}
    </span>

    <GripVertical class="size-4 shrink-0 text-[#d4d4d8]" aria-hidden="true" />
  </article>
</template>
