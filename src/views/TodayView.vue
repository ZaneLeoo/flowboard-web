<script setup lang="ts">
import { ChevronDown, GripVertical, Plus } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import AppShell from '../components/layout/AppShell.vue'
import InlineTaskComposer from '../components/today/InlineTaskComposer.vue'
import TaskDetailPanel from '../components/today/TaskDetailPanel.vue'
import TaskEditorDialog from '../components/today/TaskEditorDialog.vue'
import TaskRow from '../components/today/TaskRow.vue'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'
import { Button } from '../components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import type { Task, TaskDraft, TodayBucket } from '../features/workspace/api'
import { useAuthStore } from '../stores/auth'
import { useTodayStore } from '../stores/today'

const { locale } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const today = useTodayStore()

const isLoggingOut = ref(false)
const composerOpen = ref(false)
const composerBucket = ref<TodayBucket>('FOCUS')
const composerSubmitting = ref(false)
const taskDialogOpen = ref(false)
const taskBucketMenuOpen = ref(false)
const editingTask = ref<Task | null>(null)
const defaultBucket = ref<TodayBucket>('FOCUS')
const taskSubmitting = ref(false)
const taskToDelete = ref<Task | null>(null)
const showCompleted = ref(false)

const displayName = computed(() => auth.user?.displayName ?? '')
const email = computed(() => auth.user?.email ?? '')
const avatarInitial = computed(() => (displayName.value || '我').slice(0, 1).toUpperCase())
const selectedTask = computed(() => today.selectedTask)

