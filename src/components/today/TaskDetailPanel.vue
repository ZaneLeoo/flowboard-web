<script setup lang="ts">
import {
  AlignLeft,
  Calendar,
  Ellipsis,
  Flag,
  Folder,
  ListChecks,
  Pencil,
  Plus,
  SendHorizontal,
  Star,
  Tag,
  Timer,
  Trash2,
  X,
} from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import type { Project, Task, TaskDraft, TaskPriority } from '../../features/workspace/api'
import { Button } from '../ui/button'

const props = withDefaults(defineProps<{
  task: Task
  projects: Project[]
  avatarInitial?: string
  busy?: boolean
}>(), {
  avatarInitial: '我',
  busy: false,
})

const emit = defineEmits<{
  close: []
  toggle: []
  edit: []
  delete: []
  update: [patch: Partial<TaskDraft>]
}>()

const inboxValue = '__INBOX__'

const projectValue = computed({
  get: () => props.task.projectId ?? inboxValue,
  set: (value: string) => emit('update', { projectId: value === inboxValue ? null : value }),
})

const priorityValue = computed({
  get: () => props.task.priority,
  set: (value: string) => emit('update', { priority: value as TaskPriority }),
})

const priorityOptions: { value: TaskPriority, label: string }[] = [
  { value: 'NONE', label: '无' },
  { value: 'LOW', label: '低' },
  { value: 'MEDIUM', label: '中' },
  { value: 'HIGH', label: '高' },
]

const priorityLabel = computed(() => priorityOptions.find(option => option.value === props.task.priority)?.label ?? '无')

const projectDotClass = computed(() => ({
  BLUE: 'bg-[#4e8ff5]',
  VIOLET: 'bg-[#9a77ed]',
  GREEN: 'bg-[#48a66b]',
  AMBER: 'bg-[#e9a11d]',
  ROSE: 'bg-[#df6e91]',
})[props.task.projectColor ?? 'BLUE'])

// 以下为后端暂未支持的本地交互状态（星标、标签、清单、评论）
const starred = ref(false)
const tags = ref<string[]>([])
const isAddingTag = ref(false)
const tagDraft = ref('')
const checklist = ref<{ id: number, text: string, done: boolean }[]>([])
const isAddingSubtask = ref(false)
const subtaskDraft = ref('')
const comments = ref<{ id: number, text: string }[]>([])
const commentDraft = ref('')
const moreMenuOpen = ref(false)

const checklistDone = computed(() => checklist.value.filter(item => item.done).length)

const isEditingNotes = ref(false)
const notesDraft = ref('')

watch(() => props.task.id, () => {
  starred.value = false
  tags.value = []
  checklist.value = []
  comments.value = []
  isAddingTag.value = false
  isAddingSubtask.value = false
  isEditingNotes.value = false
})

function addTag() {
  const value = tagDraft.value.trim()
  if (value && !tags.value.includes(value)) tags.value.push(value)
  tagDraft.value = ''
  isAddingTag.value = false
}

function removeTag(tag: string) {
  tags.value = tags.value.filter(item => item !== tag)
}

function addSubtask() {
  const text = subtaskDraft.value.trim()
  if (text) checklist.value.push({ id: Date.now(), text, done: false })
  subtaskDraft.value = ''
  isAddingSubtask.value = false
}

function addComment() {
  const text = commentDraft.value.trim()
  if (text) comments.value.push({ id: Date.now(), text })
  commentDraft.value = ''
}

function startEditNotes() {
  notesDraft.value = props.task.description ?? ''
  isEditingNotes.value = true
}

function saveNotes() {
  const value = notesDraft.value.trim()
  if (value !== (props.task.description ?? '')) {
    emit('update', { description: value || null })
  }
  isEditingNotes.value = false
}

function timeEstimateSoon() {
  toast('时间预估即将支持')
}

const rowLabelClass = 'flex items-center gap-2 text-[13px] text-[var(--text-tertiary)]'
const valueButtonClass = 'flex min-h-8 w-full items-center rounded-lg px-2 text-left text-[13px] text-[var(--text-primary)] transition-colors hover:bg-[#f4f4f5]'
</script>

