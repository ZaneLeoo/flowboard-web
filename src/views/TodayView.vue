<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import AppShell from '../components/layout/AppShell.vue'
import ProjectEditorDialog from '../components/today/ProjectEditorDialog.vue'
import TaskDetailPanel from '../components/today/TaskDetailPanel.vue'
import TaskEditorDialog from '../components/today/TaskEditorDialog.vue'
import TaskGroup from '../components/today/TaskGroup.vue'
import ConfirmDialog from '../components/ui/ConfirmDialog.vue'
import { Button } from '../components/ui/button'
import type { ProjectDraft, Task, TaskDraft } from '../features/workspace/api'
import { useAuthStore } from '../stores/auth'
import { useTodayStore } from '../stores/today'

const { locale } = useI18n()
const router = useRouter()
const auth = useAuthStore()
const today = useTodayStore()

const isLoggingOut = ref(false)
const selectedProjectId = ref<string | null>(null)
const taskDialogOpen = ref(false)
const editingTask = ref<Task | null>(null)
const taskSubmitting = ref(false)
const projectDialogOpen = ref(false)
const projectSubmitting = ref(false)
const taskToDelete = ref<Task | null>(null)

const displayName = computed(() => auth.user?.displayName ?? '')
const email = computed(() => auth.user?.email ?? '')
const selectedProject = computed(() => today.projects.find((project) => project.id === selectedProjectId.value) ?? null)
const selectedTask = computed(() => today.selectedTask)

