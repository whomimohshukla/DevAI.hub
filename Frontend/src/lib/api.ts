const BASE_URL = ''

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
    if (key) headers['x-api-key'] = key
  }
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw new ApiError(data.error || 'Request failed', res.status, data)
  return data as T
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
}

// User
export const userApi = {
  getMe: () => request<User>('/user/me'),
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