<template>
  <aside class="flex h-full min-h-0 w-full flex-col bg-white/95 backdrop-blur-sm">
    <div class="flex shrink-0 justify-end px-3 pt-3">
      <Button variant="ghost" size="icon-sm" aria-label="关闭详情" @click="$emit('close')">
        <X class="size-4" aria-hidden="true" />
      </Button>
    </div>

    <ScrollArea class="min-h-0 flex-1">
      <div class="px-5 pb-4">
      <div class="flex items-start gap-3">
        <Checkbox
          :model-value="task.status === 'DONE'"
          class="mt-1.5 size-5 rounded-full"
          :disabled="busy"
          :aria-label="task.status === 'DONE' ? '重开任务' : '完成任务'"
          @update:model-value="$emit('toggle')"
        />
        <h2
          class="min-w-0 flex-1 text-lg font-semibold leading-7 text-[var(--text-primary)]"
          :class="{ 'text-[var(--text-tertiary)] line-through': task.status === 'DONE' }"
        >{{ task.title }}</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          class="mt-0.5 shrink-0"
          :class="starred ? 'text-[#e9a11d]' : 'text-[#d4d4d8] hover:text-[#e9a11d]'"
          aria-label="星标任务"
          @click="starred = !starred"
        >
          <Star class="size-[18px]" :fill="starred ? 'currentColor' : 'none'" aria-hidden="true" />
        </Button>
        <Popover v-model:open="moreMenuOpen">
          <PopoverTrigger as-child>
            <Button
              variant="ghost"
              size="icon-sm"
              class="mt-0.5 shrink-0"
              aria-label="更多操作"
            >
              <Ellipsis class="size-[18px]" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            :side-offset="6"
            class="w-40 rounded-xl border-[var(--border-subtle)] bg-white p-1.5 shadow-[var(--shadow-panel)]"
          >
            <Button
              variant="ghost"
              class="h-auto w-full justify-start rounded-lg px-2.5 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[#f4f4f5] hover:text-[var(--text-primary)]"
              @click="$emit('edit'); moreMenuOpen = false"
            >
              <Pencil class="size-4" aria-hidden="true" />
              编辑任务
            </Button>
            <Button
              variant="ghost"
              class="h-auto w-full justify-start rounded-lg px-2.5 py-2 text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger-soft)]"
              @click="$emit('delete'); moreMenuOpen = false"
            >
              <Trash2 class="size-4" aria-hidden="true" />
              删除任务
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <dl class="mt-6">
        <div class="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-2 py-0.5">
          <dt :class="rowLabelClass"><Folder class="size-4" aria-hidden="true" />项目</dt>
          <dd>
            <Select v-model="projectValue">
              <SelectTrigger class="min-h-8 gap-2 border-transparent bg-transparent px-2 py-1 text-[13px] shadow-none hover:bg-[#f4f4f5] focus:ring-2 focus:ring-[var(--accent-soft)]">
                <span class="flex min-w-0 items-center gap-2">
                  <span v-if="task.projectName" class="size-2 shrink-0 rounded-full" :class="projectDotClass" />
                  <span class="truncate">{{ task.projectName ?? '收集箱' }}</span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="inboxValue">收集箱</SelectItem>
                <SelectItem v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</SelectItem>
              </SelectContent>
            </Select>
          </dd>
        </div>

        <div class="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-2 py-0.5">
          <dt :class="rowLabelClass"><Flag class="size-4" aria-hidden="true" />优先级</dt>
          <dd>
            <Select v-model="priorityValue">
              <SelectTrigger class="min-h-8 gap-2 border-transparent bg-transparent px-2 py-1 text-[13px] shadow-none hover:bg-[#f4f4f5] focus:ring-2 focus:ring-[var(--accent-soft)]">
                <span class="flex min-w-0 items-center gap-2" :class="{ 'text-[#df6d5a]': task.priority === 'HIGH' }">
                  <Flag class="size-3.5 shrink-0" aria-hidden="true" />
                  <span class="truncate">{{ priorityLabel }}</span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="option in priorityOptions" :key="option.value" :value="option.value">{{ option.label }}</SelectItem>
              </SelectContent>
            </Select>
          </dd>
        </div>

        <div class="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-2 py-0.5">
          <dt :class="rowLabelClass"><Timer class="size-4" aria-hidden="true" />时间预估</dt>
          <dd>
            <button type="button" :class="valueButtonClass" @click="timeEstimateSoon">
              <span class="text-[var(--text-tertiary)]">—</span>
            </button>
          </dd>
        </div>

        <div class="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-2 py-0.5">
          <dt :class="rowLabelClass"><Calendar class="size-4" aria-hidden="true" />截止日期</dt>
          <dd>
            <DatePicker
              :model-value="task.dueDate"
              clearable
              :class="valueButtonClass"
              @update:model-value="value => emit('update', { dueDate: value || null })"
            />
          </dd>
        </div>

        <div class="grid grid-cols-[7.5rem_minmax(0,1fr)] items-start gap-2 py-0.5">
          <dt :class="[rowLabelClass, 'pt-1.5']"><Tag class="size-4" aria-hidden="true" />标签</dt>
          <dd class="flex min-h-8 flex-wrap items-center gap-1.5 px-2 py-1">
            <span
              v-for="tag in tags"
              :key="tag"
              class="inline-flex items-center gap-1 rounded-md bg-[#f4f4f5] px-2 py-1 text-xs font-medium text-[var(--text-secondary)]"
            >
              {{ tag }}
              <button
                type="button"
                class="text-[var(--text-tertiary)] transition-colors hover:text-[var(--danger)]"
                :aria-label="`移除标签 ${tag}`"
                @click="removeTag(tag)"
              >×</button>
            </span>
            <Input
              v-if="isAddingTag"
              v-model="tagDraft"
              class="h-7 min-h-0 w-24 rounded-md px-2 text-xs"
              placeholder="标签名"
              autofocus
              @keyup.enter="addTag"
              @blur="addTag"
            />
            <button
              v-else
              type="button"
              class="grid size-6 place-items-center rounded-md text-[var(--text-tertiary)] transition-colors hover:bg-[#f4f4f5] hover:text-[var(--text-primary)]"
              aria-label="添加标签"
              @click="isAddingTag = true"
            >
              <Plus class="size-3.5" aria-hidden="true" />
            </button>
          </dd>
        </div>
      </dl>

      <Separator class="my-5 bg-[var(--border-subtle)]" />

      <section>
        <p :class="rowLabelClass"><AlignLeft class="size-4" aria-hidden="true" />备注</p>
        <Textarea
          v-if="isEditingNotes"
          v-model="notesDraft"
          class="mt-2 min-h-24 text-sm"
          placeholder="写下需要记住的上下文"
          autofocus
          @blur="saveNotes"
          @keydown.meta.enter.prevent="saveNotes"
          @keydown.ctrl.enter.prevent="saveNotes"
        />
        <p
          v-else
          class="mt-2 cursor-text whitespace-pre-wrap rounded-lg px-2 py-1.5 text-sm leading-6 transition-colors hover:bg-[#fafafa]"
          :class="task.description ? 'text-[var(--text-secondary)]' : 'text-[var(--text-tertiary)]'"
          @click="startEditNotes"
        >{{ task.description || '点击添加备注…' }}</p>
      </section>

      <section class="mt-6">
        <div class="flex items-center justify-between">
          <p :class="rowLabelClass"><ListChecks class="size-4" aria-hidden="true" />清单</p>
          <span v-if="checklist.length" class="text-xs text-[var(--text-tertiary)]">{{ checklistDone }}/{{ checklist.length }}</span>
        </div>
        <div class="mt-1 grid">
          <label
            v-for="item in checklist"
            :key="item.id"
            class="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-[#fafafa]"
          >
            <Checkbox v-model="item.done" class="size-4" />
            <span
              class="text-sm text-[var(--text-primary)]"
              :class="{ 'text-[var(--text-tertiary)] line-through': item.done }"
            >{{ item.text }}</span>
          </label>
        </div>
        <Input
          v-if="isAddingSubtask"
          v-model="subtaskDraft"
          class="mt-1 h-8 min-h-0 text-sm"
          placeholder="子任务名称，回车添加"
          autofocus
          @keyup.enter="addSubtask"
          @blur="addSubtask"
        />
        <button
          v-else
          type="button"
          class="mt-1.5 flex items-center gap-1.5 px-2 text-[13px] font-medium text-[var(--accent-primary)] transition-colors hover:opacity-80"
          @click="isAddingSubtask = true"
        >
          <Plus class="size-3.5" aria-hidden="true" />
          添加子任务
        </button>
      </section>
      </div>
    </ScrollArea>

    <div class="shrink-0 border-t border-[var(--border-subtle)] p-4">
      <div v-if="comments.length" class="mb-3 grid max-h-32 gap-2 overflow-y-auto">
        <div v-for="comment in comments" :key="comment.id" class="flex items-start gap-2">
          <span class="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[10px] font-bold text-[var(--accent-primary)]">{{ avatarInitial }}</span>
          <p class="rounded-lg bg-[#f4f4f5] px-2.5 py-1.5 text-[13px] text-[var(--text-primary)]">{{ comment.text }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent-primary)]">{{ avatarInitial }}</span>
        <Input
          v-model="commentDraft"
          class="min-h-9 flex-1 rounded-full px-3.5 text-[13px]"
          placeholder="添加评论…"
          @keyup.enter="addComment"
        />
        <Button variant="ghost" size="icon-sm" aria-label="发送评论" @click="addComment">
          <SendHorizontal class="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  </aside>
</template>