const dateLabel = computed(() => new Intl.DateTimeFormat(locale.value, {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date(`${today.date}T12:00:00`)))

const activeTasks = computed(() => {
  const bucketOrder: Record<TodayBucket, number> = { FOCUS: 0, PLAN: 1, LATER: 2 }
  return [...today.data.focus, ...today.data.plan, ...today.data.later]
    .sort((a, b) => (bucketOrder[a.todayBucket ?? 'LATER'] - bucketOrder[b.todayBucket ?? 'LATER']) || (a.sortOrder - b.sortOrder))
})

const overdueTasks = computed(() => activeTasks.value.filter(task => Boolean(task.dueDate && task.dueDate < today.date)))
const todayTasks = computed(() => activeTasks.value.filter(task => !task.dueDate || task.dueDate >= today.date))
const completedTasks = computed(() => today.data.done)
const totalTasks = computed(() => activeTasks.value.length + completedTasks.value.length)
const doneTasksCount = computed(() => today.data.done.length)
const dateSectionLabel = computed(() => {
  const value = new Date(`${today.date}T12:00:00`)
  const weekday = new Intl.DateTimeFormat(locale.value, { weekday: 'short' }).format(value).replace('星期', '周')
  return `${value.getMonth() + 1}月${value.getDate()}日 · 今天 · ${weekday}`
})

const bucketOptions: { value: TodayBucket, label: string }[] = [
  { value: 'FOCUS', label: '添加到聚焦' },
  { value: 'PLAN', label: '添加到计划' },
  { value: 'LATER', label: '添加到稍后' },
]

function readableError(error: unknown) {
  return error instanceof Error ? error.message : '操作未能完成，请稍后再试'
}

function selectTask(task: Task) {
  today.selectedTaskId = task.id
}

function openQuickCreate(bucket?: TodayBucket) {
  composerBucket.value = bucket ?? 'FOCUS'
  composerOpen.value = true
  taskBucketMenuOpen.value = false
}

function openEditTask(task: Task) {
  editingTask.value = task
  taskDialogOpen.value = true
}

async function saveTask(input: TaskDraft) {
  taskSubmitting.value = true
  try {
    if (editingTask.value) {
      await today.updateTask(editingTask.value, input)
      toast.success('任务已保存')
    }
    else {
      await today.createTask(input)
      toast.success('任务已创建，并安排到今天')
    }
    taskDialogOpen.value = false
  }
  catch (error) {
    toast.error(readableError(error))
  }
  finally {
    taskSubmitting.value = false
  }
}

async function saveQuickTask(input: TaskDraft) {
  composerSubmitting.value = true
  try {
    await today.createTask(input)
    composerOpen.value = false
    toast.success('任务已创建')
  }
  catch (error) {
    toast.error(readableError(error))
  }
  finally {
    composerSubmitting.value = false
  }
}

async function updateSelectedTask(patch: Partial<TaskDraft>) {
  const task = selectedTask.value
  if (!task) return
  try {
    await today.updateTask(task, {
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      todayDate: task.todayDate,
      todayBucket: task.todayBucket,
      ...patch,
    })
    toast.success('任务已更新')
  }
  catch (error) {
    toast.error(readableError(error))
  }
}

async function toggleTask(task: Task) {
  try {
    await today.toggleComplete(task)
    toast.success(task.status === 'DONE' ? '任务已重新打开' : '任务已完成')
  }
  catch (error) {
    toast.error(readableError(error))
  }
}

function requestDelete(task: Task) {
  taskToDelete.value = task
}

async function removeTask() {
  const task = taskToDelete.value
  if (!task) return
  try {
    await today.deleteTask(task)
    taskToDelete.value = null
    toast.success('任务已删除')
  }
  catch (error) {
    toast.error(readableError(error))
  }
}

async function logout() {
  if (isLoggingOut.value) return
  isLoggingOut.value = true
  try {
    await auth.logout()
    await router.replace('/login')
  }
  finally {
    isLoggingOut.value = false
  }
}

onMounted(() => today.load())
</script>

<template>
  <AppShell :display-name="displayName" :email="email" @logout="logout">
    <div class="grid min-h-0 min-w-0 flex-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <main class="min-w-0 flex-1 overflow-y-auto">
        <div class="mx-auto w-full max-w-[46rem] px-5 pb-10 pt-8 sm:px-8">
          <header class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 class="flex items-center gap-1.5 text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)]">
                今天
                <ChevronDown class="size-5 text-[var(--text-tertiary)]" aria-hidden="true" />
              </h1>
              <p class="mt-1 text-sm text-[var(--text-tertiary)]">{{ dateLabel }}</p>
              <p class="mt-2 text-sm text-[var(--text-secondary)]">
                <template v-if="totalTasks">今日完成 {{ doneTasksCount }} / {{ totalTasks }} 项</template>
                <template v-else>今天还没有安排任务</template>
              </p>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex">
                <Button class="min-h-10 rounded-r-none" @click="openQuickCreate()">
                  <Plus class="size-4" aria-hidden="true" />
                  添加任务
                </Button>
                <Popover v-model:open="taskBucketMenuOpen">
                  <PopoverTrigger as-child>
                    <Button class="min-h-10 rounded-l-none border-l border-white/25 px-2.5" aria-label="选择任务分组">
                      <ChevronDown class="size-4" aria-hidden="true" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    :side-offset="6"
                    class="w-40 rounded-xl border-[var(--border-subtle)] bg-white p-1.5 shadow-[var(--shadow-panel)]"
                  >
                    <Button
                      v-for="option in bucketOptions"
                      :key="option.value"
                      variant="ghost"
                      class="h-auto w-full justify-start rounded-lg px-2.5 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[#f4f4f5] hover:text-[var(--text-primary)]"
                      @click="openQuickCreate(option.value)"
                    >{{ option.label }}</Button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </header>

          <div v-if="today.error" class="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-[#f2c8cc] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
            <span>{{ today.error }}</span>
            <Button variant="ghost" size="sm" class="-my-1 h-auto min-h-0 px-0 font-semibold text-[var(--danger)] underline underline-offset-4 hover:bg-transparent" @click="today.load()">重试</Button>
          </div>

          <div v-if="today.isLoading" class="mt-8 grid gap-3" aria-label="正在加载今天的任务">
            <div v-for="index in 4" :key="index" class="h-12 animate-pulse rounded-xl bg-[#f4f4f5]" />
          </div>

          <template v-else>
            <InlineTaskComposer
              :open="composerOpen"
              :projects="today.projects"
              :default-date="today.date"
              :default-bucket="composerBucket"
              :submitting="composerSubmitting"
              @close="composerOpen = false"
              @submit="saveQuickTask"
            />

            <section v-if="overdueTasks.length" class="mt-8">
              <div class="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div class="flex items-center gap-2.5">
                  <ChevronDown class="size-4 text-[var(--text-secondary)]" aria-hidden="true" />
                  <h2 class="text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">逾期</h2>
                  <span class="text-sm text-[var(--text-tertiary)]">· {{ overdueTasks.length }}</span>
                </div>
                <Button variant="ghost" size="sm" class="font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]" @click="toast('重新安排功能即将支持')">重新安排</Button>
              </div>
              <div>
                <TaskRow
                  v-for="task in overdueTasks"
                  :key="task.id"
                  :task="task"
                  overdue
                  :selected="today.selectedTaskId === task.id"
                  :busy="today.busyTaskId === task.id"
                  @select="selectTask(task)"
                  @toggle="toggleTask(task)"
                />
              </div>
            </section>

            <section class="mt-8">
              <div class="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div class="flex items-center gap-2.5">
                  <h2 class="text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">{{ dateSectionLabel }}</h2>
                  <span class="text-sm text-[var(--text-tertiary)]">· {{ todayTasks.length }}</span>
                </div>
                <Button variant="ghost" size="sm" class="gap-1.5 text-[var(--text-secondary)]" @click="toast('拖拽排序即将支持')">
                  <GripVertical class="size-4" aria-hidden="true" />
                  重新排序
                </Button>
              </div>
              <div v-if="todayTasks.length">
                <TaskRow
                  v-for="task in todayTasks"
                  :key="task.id"
                  :task="task"
                  :selected="today.selectedTaskId === task.id"
                  :busy="today.busyTaskId === task.id"
                  @select="selectTask(task)"
                  @toggle="toggleTask(task)"
                />
              </div>
              <div v-else class="border-b border-[var(--border-subtle)] py-8 text-center">
                <p class="text-sm text-[var(--text-tertiary)]">今天还没有安排任务</p>
                <Button variant="ghost" class="mt-2 text-[var(--accent-primary)]" @click="openQuickCreate('FOCUS')">
                  <Plus class="size-4" aria-hidden="true" />
                  添加第一项任务
                </Button>
              </div>
            </section>

            <section v-if="completedTasks.length" class="mt-8">
              <Button
                variant="ghost"
                class="h-auto min-h-0 w-full justify-start gap-2 rounded-none border-b border-[var(--border-subtle)] px-0 pb-3 text-left text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)] hover:bg-transparent"
                :aria-expanded="showCompleted"
                @click="showCompleted = !showCompleted"
              >
                <ChevronDown class="size-4 transition-transform" :class="{ '-rotate-90': !showCompleted }" aria-hidden="true" />
                <span>已完成</span>
                <span class="text-sm font-normal text-[var(--text-tertiary)]">· {{ completedTasks.length }}</span>
              </Button>
              <div v-if="showCompleted">
                <TaskRow
                  v-for="task in completedTasks"
                  :key="task.id"
                  :task="task"
                  :selected="today.selectedTaskId === task.id"
                  :busy="today.busyTaskId === task.id"
                  @select="selectTask(task)"
                  @toggle="toggleTask(task)"
                />
              </div>
            </section>
          </template>
        </div>
      </main>

      <TaskDetailPanel
        v-if="selectedTask"
        :task="selectedTask"
        :projects="today.projects"
        :avatar-initial="avatarInitial"
        :busy="today.busyTaskId === selectedTask.id"
        class="hidden min-h-0 border-l border-[var(--border-subtle)] lg:flex"
        @close="today.selectedTaskId = null"
        @toggle="toggleTask(selectedTask)"
        @edit="openEditTask(selectedTask)"
        @delete="requestDelete(selectedTask)"
        @update="updateSelectedTask"
      />
    </div>

    <div v-if="selectedTask" class="fixed inset-0 z-40 lg:hidden">
      <div class="absolute inset-0 bg-black/25" @click="today.selectedTaskId = null" />
      <TaskDetailPanel
        :task="selectedTask"
        :projects="today.projects"
        :avatar-initial="avatarInitial"
        :busy="today.busyTaskId === selectedTask.id"
        class="absolute inset-y-0 right-0 w-[min(380px,92vw)] shadow-[var(--shadow-float)]"
        @close="today.selectedTaskId = null"
        @toggle="toggleTask(selectedTask)"
        @edit="openEditTask(selectedTask)"
        @delete="requestDelete(selectedTask)"
        @update="updateSelectedTask"
      />
    </div>

    <TaskEditorDialog
      :open="taskDialogOpen"
      :projects="today.projects"
      :task="editingTask"
      :default-date="today.date"
      :default-bucket="defaultBucket"
      :submitting="taskSubmitting"
      @close="taskDialogOpen = false"
      @submit="saveTask"
    />
    <ConfirmDialog
      :open="Boolean(taskToDelete)"
      title="删除任务？"
      :description="taskToDelete ? `“${taskToDelete.title}”将从工作台移除。` : ''"
      confirm-label="删除任务"
      :loading="today.busyTaskId === taskToDelete?.id"
      @close="taskToDelete = null"
      @confirm="removeTask"
    />
  </AppShell>
</template>