const dateLabel = computed(() => new Intl.DateTimeFormat(locale.value, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(new Date(`${today.date}T12:00:00`)))

function filterTasks(tasks: Task[]) {
  if (!selectedProjectId.value) return tasks
  return tasks.filter((task) => task.projectId === selectedProjectId.value)
}

const focusTasks = computed(() => filterTasks(today.data.focus))
const planTasks = computed(() => filterTasks(today.data.plan))
const laterTasks = computed(() => filterTasks(today.data.later))
const doneTasks = computed(() => filterTasks(today.data.done))

function readableError(error: unknown) {
  return error instanceof Error ? error.message : '操作未能完成，请稍后再试'
}

function selectTask(task: Task) {
  today.selectedTaskId = task.id
}

function openCreateTask() {
  editingTask.value = null
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
  <AppShell
    :display-name="displayName"
    :email="email"
    :projects="today.projects"
    :selected-project-id="selectedProjectId"
    @logout="logout"
    @create-project="projectDialogOpen = true"
    @select-project="selectedProjectId = selectedProjectId === $event ? null : $event"
  >
    <main class="grid min-h-[calc(100svh-6rem)] gap-4" :class="selectedTask ? 'xl:grid-cols-[minmax(40rem,1fr)_22.5rem]' : 'xl:grid-cols-[minmax(0,1fr)]'">
      <section class="min-w-0 rounded-[1.75rem] border border-white/80 bg-[var(--surface-raised)] p-5 shadow-[var(--shadow-subtle)] sm:p-8 lg:p-10">
        <header class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p v-if="selectedProject" class="mb-2 inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-primary)]">
              <Icon icon="solar:folder-linear" class="size-3.5" aria-hidden="true" />
              {{ selectedProject.name }}
              <Button variant="ghost" size="icon-sm" class="-my-1 ml-0.5 size-5 rounded-full p-0 text-[var(--accent-primary)]/70 hover:bg-transparent" aria-label="清除项目筛选" @click="selectedProjectId = null">×</Button>
            </p>
            <h1 class="text-4xl font-semibold leading-[1.04] tracking-[-0.055em] text-[var(--text-primary)] sm:text-5xl">今天</h1>
            <p class="mt-3 text-[15px] text-[var(--text-secondary)]">{{ dateLabel }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2 self-start">
            <span class="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-white/75 px-3 text-sm font-semibold text-[var(--text-secondary)]">
              <Icon icon="solar:bolt-circle-linear" class="size-4 text-[var(--accent-primary)]" aria-hidden="true" />
              焦点 {{ focusTasks.length }} 项
            </span>
            <Button @click="openCreateTask"><Icon icon="solar:add-circle-linear" class="size-4" aria-hidden="true" />新建任务</Button>
          </div>
        </header>

        <div v-if="today.error" class="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-[#f2c8cc] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]">
          <span>{{ today.error }}</span>
          <Button variant="ghost" size="sm" class="-my-1 h-auto min-h-0 px-0 font-semibold text-[var(--danger)] underline underline-offset-4 hover:bg-transparent" @click="today.load()">重试</Button>
        </div>

        <div v-if="today.isLoading" class="mt-10 grid gap-4" aria-label="正在加载今天的任务">
          <div v-for="index in 3" :key="index" class="h-28 animate-pulse rounded-2xl bg-[var(--surface-muted)]" />
        </div>

        <div v-else class="mt-9 grid gap-4">
          <TaskGroup title="聚焦" subtitle="把最重要的事留在眼前" icon="solar:star-linear" :tasks="focusTasks" :selected-task-id="today.selectedTaskId" :busy-task-id="today.busyTaskId" empty-text="还没有聚焦任务。把一件最重要的事放在这里。" @select="selectTask" @toggle="toggleTask" />
          <TaskGroup title="计划" subtitle="今天要推进的事情" icon="solar:calendar-mark-linear" :tasks="planTasks" :selected-task-id="today.selectedTaskId" :busy-task-id="today.busyTaskId" empty-text="今天暂时没有计划任务。" @select="selectTask" @toggle="toggleTask" />
          <TaskGroup title="稍后" subtitle="留给需要一点空间的事" icon="solar:clock-circle-linear" :tasks="laterTasks" :selected-task-id="today.selectedTaskId" :busy-task-id="today.busyTaskId" empty-text="暂时没有稍后事项。" @select="selectTask" @toggle="toggleTask" />
          <TaskGroup title="已完成" subtitle="今天已经推进的进度" icon="solar:check-circle-linear" :tasks="doneTasks" :selected-task-id="today.selectedTaskId" :busy-task-id="today.busyTaskId" empty-text="完成的任务会安静地留在这里。" @select="selectTask" @toggle="toggleTask" />
        </div>

        <section class="mt-5 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-muted)]/75 p-5 sm:p-6">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="grid size-9 place-items-center rounded-xl bg-white text-[var(--accent-primary)] shadow-[var(--shadow-subtle)]"><Icon icon="solar:folder-with-files-linear" class="size-5" aria-hidden="true" /></span>
              <div>
                <h2 class="text-base font-semibold tracking-[-0.025em] text-[var(--text-primary)]">项目进度</h2>
                <p class="mt-1 text-sm text-[var(--text-secondary)]">用一眼看清每个项目的推进情况。</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" class="hidden text-[var(--accent-primary)] hover:bg-white sm:inline-flex" @click="projectDialogOpen = true"><Icon icon="solar:add-circle-linear" class="size-4" aria-hidden="true" />新建项目</Button>
          </div>
          <div v-if="today.data.projects.length" class="mt-5 grid gap-3">
            <Button v-for="project in today.data.projects" :key="project.id" variant="ghost" class="grid h-auto w-full grid-cols-[minmax(7rem,1fr)_minmax(6rem,1.5fr)_auto] items-center justify-stretch gap-3 rounded-xl bg-white/70 px-3 py-3 text-left hover:bg-white" @click="selectedProjectId = selectedProjectId === project.id ? null : project.id">
              <span class="flex min-w-0 items-center gap-2"><span class="size-2 shrink-0 rounded-full" :class="{ BLUE: 'bg-[#4e8ff5]', VIOLET: 'bg-[#9a77ed]', GREEN: 'bg-[#48a66b]', AMBER: 'bg-[#e9a11d]', ROSE: 'bg-[#df6e91]' }[project.color]" /><span class="truncate text-sm font-semibold text-[var(--text-primary)]">{{ project.name }}</span></span>
              <span class="h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]"><span class="block h-full rounded-full bg-[var(--accent-primary)]" :style="{ width: `${project.completionRate}%` }" /></span>
              <span class="text-xs font-semibold text-[var(--text-secondary)]">{{ project.totalCount ? `${project.completionRate}%` : '未开始' }}</span>
            </Button>
          </div>
          <div v-else class="mt-5 rounded-xl bg-white/70 px-4 py-5 text-sm text-[var(--text-secondary)]">创建一个项目，把相关任务放到一起推进。</div>
        </section>
      </section>

      <TaskDetailPanel v-if="selectedTask" class="hidden xl:block" :task="selectedTask" :busy="today.busyTaskId === selectedTask.id" @close="today.selectedTaskId = null" @toggle="toggleTask(selectedTask)" @edit="openEditTask(selectedTask)" @delete="requestDelete(selectedTask)" />
    </main>

    <TaskEditorDialog :open="taskDialogOpen" :projects="today.projects" :task="editingTask" :default-date="today.date" :submitting="taskSubmitting" @close="taskDialogOpen = false" @submit="saveTask" />
    <ProjectEditorDialog :open="projectDialogOpen" :submitting="projectSubmitting" @close="projectDialogOpen = false" @submit="createProject" />
    <ConfirmDialog :open="Boolean(taskToDelete)" title="删除任务？" :description="taskToDelete ? `“${taskToDelete.title}”将从工作台移除。` : ''" confirm-label="删除任务" :loading="today.busyTaskId === taskToDelete?.id" @close="taskToDelete = null" @confirm="removeTask" />
  </AppShell>
</template>
