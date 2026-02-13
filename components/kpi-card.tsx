'use client'

import { ArrowUp, ArrowDown, TrendingFlat } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: number
  trendLabel?: string
  icon?: React.ReactNode
  variant?: 'default' | 'accent' | 'warning'
  size?: 'sm' | 'md' | 'lg'
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon,
  variant = 'default',
  size = 'md',
}: KPICardProps) {
  const bgColor = {
    default: 'bg-secondary/50 border-secondary/50',
    accent: 'bg-accent/10 border-accent/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
  }[variant]

  const valueSize = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  }[size]

  const getTrendIcon = () => {
    if (trend === undefined) return null
    if (trend > 0) return <ArrowUp className="w-4 h-4" />
    if (trend < 0) return <ArrowDown className="w-4 h-4" />
    return <TrendingFlat className="w-4 h-4" />
  }

  const getTrendColor = () => {
    if (trend === undefined) return ''
    if (trend > 0) return 'text-green-500'
    if (trend < 0) return 'text-red-500'
    return 'text-muted-foreground'
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border p-6 transition-all hover:shadow-lg',
        bgColor
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -m-8 opacity-5">
        <div className="w-32 h-32 rounded-full bg-accent" />
      </div>

      <div className="relative z-10 space-y-2">
        {/* Header with icon */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </h3>
          {icon && <div className="text-accent">{icon}</div>}
        </div>

        {/* Value */}
        <div className={cn('font-bold text-foreground', valueSize)}>
          {value}
        </div>

        {/* Trend or Subtitle */}
        <div className="flex items-center gap-2 pt-2">
          {trend !== undefined && (
            <div className={cn('flex items-center gap-1 text-sm font-medium', getTrendColor())}>
              {getTrendIcon()}
              <span>{Math.abs(trend)}%</span>
              {trendLabel && <span className="text-muted-foreground">vs {trendLabel}</span>}
            </div>
          )}
          {!trend && subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}
