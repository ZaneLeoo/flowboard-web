import { defineStore } from 'pinia'

import {
  type Project,
  type ProjectDraft,
  type Task,
  type TaskDraft,
  type Today,
  workspaceApi,
} from '../features/workspace/api'

function localDate() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

function emptyToday(date: string): Today {
  return { date, focus: [], plan: [], later: [], done: [], projects: [] }
}

export const useTodayStore = defineStore('today', {
  state: () => ({
    date: localDate(),
    data: emptyToday(localDate()) as Today,
    projects: [] as Project[],
    selectedTaskId: null as string | null,
    isLoading: false,
    busyTaskId: null as string | null,
    error: null as string | null,
  }),
  getters: {
    allTasks: (state) => [...state.data.focus, ...state.data.plan, ...state.data.later, ...state.data.done],
    selectedTask: (state): Task | null => [...state.data.focus, ...state.data.plan, ...state.data.later, ...state.data.done]
      .find((task) => task.id === state.selectedTaskId) ?? null,
    focusCount: (state) => state.data.focus.length,
  },
  actions: {
    async load(date?: string) {
      const targetDate = date ?? this.date
      this.isLoading = true
      this.error = null
      try {
        const [projects, today] = await Promise.all([workspaceApi.listProjects(), workspaceApi.getToday(targetDate)])
        this.date = targetDate
        this.projects = projects.items
        this.data = today
        if (this.selectedTaskId && !this.allTasks.some((task) => task.id === this.selectedTaskId)) {
          this.selectedTaskId = null
        }
      }
      catch (error) {
        this.error = error instanceof Error ? error.message : '暂时无法读取工作台数据'
      }
      finally {
        this.isLoading = false
      }
    },
    async createProject(input: ProjectDraft) {
      await workspaceApi.createProject(input)
      await this.load()
    },
    async createTask(input: TaskDraft) {
      const task = await workspaceApi.createTask(input)
      await this.load()
      this.selectedTaskId = task.id
    },
    async updateTask(task: Task, input: TaskDraft) {
      await workspaceApi.updateTask(task.id, { ...input, version: task.version })
      await this.load()
      this.selectedTaskId = task.id
    },
    async toggleComplete(task: Task) {
      this.busyTaskId = task.id
      try {
        if (task.status === 'DONE') {
          await workspaceApi.reopenTask(task.id, task.version)
        }
        else {
          await workspaceApi.completeTask(task.id, task.version)
        }
        await this.load()
        this.selectedTaskId = task.id
      }
      finally {
        this.busyTaskId = null
      }
    },
    async deleteTask(task: Task) {
      this.busyTaskId = task.id
      try {
        await workspaceApi.deleteTask(task.id)
        this.selectedTaskId = null
        await this.load()
      }
      finally {
        this.busyTaskId = null
      }
    },
  },
})
