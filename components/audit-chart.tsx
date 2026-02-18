'use client'

import { useEffect, useRef } from 'react'
import Chart, { ChartConfiguration } from 'chart.js/auto'
import { exportChartAsImage } from '@/lib/chart-utils'
import { Button } from '@/components/ui/button'

interface AuditChartProps {
  config: ChartConfiguration
  chartId: string
  title: string
  showExportButton?: boolean
}

/**
 * Reusable Chart.js component for rendering audit charts with export functionality
 */
export function AuditChart({
  config,
  chartId,
  title,
  showExportButton = true,
}: AuditChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Clean up existing chart
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    // Create new chart
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    chartRef.current = new Chart(ctx, config as ChartConfiguration)

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [config])

  const handleExport = () => {
    if (canvasRef.current) {
      const filename = `${title.replace(/\s+/g, '-')}.png`
      exportChartAsImage(canvasRef.current, filename)
    }
  }

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {showExportButton && (
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4"
              />
            </svg>
            Download
          </Button>
        )}
      </div>
      <div className="relative h-96 w-full">
        <canvas
          ref={canvasRef}
          id={chartId}
          aria-label={title}
        />
      </div>
    </div>
  )
}
