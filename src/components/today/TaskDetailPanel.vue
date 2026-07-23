<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

import { Checkbox } from '@/components/ui/checkbox'
import type { Task } from '../../features/workspace/api'
import { Button } from '../ui/button'

const props = defineProps<{
  task: Task
  busy?: boolean
}>()

defineEmits<{
  close: []
  toggle: []
  edit: []
  delete: []
}>()

const statusLabel = computed(() => ({
  TODO: '待开始',
  IN_PROGRESS: '进行中',
  DONE: '已完成',
})[props.task.status])

const priorityLabel = computed(() => ({
  NONE: '无优先级',
  LOW: '低',
  MEDIUM: '中',
  HIGH: '高',
})[props.task.priority])

const todayLabel = computed(() => ({
  FOCUS: '聚焦',
  PLAN: '计划',
  LATER: '稍后',
})[props.task.todayBucket ?? 'PLAN'])
</script>

<template>
  <aside class="h-fit overflow-hidden rounded-[1.5rem] border border-white/90 bg-[var(--surface-panel)] shadow-[var(--shadow-panel)] xl:sticky xl:top-4 xl:max-h-[calc(100svh-2rem)] xl:overflow-y-auto">
    <div class="flex items-center justify-between p-5 pb-3">
      <span class="text-xs font-semibold tracking-[0.08em] text-[var(--text-tertiary)]">任务详情</span>
      <Button variant="ghost" size="icon-sm" aria-label="关闭详情" @click="$emit('close')">
        <Icon icon="solar:close-circle-linear" class="size-5" aria-hidden="true" />
      </Button>
    </div>

    <div class="px-5 pb-6">
      <div class="flex items-start gap-3">
        <Checkbox :model-value="task.status === 'DONE'" class="mt-0.5 size-5 rounded-full" :disabled="busy" :aria-label="task.status === 'DONE' ? '重开任务' : '完成任务'" @update:model-value="$emit('toggle')" />
        <h2 class="min-w-0 text-xl font-semibold leading-7 tracking-[-0.03em] text-[var(--text-primary)]" :class="{ 'line-through text-[var(--text-secondary)]': task.status === 'DONE' }">{{ task.title }}</h2>
      </div>

      <dl class="mt-7 grid gap-1 border-y border-[var(--border-subtle)] py-4 text-sm">
        <div class="grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-3 py-2">
          <dt class="inline-flex items-center gap-2 text-[var(--text-tertiary)]"><Icon icon="solar:folder-linear" class="size-4" aria-hidden="true" />项目</dt>
          <dd class="truncate font-medium text-[var(--text-primary)]">{{ task.projectName ?? '收集箱' }}</dd>
        </div>
        <div class="grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-3 py-2">
          <dt class="inline-flex items-center gap-2 text-[var(--text-tertiary)]"><Icon icon="solar:flag-linear" class="size-4" aria-hidden="true" />优先级</dt>
          <dd class="font-medium text-[var(--text-primary)]">{{ priorityLabel }}</dd>
        </div>
        <div class="grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-3 py-2">
          <dt class="inline-flex items-center gap-2 text-[var(--text-tertiary)]"><Icon icon="solar:clock-circle-linear" class="size-4" aria-hidden="true" />状态</dt>
          <dd class="font-medium text-[var(--text-primary)]">{{ statusLabel }}</dd>
        </div>
        <div class="grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-3 py-2">
          <dt class="inline-flex items-center gap-2 text-[var(--text-tertiary)]"><Icon icon="solar:calendar-linear" class="size-4" aria-hidden="true" />截止日期</dt>
          <dd class="font-medium text-[var(--text-primary)]">{{ task.dueDate ?? '未设置' }}</dd>
        </div>
        <div v-if="task.todayDate" class="grid grid-cols-[6.25rem_minmax(0,1fr)] items-center gap-3 py-2">
          <dt class="inline-flex items-center gap-2 text-[var(--text-tertiary)]"><Icon icon="solar:calendar-date-linear" class="size-4" aria-hidden="true" />今天</dt>
          <dd class="font-medium text-[var(--text-primary)]">{{ todayLabel }}</dd>
        </div>
      </dl>

      <section class="mt-6">
        <p class="text-xs font-semibold tracking-[0.08em] text-[var(--text-tertiary)]">备注</p>
        <p class="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">{{ task.description || '暂无备注' }}</p>
      </section>

      <div class="mt-8 grid grid-cols-2 gap-3">
        <Button variant="secondary" @click="$emit('edit')"><Icon icon="solar:pen-linear" class="size-4" aria-hidden="true" />编辑</Button>
        <Button :loading="busy" @click="$emit('toggle')">{{ task.status === 'DONE' ? '重新打开' : '标记完成' }}</Button>
      </div>
      <Button variant="ghost" class="mt-4 !min-h-10 !px-0 text-[var(--danger)] hover:!bg-transparent hover:opacity-75" :disabled="busy" @click="$emit('delete')">
        <Icon icon="solar:trash-bin-trash-linear" class="size-4" aria-hidden="true" />删除任务
      </Button>
    </div>
  </aside>
</template>
