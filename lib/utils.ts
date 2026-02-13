import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(value: number, decimals = 2): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatDate(date: Date | string, format = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  const options: Intl.DateTimeFormatOptions = 
    format === 'short' 
      ? { year: 'numeric', month: 'short', day: 'numeric' }
      : { year: 'numeric', month: 'long', day: 'numeric' }
  
  return d.toLocaleDateString('en-US', options)
}

export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable'
  
  const recent = values.slice(-3)
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length
  const trend = values[values.length - 1] - values[0]
  
  if (trend > avg * 0.05) return 'up'
  if (trend < avg * -0.05) return 'down'
  return 'stable'
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null
  
  return function debounced(...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function parseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export function groupBy<T, K extends string | number>(
  arr: T[],
  fn: (item: T) => K
): Record<K, T[]> {
  const result: Record<K, T[]> = {} as Record<K, T[]>
  
  arr.forEach(item => {
    const key = fn(item)
    if (!result[key]) result[key] = []
    result[key].push(item)
  })
  
  return result
}

export function sortBy<T>(
  arr: T[],
  fn: (item: T) => number | string,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return arr.sort((a, b) => {
    const valA = fn(a)
    const valB = fn(b)
    
    if (valA < valB) return order === 'asc' ? -1 : 1
    if (valA > valB) return order === 'asc' ? 1 : -1
    return 0
  })
}

export function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
