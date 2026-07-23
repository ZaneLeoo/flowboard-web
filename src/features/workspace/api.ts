import { request } from '../../lib/http'

export type ProjectColor = 'BLUE' | 'VIOLET' | 'GREEN' | 'AMBER' | 'ROSE'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'
export type TaskPriority = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'
export type TodayBucket = 'FOCUS' | 'PLAN' | 'LATER'

export type PageResponse<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
}

export type Project = {
  id: string
  name: string
  description: string | null
  color: ProjectColor
  archivedAt: string | null
  createdAt: string
  updatedAt: string
}

export type ProjectProgress = {
  id: string
  name: string
  color: ProjectColor
  incompleteCount: number
  totalCount: number
  completionRate: number
}

export type Task = {
  id: string
  projectId: string | null
  projectName: string | null
  projectColor: ProjectColor | null
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  todayDate: string | null
  todayBucket: TodayBucket | null
  sortOrder: number
  version: number
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export type Today = {
  date: string
  focus: Task[]
  plan: Task[]
  later: Task[]
  done: Task[]
  projects: ProjectProgress[]
}

export type ProjectDraft = {
  name: string
  description?: string | null
  color: ProjectColor
}

export type TaskDraft = {
  title: string
  description?: string | null
  projectId?: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string | null
  todayDate?: string | null
  todayBucket?: TodayBucket | null
}

export const workspaceApi = {
  listProjects() {
    return request<PageResponse<Project>>('/projects?archived=false&page=1&pageSize=100')
  },
  createProject(input: ProjectDraft) {
    return request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
  archiveProject(projectId: string) {
    return request<Project>(`/projects/${projectId}/archive`, { method: 'POST' })
  },
  restoreProject(projectId: string) {
    return request<Project>(`/projects/${projectId}/restore`, { method: 'POST' })
  },
  createTask(input: TaskDraft) {
    return request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
  updateTask(taskId: string, input: TaskDraft & { version: number }) {
    return request<Task>(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  },
  completeTask(taskId: string, version: number) {
    return request<Task>(`/tasks/${taskId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ version }),
    })
  },
  reopenTask(taskId: string, version: number) {
    return request<Task>(`/tasks/${taskId}/reopen`, {
      method: 'POST',
      body: JSON.stringify({ version }),
    })
  },
  deleteTask(taskId: string) {
    return request<void>(`/tasks/${taskId}`, { method: 'DELETE' })
  },
  getToday(date: string) {
    return request<Today>(`/today?date=${encodeURIComponent(date)}`)
  },
}
