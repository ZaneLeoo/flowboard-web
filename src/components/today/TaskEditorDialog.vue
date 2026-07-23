<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, reactive, watch } from 'vue'

import type { Project, Task, TaskDraft, TaskPriority, TaskStatus, TodayBucket } from '../../features/workspace/api'
import AppButton from '../ui/AppButton.vue'

const props = defineProps<{
  open: boolean
  projects: Project[]
  task?: Task | null
  defaultDate: string
  submitting?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [input: TaskDraft]
}>()

const form = reactive({
  title: '',
  description: '',
  projectId: '',
  status: 'TODO' as TaskStatus,
  priority: 'NONE' as TaskPriority,
  dueDate: '',
  placeToday: true,
  todayBucket: 'FOCUS' as TodayBucket,
})

const title = computed(() => props.task ? '编辑任务' : '新建任务')

function reset() {
  const task = props.task
  form.title = task?.title ?? ''
  form.description = task?.description ?? ''
  form.projectId = task?.projectId ?? ''
  form.status = task?.status ?? 'TODO'
  form.priority = task?.priority ?? 'NONE'
  form.dueDate = task?.dueDate ?? ''
  form.placeToday = task ? task.todayDate === props.defaultDate : true
  form.todayBucket = task?.todayBucket ?? 'FOCUS'
}

watch(() => [props.open, props.task, props.defaultDate], reset, { immediate: true })

function submit() {
  if (!form.title.trim()) return
  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim() || null,
    projectId: form.projectId || null,
    status: form.status,
    priority: form.priority,
    dueDate: form.dueDate || null,
    todayDate: form.placeToday ? props.defaultDate : null,
    todayBucket: form.placeToday ? form.todayBucket : null,
  })
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 grid place-items-end bg-[#16191f]/20 p-3 backdrop-blur-[2px] sm:place-items-center sm:p-6" @mousedown.self="$emit('close')">
      <section class="w-full max-w-xl rounded-[1.5rem] border border-white/90 bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-float)] sm:p-7" role="dialog" aria-modal="true" :aria-label="title">
        <header class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold tracking-[0.08em] text-[var(--accent-primary)]">今日工作台</p>
            <h2 class="mt-1 text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">{{ title }}</h2>
          </div>
          <button class="grid size-9 place-items-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)]" type="button" aria-label="关闭" @click="$emit('close')">
            <Icon icon="solar:close-circle-linear" class="size-5" aria-hidden="true" />
          </button>
        </header>

        <form class="mt-6 grid gap-4" @submit.prevent="submit">
          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[var(--text-primary)]">任务名称</span>
            <input v-model="form.title" class="min-h-11 rounded-xl border border-[var(--border-subtle)] bg-white px-3.5 text-sm outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)]" maxlength="160" placeholder="例如：完成产品原型评审" autofocus>
          </label>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-[var(--text-primary)]">项目</span>
              <select v-model="form.projectId" class="min-h-11 rounded-xl border border-[var(--border-subtle)] bg-white px-3.5 text-sm outline-none focus:border-[var(--accent-primary)]">
                <option value="">收集箱</option>
                <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
              </select>
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-[var(--text-primary)]">状态</span>
              <select v-model="form.status" class="min-h-11 rounded-xl border border-[var(--border-subtle)] bg-white px-3.5 text-sm outline-none focus:border-[var(--accent-primary)]">
                <option value="TODO">待开始</option>
                <option value="IN_PROGRESS">进行中</option>
                <option value="DONE">已完成</option>
              </select>
            </label>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-[var(--text-primary)]">优先级</span>
              <select v-model="form.priority" class="min-h-11 rounded-xl border border-[var(--border-subtle)] bg-white px-3.5 text-sm outline-none focus:border-[var(--accent-primary)]">
                <option value="NONE">无</option>
                <option value="LOW">低</option>
                <option value="MEDIUM">中</option>
                <option value="HIGH">高</option>
              </select>
            </label>
            <label class="grid gap-2">
              <span class="text-sm font-semibold text-[var(--text-primary)]">截止日期</span>
              <input v-model="form.dueDate" class="min-h-11 rounded-xl border border-[var(--border-subtle)] bg-white px-3.5 text-sm outline-none focus:border-[var(--accent-primary)]" type="date">
            </label>
          </div>

          <label class="flex min-h-12 items-center gap-3 rounded-xl bg-[var(--surface-muted)] px-3.5 text-sm text-[var(--text-primary)]">
            <input v-model="form.placeToday" class="size-4 accent-[var(--accent-primary)]" type="checkbox">
            安排到今天
            <select v-if="form.placeToday" v-model="form.todayBucket" class="ml-auto rounded-lg border border-[var(--border-subtle)] bg-white px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-[var(--accent-primary)]">
              <option value="FOCUS">聚焦</option>
              <option value="PLAN">计划</option>
              <option value="LATER">稍后</option>
            </select>
          </label>

          <label class="grid gap-2">
            <span class="text-sm font-semibold text-[var(--text-primary)]">备注 <span class="font-normal text-[var(--text-tertiary)]">（可选）</span></span>
            <textarea v-model="form.description" class="min-h-24 resize-y rounded-xl border border-[var(--border-subtle)] bg-white px-3.5 py-3 text-sm leading-6 outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)]" maxlength="10000" placeholder="写下需要记住的上下文" />
          </label>

          <footer class="mt-2 flex justify-end gap-3">
            <AppButton variant="ghost" :disabled="submitting" @click="$emit('close')">取消</AppButton>
            <AppButton type="submit" :loading="submitting">{{ task ? '保存修改' : '创建任务' }}</AppButton>
          </footer>
        </form>
      </section>
    </div>
  </Teleport>
</template>
