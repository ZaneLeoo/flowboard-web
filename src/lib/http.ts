const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1').replace(/\/$/, '')

export type ApiFieldError = {
  field: string
  message: string
}

type ApiErrorPayload = {
  code?: string
  message?: string
  traceId?: string
  fieldErrors?: ApiFieldError[]
}

export class ApiRequestError extends Error {
  readonly status: number
  readonly code: string
  readonly traceId?: string
  readonly fieldErrors: ApiFieldError[]

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message ?? '请求未能完成')
    this.name = 'ApiRequestError'
    this.status = status
    this.code = payload.code ?? 'UNKNOWN_ERROR'
    this.traceId = payload.traceId
    this.fieldErrors = payload.fieldErrors ?? []
  }
}

type HttpOptions = {
  auth?: boolean
  retryOnUnauthorized?: boolean
}

type HttpSessionHandlers = {
  getAccessToken: () => string | null
  refreshSession: () => Promise<boolean>
}

let sessionHandlers: HttpSessionHandlers | undefined

export function configureHttpSessionHandlers(handlers: HttpSessionHandlers) {
  sessionHandlers = handlers
}

export async function request<T>(path: string, init: RequestInit = {}, options: HttpOptions = {}): Promise<T> {
  const { auth = true, retryOnUnauthorized = true } = options
  const headers = new Headers(init.headers)

  if (init.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (auth) {
    const accessToken = sessionHandlers?.getAccessToken()
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  })

  if (response.status === 401 && auth && retryOnUnauthorized && sessionHandlers) {
    const refreshed = await sessionHandlers.refreshSession()
    if (refreshed) {
      return request<T>(path, init, { ...options, retryOnUnauthorized: false })
    }
  }

  if (!response.ok) {
    throw new ApiRequestError(response.status, await readErrorPayload(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

async function readErrorPayload(response: Response): Promise<ApiErrorPayload> {
  try {
    return (await response.json()) as ApiErrorPayload
  }
  catch {
    return {
      code: 'NETWORK_ERROR',
      message: '服务暂时不可用，请稍后重试',
    }
  }
}
