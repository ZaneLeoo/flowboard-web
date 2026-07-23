<script setup lang="ts">
import { CalendarCheck, ChevronDown, Crosshair, Folder, GripVertical, Plus } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import AppShell from '../components/layout/AppShell.vue'
import ProgressRing from '../components/today/ProgressRing.vue'
import ProjectEditorDialog from '../components/today/ProjectEditorDialog.vue'
import TaskDetailPanel from '../components/today/TaskDetailPanel.vue'
import TaskEditorDialog from '../components/today/TaskEditorDialog.vue'
import TaskRow from '../components/today/TaskRow.vue'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import type { ProjectColor, ProjectDraft, Task, TaskDraft, TodayBucket } from '../features/workspace/api'
import { useAuthStore } from '../stores/auth'
import { useTodayStore } from '../stores/today'

type TabKey = TodayBucket | 'DONE'

const { locale } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const today = useTodayStore()

const isLoggingOut = ref(false)
const selectedProjectId = ref<string | null>(null)
const activeTab = ref<TabKey>('FOCUS')
const taskDialogOpen = ref(false)
const taskBucketMenuOpen = ref(false)
const editingTask = ref<Task | null>(null)
const defaultBucket = ref<TodayBucket>('FOCUS')
const taskSubmitting = ref(false)
const projectDialogOpen = ref(false)
const projectSubmitting = ref(false)
const taskToDelete = ref<Task | null>(null)

const displayName = computed(() => auth.user?.displayName ?? '')
const email = computed(() => auth.user?.email ?? '')
const avatarInitial = computed(() => (displayName.value || '我').slice(0, 1).toUpperCase())
const selectedProject = computed(() => today.projects.find(project => project.id === selectedProjectId.value) ?? null)
const selectedTask = computed(() => today.selectedTask)

const dateLabel = computed(() => new Intl.DateTimeFormat(locale.value, {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
}).format(new Date(`${today.date}T12:00:00`)))

function filterTasks(tasks: Task[]) {
  if (!selectedProjectId.value) return tasks
  return tasks.filter(task => task.projectId === selectedProjectId.value)
}

const tasksByTab = computed<Record<TabKey, Task[]>>(() => ({
  FOCUS: filterTasks(today.data.focus),
  PLAN: filterTasks(today.data.plan),
  LATER: filterTasks(today.data.later),
  DONE: filterTasks(today.data.done),
}))

const tabs = computed<{ key: TabKey, label: string, count: number }[]>(() => [
  { key: 'FOCUS', label: '聚焦', count: tasksByTab.value.FOCUS.length },
  { key: 'PLAN', label: '计划', count: tasksByTab.value.PLAN.length },
  { key: 'LATER', label: '稍后', count: tasksByTab.value.LATER.length },
  { key: 'DONE', label: '已完成', count: tasksByTab.value.DONE.length },
])

const totalTasks = computed(() => today.data.focus.length + today.data.plan.length + today.data.later.length + today.data.done.length)
const doneTasksCount = computed(() => today.data.done.length)
const dailyPercent = computed(() => totalTasks.value ? (doneTasksCount.value / totalTasks.value) * 100 : 0)
const momentumLabel = computed(() => {
  if (dailyPercent.value >= 60) return '势头不错！'
  if (dailyPercent.value > 0) return '稳步推进中'
  return '从一件小事开始'
})

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

const projectColorClass: Record<ProjectColor, string> = {
  BLUE: 'bg-[#4e8ff5]',
  VIOLET: 'bg-[#9a77ed]',
  GREEN: 'bg-[#48a66b]',
  AMBER: 'bg-[#e9a11d]',
  ROSE: 'bg-[#df6e91]',
}

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

async function createProject(input: ProjectDraft) {
  projectSubmitting.value = true
  try {
    await today.createProject(input)
    projectDialogOpen.value = false
    toast.success('项目已创建')
  }
  catch (error) {
    toast.error(readableError(error))
  }
  finally {
    projectSubmitting.value = false
  }
}

