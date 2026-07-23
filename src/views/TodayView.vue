<script setup lang="ts">
import { ChevronDown, Crosshair, GripVertical, Plus } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import AppShell from '../components/layout/AppShell.vue'
import TaskDetailPanel from '../components/today/TaskDetailPanel.vue'
import TaskEditorDialog from '../components/today/TaskEditorDialog.vue'
import TaskRow from '../components/today/TaskRow.vue'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import type { Task, TaskDraft, TodayBucket } from '../features/workspace/api'
import { useAuthStore } from '../stores/auth'
import { useTodayStore } from '../stores/today'

type TabKey = TodayBucket | 'DONE'

const { locale } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const today = useTodayStore()

const isLoggingOut = ref(false)
const activeTab = ref<TabKey>('FOCUS')
const taskDialogOpen = ref(false)
const taskBucketMenuOpen = ref(false)
const editingTask = ref<Task | null>(null)
const defaultBucket = ref<TodayBucket>('FOCUS')
const taskSubmitting = ref(false)
const taskToDelete = ref<Task | null>(null)

const displayName = computed(() => auth.user?.displayName ?? '')
const email = computed(() => auth.user?.email ?? '')
const avatarInitial = computed(() => (displayName.value || '我').slice(0, 1).toUpperCase())
const selectedTask = computed(() => today.selectedTask)

const dateLabel = computed(() => new Intl.DateTimeFormat(locale.value, {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date(`${today.date}T12:00:00`)))

const tasksByTab = computed<Record<TabKey, Task[]>>(() => ({
  FOCUS: today.data.focus,
  PLAN: today.data.plan,
  LATER: today.data.later,
  DONE: today.data.done,
}))

const tabs = computed<{ key: TabKey, label: string, count: number }[]>(() => [
  { key: 'FOCUS', label: '聚焦', count: tasksByTab.value.FOCUS.length },
  { key: 'PLAN', label: '计划', count: tasksByTab.value.PLAN.length },
  { key: 'LATER', label: '稍后', count: tasksByTab.value.LATER.length },
  { key: 'DONE', label: '已完成', count: tasksByTab.value.DONE.length },
])

const totalTasks = computed(() => today.data.focus.length + today.data.plan.length + today.data.later.length + today.data.done.length)
const doneTasksCount = computed(() => today.data.done.length)
const emptyTextByTab: Record<TabKey, string> = {
  FOCUS: '还没有聚焦任务。把一件最重要的事放在这里。',
  PLAN: '今天暂时没有计划任务。',
  LATER: '暂时没有稍后事项。',
  DONE: '完成的任务会安静地留在这里。',
}

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

function openCreateTask(bucket?: TodayBucket) {
  editingTask.value = null
  defaultBucket.value = bucket ?? (activeTab.value === 'DONE' ? 'FOCUS' : activeTab.value)
  taskDialogOpen.value = true
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
              <Button variant="outline" class="min-h-10" @click="activeTab = 'FOCUS'">
                <Crosshair class="size-4 text-[var(--text-secondary)]" aria-hidden="true" />
                专注
              </Button>
              <div class="flex">
                <Button class="min-h-10 rounded-r-none" @click="openCreateTask()">
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
                      @click="openCreateTask(option.value); taskBucketMenuOpen = false"
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
            <Tabs v-model="activeTab" class="mt-7 gap-0">
              <div class="flex items-end border-b border-[var(--border-subtle)]">
                <TabsList class="h-auto w-auto gap-1 rounded-none bg-transparent p-0">
                  <TabsTrigger
                    v-for="tab in tabs"
                    :key="tab.key"
                    :value="tab.key"
                    class="relative -mb-px h-auto flex-none rounded-none border-b-2 border-transparent bg-transparent px-1 pb-2.5 pt-0 text-sm font-medium text-[var(--text-secondary)] shadow-none hover:text-[var(--text-primary)] data-[state=active]:border-[var(--accent-primary)] data-[state=active]:bg-transparent data-[state=active]:text-[var(--accent-primary)] data-[state=active]:shadow-none"
                  >
                    {{ tab.label }}
                    <span class="text-xs text-[var(--text-tertiary)] data-[state=active]:text-[var(--accent-primary)]/70">· {{ tab.count }}</span>
                  </TabsTrigger>
                </TabsList>
                <div class="ml-auto pb-1.5">
                  <Button variant="ghost" size="sm" class="gap-1.5 text-[var(--text-secondary)]" @click="toast('拖拽排序即将支持')">
                    <GripVertical class="size-4" aria-hidden="true" />
                    重新排序
                  </Button>
                </div>
              </div>

              <TabsContent v-for="tab in tabs" :key="tab.key" :value="tab.key" class="mt-4">
                <Card class="gap-0 overflow-hidden rounded-2xl border-[var(--border-subtle)] py-0 shadow-none">
                  <TaskRow
                    v-for="task in tasksByTab[tab.key]"
                    :key="task.id"
                    :task="task"
                    :selected="today.selectedTaskId === task.id"
                    :busy="today.busyTaskId === task.id"
                    @select="selectTask(task)"
                    @toggle="toggleTask(task)"
                  />
                  <p v-if="!tasksByTab[tab.key].length" class="px-5 py-6 text-sm text-[var(--text-tertiary)]">{{ emptyTextByTab[tab.key] }}</p>
                  <Button
                    v-if="tab.key !== 'DONE'"
                    variant="ghost"
                    class="h-auto w-full justify-start rounded-none border-t border-[var(--border-subtle)] px-4 py-3 text-sm font-medium text-[var(--text-tertiary)] hover:bg-[#fafafa] hover:text-[var(--accent-primary)]"
                    @click="openCreateTask(tab.key)"
                  >
                    <Plus class="size-4" aria-hidden="true" />
                    添加任务
                  </Button>
                </Card>
              </TabsContent>
            </Tabs>

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
