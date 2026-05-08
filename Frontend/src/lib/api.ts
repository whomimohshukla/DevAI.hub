const BASE_URL = import.meta.env.VITE_API_URL || ''

function getApiKey(): string {
  return localStorage.getItem('devai_api_key') || ''
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (authenticated) {
    const key = getApiKey()
    if (!key) {
      throw new ApiError('Sign in or add an API key to continue.', 401)
    }
    if (key) headers['x-api-key'] = key
  }

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  } catch (err) {
    throw new ApiError(
      err instanceof Error && err.name === 'AbortError'
        ? 'Request cancelled.'
        : 'Cannot reach the API server. Check that the backend is running.',
      0
    )
  }

  const contentType = res.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : await res.text().catch(() => '')

  if (!res.ok) {
    throw new ApiError(getErrorMessage(data, res.status), res.status, data)
  }

  return data as T
}

function getErrorMessage(data: unknown, status: number): string {
  if (data && typeof data === 'object') {
    const body = data as { error?: unknown; message?: unknown }
    if (typeof body.error === 'string' && body.error.trim()) return body.error
    if (typeof body.message === 'string' && body.message.trim()) return body.message
  }
  if (typeof data === 'string' && data.trim()) return data
  if (status === 401) return 'Your session is missing or expired. Please sign in again.'
  if (status === 403) return 'You do not have permission to perform this action.'
  if (status === 404) return 'The requested resource was not found.'
  if (status >= 500) return 'The server hit a problem. Please try again.'
  return 'Request failed. Please try again.'
}

export class ApiError extends Error {
  status: number
  data: unknown
  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Auth
export const authApi = {
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }, false),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false),

  google: (credential: string) =>
    request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }, false),
}

// User
export const userApi = {
  getMe: () => request<User>('/user/me'),
  updateMe: (name: string) =>
    request<User>('/user/me', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ ok: boolean }>('/user/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  deleteMe: () => request<{ ok: boolean }>('/user/me', { method: 'DELETE' }),
}

// API Keys
export const keysApi = {
  list: () => request<ApiKey[]>('/keys'),
  create: (label: string, scopes?: string[]) =>
    request<ApiKeyCreated>('/keys', {
      method: 'POST',
      body: JSON.stringify({ label, scopes }),
    }),
  revoke: (id: string) =>
    request<{ ok: boolean }>(`/keys/${id}/revoke`, { method: 'POST' }),
}

// Usage
export const usageApi = {
  summary: (from?: string, to?: string) => {
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    const qs = params.toString()
    return request<UsageSummary>(`/usage/summary${qs ? `?${qs}` : ''}`)
  },
  logs: (limit = 50) => request<RequestLog[]>(`/usage/logs?limit=${limit}`),
}

// Admin - Providers
export const providersApi = {
  list: () => request<Provider[]>('/admin/providers'),
  create: (data: Partial<Provider>) =>
    request<Provider>('/admin/providers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Provider>) =>
    request<Provider>(`/admin/providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ ok: boolean }>(`/admin/providers/${id}`, { method: 'DELETE' }),
}

// Admin - Models
export const modelsApi = {
  list: () => request<ProviderModel[]>('/admin/provider-models'),
  create: (data: Partial<ProviderModel>) =>
    request<ProviderModel>('/admin/provider-models', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<ProviderModel>) =>
    request<ProviderModel>(`/admin/provider-models/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ ok: boolean }>(`/admin/provider-models/${id}`, {
      method: 'DELETE',
    }),
}

// Admin - Service Routes
export const serviceRoutesApi = {
  list: () => request<ServiceRoute[]>('/admin/service-routes'),
  create: (data: Partial<ServiceRoute>) =>
    request<ServiceRoute>('/admin/service-routes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<ServiceRoute>) =>
    request<ServiceRoute>(`/admin/service-routes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ ok: boolean }>(`/admin/service-routes/${id}`, {
      method: 'DELETE',
    }),
}

// AI
export const aiApi = {
  text: (prompt: string, model?: string) =>
    request<TextResult>('/api/ai/text', {
      method: 'POST',
      body: JSON.stringify({ prompt, model }),
    }),
  image: (prompt: string, model?: string) =>
    request<ImageResult>('/api/ai/image', {
      method: 'POST',
      body: JSON.stringify({ prompt, model }),
    }),
}

// Types
export interface AuthResponse {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  subscriptionPlan: string
  apiKey: string
}

export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  subscriptionPlan: 'free' | 'pro' | 'enterprise'
  credits: number
  authProvider?: 'local' | 'google'
  profileImage?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiKey {
  _id: string
  label?: string
  scopes: string[]
  status: 'active' | 'revoked'
  lastUsedAt?: string
  expiresAt?: string
  createdAt: string
}

export interface ApiKeyCreated extends ApiKey {
  apiKey: string
}

export interface UsageSummaryItem {
  service: string
  routeName: string
  requests: number
  tokensUsed: number
  avgLatencyMs: number
  errors: number
}

export interface UsageSummary {
  userId: string
  from: string | null
  to: string | null
  items: UsageSummaryItem[]
}

export interface RequestLog {
  _id: string
  service: string
  routeName: string
  status: 'success' | 'error' | 'rate_limited'
  httpStatus?: number
  latencyMs?: number
  tokensUsed?: number
  createdAt: string
}

export interface Provider {
  _id: string
  name: string
  baseUrl?: string
  authType: 'none' | 'apiKey' | 'oauth'
  status: 'active' | 'inactive'
  createdAt: string
}

export interface ProviderModel {
  _id: string
  providerId: string | { _id: string; name: string; status: string }
  modelName: string
  service: 'text' | 'image' | 'speech'
  status: 'active' | 'inactive'
  pricing?: {
    unit?: string
    inputPerUnitCents?: number
    outputPerUnitCents?: number
    perRequestCents?: number
  }
  createdAt: string
}

export interface ServiceRoute {
  _id: string
  service: 'text' | 'image' | 'speech'
  routeName: string
  defaultProviderModelId: string | { _id: string; modelName: string }
  enabled: boolean
  fallbackPolicy: string
  version: string
  createdAt: string
}

export interface TextResult {
  text: string
  tokensUsed: number
  latencyMs: number
  model: string
  provider: string
}

export interface ImageResult {
  imageBase64: string
  latencyMs: number
  model: string
  provider: string
}
