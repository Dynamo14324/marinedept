import { ChartConfiguration } from 'chart.js'

/**
 * Standard color palette for charts matching the Excel specifications
 */
export const CHART_COLORS = {
  blue: '#0078D4',
  darkBlue: '#003D82',
  darkBlueAlt: '#004B87',
  cyan: '#00B4D8',
  orange: '#FF9500',
  red: '#FF0000',
  grey: '#A8A8A8',
  lightGrey: '#E8E8E8',
  white: '#FFFFFF',
  black: '#000000',
}

/**
 * Get a consistent color for a specific data series
 */
export function getSeriesColor(seriesName: string, index: number): string {
  const colorMap: Record<string, string> = {
    'No of NC': CHART_COLORS.cyan,
    'No. of NC': CHART_COLORS.cyan,
    'No. of Vessels': CHART_COLORS.darkBlue,
    'No. of Audits': CHART_COLORS.grey,
    'NC x Insp': CHART_COLORS.red,
    'NC per Audit': CHART_COLORS.red,
    'Average NC per Audit': CHART_COLORS.red,
  }

  return colorMap[seriesName] || CHART_COLORS.blue
}

/**
 * Configuration for a grouped column chart (External Audit by Categories)
 */
export function createGroupedColumnChartConfig(
  title: string,
  xAxisLabel: string,
  yAxisLabel: string,
  labels: string[],
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }>
): ChartConfiguration {
  return {
    type: 'bar',
    data: {
      labels,
      datasets: datasets.map(ds => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: ds.backgroundColor || CHART_COLORS.blue,
        borderColor: ds.borderColor || CHART_COLORS.blue,
        borderWidth: 1,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: 'x',
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 14, weight: 'bold' },
        },
        legend: {
          position: 'bottom',
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: yAxisLabel,
          },
        },
        x: {
          title: {
            display: true,
            text: xAxisLabel,
          },
        },
      },
    },
  }
}

/**
 * Configuration for a clustered column chart with trend line
 */
export function createClusteredColumnWithTrendConfig(
  title: string,
  xAxisLabel: string,
  yAxisLabel: string,
  labels: string[],
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string
    isTrendLine?: boolean
    borderColor?: string
  }>
): ChartConfiguration {
  const barDatasets = datasets.filter(d => !d.isTrendLine)
  const trendDatasets = datasets.filter(d => d.isTrendLine)

  return {
    type: 'bar',
    data: {
      labels,
      datasets: [
        ...barDatasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: ds.backgroundColor || CHART_COLORS.blue,
          borderColor: ds.borderColor || CHART_COLORS.blue,
          type: 'bar' as const,
          order: 2,
        })),
        ...trendDatasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.borderColor || CHART_COLORS.red,
          backgroundColor: 'transparent',
          type: 'line' as const,
          borderWidth: 2,
          tension: 0.3,
          order: 1,
        })),
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 14, weight: 'bold' },
        },
        legend: {
          position: 'bottom',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: yAxisLabel,
          },
        },
        x: {
          title: {
            display: true,
            text: xAxisLabel,
          },
        },
      },
    },
  }
}

/**
 * Configuration for a stacked column chart with trend line
 */
export function createStackedColumnWithTrendConfig(
  title: string,
  xAxisLabel: string,
  yAxisLabel: string,
  labels: string[],
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string
    isTrendLine?: boolean
    borderColor?: string
  }>
): ChartConfiguration {
  const barDatasets = datasets.filter(d => !d.isTrendLine)
  const trendDatasets = datasets.filter(d => d.isTrendLine)

  return {
    type: 'bar',
    data: {
      labels,
      datasets: [
        ...barDatasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: ds.backgroundColor || CHART_COLORS.blue,
          borderColor: ds.borderColor || CHART_COLORS.blue,
          type: 'bar' as const,
          order: 2,
        })),
        ...trendDatasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.borderColor || CHART_COLORS.red,
          backgroundColor: 'transparent',
          type: 'line' as const,
          borderWidth: 2,
          tension: 0.3,
          order: 1,
        })),
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 14, weight: 'bold' },
        },
        legend: {
          position: 'bottom',
        },
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: xAxisLabel,
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          title: {
            display: true,
            text: yAxisLabel,
          },
        },
      },
    },
  }
}

/**
 * Export a Chart.js chart as an image
 * Usage: in a React component with useRef, call exportChartAsImage(chartRef.current?.canvas)
 */
export async function exportChartAsImage(
  canvas: HTMLCanvasElement | null | undefined,
  filename: string = 'chart.png'
): Promise<void> {
  if (!canvas) {
    console.error('[v0] Canvas element not found for export')
    return
  }

  try {
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('[v0] Failed to export chart:', error)
  }
}
