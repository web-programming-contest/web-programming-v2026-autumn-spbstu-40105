import type { CheckoutData, Order, Product, User } from '@/types/store'

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
let csrfToken = ''

export class ApiError extends Error {
  status: number
  fields?: Record<string, string[]>

  constructor(message: string, status: number, fields?: Record<string, string[]>) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}/api${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(csrfToken && init.method && init.method !== 'GET' ? { 'X-CSRFToken': csrfToken } : {}),
      ...init.headers,
    },
  })

  if (response.status === 204) return undefined as T
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const fields = typeof data === 'object' && data ? data as Record<string, string[]> : undefined
    const detail = data?.detail || data?.non_field_errors?.[0] || 'Не удалось выполнить запрос. Попробуйте еще раз.'
    throw new ApiError(Array.isArray(detail) ? detail[0] : detail, response.status, fields)
  }
  return data as T
}

async function ensureCsrf() {
  if (!csrfToken) {
    const data = await request<{ csrfToken: string }>('/csrf/')
    csrfToken = data.csrfToken
  }
}

export const api = {
  me: () => request<{ user: User | null }>('/me/'),
  products: () => request<Product[]>('/goods/'),
  orders: () => request<Order[]>('/orders/'),
  login: async (username: string, password: string) => {
    await ensureCsrf()
    const result = await request<{ user: User }>('/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    csrfToken = ''
    return result
  },
  logout: async () => {
    await ensureCsrf()
    const result = await request<void>('/logout/', { method: 'POST' })
    csrfToken = ''
    return result
  },
  createOrder: async (checkout: CheckoutData, items: { product_id: number; quantity: number }[]) => {
    await ensureCsrf()
    return request<Order>('/orders/', {
      method: 'POST',
      body: JSON.stringify({ ...checkout, items }),
    })
  },
}