function toggleProjectFilter(projectId: string) {
  selectedProjectId.value = selectedProjectId.value === projectId ? null : projectId
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

          <p v-if="selectedProject" class="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-primary)]">
            <Folder class="size-3.5" aria-hidden="true" />
            {{ selectedProject.name }}
            <button type="button" class="text-[var(--accent-primary)]/70 transition-colors hover:text-[var(--accent-primary)]" aria-label="清除项目筛选" @click="selectedProjectId = null">×</button>
          </p>

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

            <section class="mt-10">
              <div class="flex items-center justify-between">
                <h2 class="text-sm font-semibold text-[var(--text-primary)]">项目</h2>
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    class="rounded-lg px-2 py-1 text-[13px] font-medium text-[var(--accent-primary)] transition-colors hover:bg-[var(--accent-soft)]"
                    @click="selectedProjectId = null"
                  >查看全部</button>
                  <Button variant="ghost" size="icon-sm" aria-label="新建项目" @click="projectDialogOpen = true">
                    <Plus class="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <div v-if="today.data.projects.length" class="mt-2 grid gap-0.5">
                <button
                  v-for="project in today.data.projects"
                  :key="project.id"
                  type="button"
                  class="flex items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-[#fafafa]"
                  :class="{ 'bg-[var(--accent-soft)]/40 hover:bg-[var(--accent-soft)]/55': selectedProjectId === project.id }"
                  @click="toggleProjectFilter(project.id)"
                >
                  <span class="grid size-9 shrink-0 place-items-center rounded-lg" :class="projectColorClass[project.color]">
                    <Folder class="size-4 text-white" aria-hidden="true" />
                  </span>
                  <span class="w-28 shrink-0 truncate text-sm font-medium text-[var(--text-primary)] sm:w-36">{{ project.name }}</span>
                  <span class="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#ececee]">
                    <span class="block h-full rounded-full" :class="projectColorClass[project.color]" :style="{ width: `${project.completionRate}%` }" />
                  </span>
                  <span class="w-10 shrink-0 text-right text-xs font-semibold text-[var(--text-secondary)]">{{ project.completionRate }}%</span>
                  <span class="hidden w-20 shrink-0 text-right text-xs text-[var(--text-tertiary)] sm:block">
                    {{ project.totalCount ? `${project.incompleteCount} 项待办` : '暂无任务' }}
                  </span>
                </button>
              </div>
              <p v-else class="mt-2 rounded-xl bg-[#fafafa] px-4 py-5 text-sm text-[var(--text-secondary)]">
                创建一个项目，把相关任务放到一起推进。
              </p>
            </section>

            <section class="mt-10 grid gap-4 sm:grid-cols-2">
              <Card class="gap-0 rounded-2xl border-[var(--border-subtle)] py-0 shadow-none">
                <CardContent class="p-5">
                  <h3 class="text-sm font-semibold text-[var(--text-primary)]">每日进度</h3>
                  <div class="mt-4 flex items-center gap-5">
                    <ProgressRing :percent="dailyPercent" :size="72" />
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-[var(--text-primary)]">{{ momentumLabel }}</p>
                      <p class="mt-0.5 text-[13px] text-[var(--text-secondary)]">{{ totalTasks }} 项任务中已完成 {{ doneTasksCount }} 项</p>
                      <button
                        type="button"
                        class="mt-1.5 text-[13px] font-semibold text-[var(--accent-primary)] transition-colors hover:opacity-75"
                        @click="activeTab = 'DONE'"
                      >查看进度</button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card class="gap-0 rounded-2xl border-[var(--border-subtle)] py-0 shadow-none">
                <CardContent class="p-5">
                  <h3 class="text-sm font-semibold text-[var(--text-primary)]">规划你的一天</h3>
                  <div class="mt-4 flex items-center gap-4">
                    <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-primary)]">
                      <CalendarCheck class="size-5" aria-hidden="true" />
                    </span>
                    <div class="min-w-0">
                      <p class="text-sm text-[var(--text-secondary)]">计划中有 {{ tasksByTab.PLAN.length }} 项任务</p>
                      <button
                        type="button"
                        class="mt-1 text-[13px] font-semibold text-[var(--accent-primary)] transition-colors hover:opacity-75"
                        @click="activeTab = 'PLAN'"
                      >查看你的计划</button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
    <ProjectEditorDialog :open="projectDialogOpen" :submitting="projectSubmitting" @close="projectDialogOpen = false" @submit="createProject" />
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
