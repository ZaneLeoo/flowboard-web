<script setup lang="ts">
import { CalendarDays, Flag, Folder, Inbox, Target, X } from 'lucide-vue-next'
import { computed, reactive, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Project, TaskDraft, TaskPriority, TodayBucket } from '@/features/workspace/api'

const props = withDefaults(defineProps<{
  open: boolean
  projects: Project[]
  defaultDate: string
  defaultBucket?: TodayBucket
  submitting?: boolean
}>(), {
  defaultBucket: 'FOCUS',
  submitting: false,
})

const emit = defineEmits<{
  close: []
  submit: [input: TaskDraft]
}>()

const inboxValue = '__INBOX__'
const form = reactive({
  title: '',
  description: '',
  projectId: '',
  priority: 'NONE' as TaskPriority,
  dueDate: '',
  todayBucket: 'FOCUS' as TodayBucket,
})

const projectValue = computed({
  get: () => form.projectId || inboxValue,
  set: (value: string) => {
    form.projectId = value === inboxValue ? '' : value
  },
})

const dueDateText = computed(() => form.dueDate ? '截止日期' : '截止日期')

function reset() {
  form.title = ''
  form.description = ''
  form.projectId = ''
  form.priority = 'NONE'
  form.dueDate = ''
  form.todayBucket = props.defaultBucket
}

watch(() => [props.open, props.defaultDate, props.defaultBucket], reset, { immediate: true })

function submit() {
  const title = form.title.trim()
  if (!title) return

  emit('submit', {
    title,
    description: form.description.trim() || null,
    projectId: form.projectId || null,
    status: 'TODO',
    priority: form.priority,
    dueDate: form.dueDate || null,
    todayDate: props.defaultDate,
    todayBucket: form.todayBucket,
  })
}
</script>

<template>
  <form
    v-if="open"
    class="mt-7 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-white shadow-[var(--shadow-panel)]"
    @submit.prevent="submit"
    @keydown.esc.prevent="$emit('close')"
  >
    <div class="p-4 sm:p-5">
      <Input
        v-model="form.title"
        autofocus
        maxlength="160"
        placeholder="任务名称"
        aria-label="任务名称"
        class="h-10 rounded-none border-x-0 border-t-0 border-b border-[var(--border-strong)] bg-transparent px-0 text-lg font-semibold tracking-[-0.02em] shadow-none focus:border-[var(--accent-primary)] focus-visible:border-[var(--accent-primary)] focus-visible:ring-0"
      />
      <Textarea
        v-model="form.description"
        maxlength="10000"
        rows="2"
        placeholder="描述"
        aria-label="任务描述"
        class="mt-1 min-h-12 resize-none rounded-none border-0 bg-transparent px-0 py-1 text-sm text-[var(--text-secondary)] shadow-none focus:border-transparent focus-visible:ring-0"
      />

      <div class="flex flex-wrap items-center gap-2 pt-3">
        <Button type="button" variant="outline" size="sm" class="h-8 gap-1.5 rounded-lg border-[var(--border-subtle)] px-2.5 text-xs font-medium text-[var(--text-secondary)]">
          <CalendarDays class="size-3.5 text-[#159447]" aria-hidden="true" />
          今天
          <X class="ml-0.5 size-3 text-[var(--text-tertiary)]" aria-hidden="true" />
        </Button>

        <DatePicker
          v-model="form.dueDate"
          :placeholder="dueDateText"
          clearable
          class="h-8 min-h-8 w-auto gap-1.5 rounded-lg border-[var(--border-subtle)] px-2.5 text-xs text-[var(--text-secondary)]"
        />

        <Select v-model="form.priority">
          <SelectTrigger class="h-8 w-auto gap-1.5 rounded-lg border-[var(--border-subtle)] px-2.5 text-xs text-[var(--text-secondary)]">
            <Flag class="size-3.5" aria-hidden="true" />
            <SelectValue placeholder="优先级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NONE">无优先级</SelectItem>
            <SelectItem value="LOW">低优先级</SelectItem>
            <SelectItem value="MEDIUM">中优先级</SelectItem>
            <SelectItem value="HIGH">高优先级</SelectItem>
          </SelectContent>
        </Select>

        <Select v-model="projectValue">
          <SelectTrigger class="h-8 w-auto max-w-44 gap-1.5 rounded-lg border-[var(--border-subtle)] px-2.5 text-xs text-[var(--text-secondary)]">
            <Folder v-if="form.projectId" class="size-3.5" aria-hidden="true" />
            <Inbox v-else class="size-3.5" aria-hidden="true" />
            <SelectValue placeholder="收集箱" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="inboxValue">收集箱</SelectItem>
            <SelectItem v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3 border-t border-[var(--border-subtle)] px-4 py-3 sm:px-5">
      <Select v-model="form.todayBucket">
        <SelectTrigger class="h-9 w-auto min-w-24 gap-2 rounded-lg border-0 bg-[var(--surface-muted)] px-2.5 text-sm font-semibold text-[var(--text-secondary)] shadow-none">
          <Target class="size-4" aria-hidden="true" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="FOCUS">聚焦</SelectItem>
          <SelectItem value="PLAN">计划</SelectItem>
          <SelectItem value="LATER">稍后</SelectItem>
        </SelectContent>
      </Select>

      <div class="ml-auto flex items-center gap-2">
        <Button type="button" variant="ghost" :disabled="submitting" class="text-[var(--text-secondary)]" @click="$emit('close')">取消</Button>
        <Button type="submit" :loading="submitting" class="min-w-24">添加任务</Button>
      </div>
    </div>
  </form>
</template>
