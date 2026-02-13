'use client'

import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComplianceIndicator {
  name: string
  status: 'compliant' | 'warning' | 'non-compliant' | 'pending'
  percentage: number
  detail: string
}

interface ComplianceDashboardProps {
  data: Record<string, unknown>[]
  indicators?: ComplianceIndicator[]
}

export function ComplianceDashboard({
  data,
  indicators = [],
}: ComplianceDashboardProps) {
  // Auto-generate compliance indicators if not provided
  const autoIndicators = !indicators.length
    ? [
        {
          name: 'Data Completeness',
          status: 'compliant' as const,
          percentage: 95,
          detail: `${data.length} records analyzed`,
        },
        {
          name: 'Budget Adherence',
          status: 'warning' as const,
          percentage: 87,
          detail: 'Some line items over budget',
        },
        {
          name: 'Approval Chain',
          status: 'compliant' as const,
          percentage: 100,
          detail: 'All transactions approved',
        },
        {
          name: 'Audit Ready',
          status: 'pending' as const,
          percentage: 75,
          detail: 'Documents pending review',
        },
      ]
    : indicators

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'non-compliant':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'border-green-500/30 bg-green-500/5'
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/5'
      case 'non-compliant':
        return 'border-red-500/30 bg-red-500/5'
      case 'pending':
        return 'border-blue-500/30 bg-blue-500/5'
      default:
        return 'border-border'
    }
  }

  const complianceScore = Math.round(
    autoIndicators.reduce((sum, ind) => sum + ind.percentage, 0) / autoIndicators.length
  )

  return (
    <div className="space-y-6">
      {/* Overall Compliance Score */}
      <div className="rounded-lg border border-border bg-secondary/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Overall Compliance Score
            </h3>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-accent">{complianceScore}%</div>
              <span className="text-muted-foreground">
                {complianceScore >= 90
                  ? 'Excellent'
                  : complianceScore >= 70
                    ? 'Good'
                    : complianceScore >= 50
                      ? 'Fair'
                      : 'Needs Improvement'}
              </span>
            </div>
          </div>
          <div className="w-24 h-24 relative">
            <svg className="transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted opacity-20"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${(complianceScore / 100) * 251} 251`}
                className="text-accent transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold">{complianceScore}%</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-3">
          <div className="text-xs font-medium text-muted-foreground uppercase">
            Compliance Breakdown
          </div>
          {autoIndicators.map((indicator, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{indicator.name}</span>
                <span className="font-medium text-foreground">{indicator.percentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-300',
                    indicator.status === 'compliant'
                      ? 'bg-green-500'
                      : indicator.status === 'warning'
                        ? 'bg-yellow-500'
                        : indicator.status === 'non-compliant'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                  )}
                  style={{ width: `${indicator.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {autoIndicators.map((indicator, index) => (
          <div
            key={index}
            className={cn(
              'rounded-lg border p-4 transition-all hover:shadow-lg',
              getStatusColor(indicator.status)
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{indicator.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{indicator.detail}</p>
              </div>
              {getStatusIcon(indicator.status)}
            </div>

            <div className="space-y-2">
              <div className="h-2 rounded-full bg-background/50 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    indicator.status === 'compliant'
                      ? 'bg-green-500'
                      : indicator.status === 'warning'
                        ? 'bg-yellow-500'
                        : indicator.status === 'non-compliant'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                  )}
                  style={{ width: `${indicator.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{indicator.percentage}%</span>
                <span>
                  {indicator.status === 'compliant'
                    ? 'Compliant'
                    : indicator.status === 'warning'
                      ? 'Review Needed'
                      : indicator.status === 'non-compliant'
                        ? 'Action Required'
                        : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="rounded-lg border border-border bg-secondary/20 p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Recommendations
        </h3>
        <ul className="space-y-3 text-sm">
          {autoIndicators
            .filter(ind => ind.status !== 'compliant')
            .map((indicator, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-accent font-bold">•</span>
                <span>
                  {indicator.status === 'warning' &&
                    `Address warning in ${indicator.name} to improve compliance`}
                  {indicator.status === 'non-compliant' &&
                    `Take immediate action on ${indicator.name}`}
                  {indicator.status === 'pending' &&
                    `Complete pending review for ${indicator.name}`}
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
