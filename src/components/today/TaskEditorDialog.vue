<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Project, Task, TaskDraft, TaskPriority, TaskStatus, TodayBucket } from '@/features/workspace/api'

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

const inboxValue = '__INBOX__'
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
const projectValue = computed({
  get: () => form.projectId || inboxValue,
  set: (value: string) => {
    form.projectId = value === inboxValue ? '' : value
  },
})

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
  <Dialog :open="open" @update:open="open => !open && $emit('close')">
    <DialogContent class="max-w-xl">
      <DialogHeader>
        <p class="text-xs font-semibold tracking-[0.08em] text-[var(--accent-primary)]">今日工作台</p>
        <DialogTitle class="text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">{{ title }}</DialogTitle>
      </DialogHeader>

      <form class="grid gap-4" @submit.prevent="submit">
        <div class="grid gap-2">
          <Label for="task-title">任务名称</Label>
          <Input id="task-title" v-model="form.title" maxlength="160" placeholder="例如：完成产品原型评审" autofocus />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="grid gap-2">
            <Label>项目</Label>
            <Select v-model="projectValue">
              <SelectTrigger><SelectValue placeholder="选择项目" /></SelectTrigger>
              <SelectContent>
                <SelectItem :value="inboxValue">收集箱</SelectItem>
                <SelectItem v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-2">
            <Label>状态</Label>
            <Select v-model="form.status">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">待开始</SelectItem>
                <SelectItem value="IN_PROGRESS">进行中</SelectItem>
                <SelectItem value="DONE">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="grid gap-2">
            <Label>优先级</Label>
            <Select v-model="form.priority">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">无</SelectItem>
                <SelectItem value="LOW">低</SelectItem>
                <SelectItem value="MEDIUM">中</SelectItem>
                <SelectItem value="HIGH">高</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-2">
            <Label for="task-due-date">截止日期</Label>
            <Input id="task-due-date" v-model="form.dueDate" type="date" />
          </div>
        </div>

        <div class="flex min-h-12 items-center gap-3 rounded-xl bg-[var(--surface-muted)] px-3.5 text-sm text-[var(--text-primary)]">
          <Checkbox id="task-place-today" v-model="form.placeToday" />
          <Label for="task-place-today" class="cursor-pointer">安排到今天</Label>
          <Select v-if="form.placeToday" v-model="form.todayBucket">
            <SelectTrigger class="ml-auto min-h-8 w-20 rounded-lg px-2.5 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="FOCUS">聚焦</SelectItem>
              <SelectItem value="PLAN">计划</SelectItem>
              <SelectItem value="LATER">稍后</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="grid gap-2">
          <Label for="task-description">备注 <span class="font-normal text-[var(--text-tertiary)]">（可选）</span></Label>
          <Textarea id="task-description" v-model="form.description" maxlength="10000" placeholder="写下需要记住的上下文" />
        </div>

        <DialogFooter>
          <Button variant="ghost" :disabled="submitting" @click="$emit('close')">取消</Button>
          <Button type="submit" :loading="submitting">{{ task ? '保存修改' : '创建任务' }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
