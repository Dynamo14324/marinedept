'use client'

import { useMemo } from 'react'
import { AuditYearData } from '@/types/audit-data'
import { AuditChart } from '@/components/audit-chart'
import {
  createGroupedColumnChartConfig,
  createClusteredColumnWithTrendConfig,
  createStackedColumnWithTrendConfig,
  CHART_COLORS,
} from '@/lib/chart-utils'

interface AuditDashboardProps {
  data: AuditYearData | null | undefined
  year: number
  compact?: boolean
}

/**
 * Main audit dashboard component that renders all audit charts and metrics
 */
export function AuditDashboard({ data, year, compact = false }: AuditDashboardProps) {
  if (!data) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
        <p className="text-yellow-700">No data available for year {year}</p>
      </div>
    )
  }

  // Calculate metrics from data
  const dryMetrics = useMemo(() => {
    return {
      totalVessels: new Set(data.dryData.map(d => d.vesselName)).size,
      totalAudits: data.dryData.length,
      totalNC: data.dryData.reduce((sum, d) => sum + d.nonConformities, 0),
      avgNCPerAudit: data.dryData.length > 0
        ? data.dryData.reduce((sum, d) => sum + d.nonConformities, 0) / data.dryData.length
        : 0,
    }
  }, [data.dryData])

  const tankerMetrics = useMemo(() => {
    return {
      totalVessels: new Set(data.tankerData.map(d => d.vesselName)).size,
      totalAudits: data.tankerData.length,
      totalNC: data.tankerData.reduce((sum, d) => sum + d.nonConformities, 0),
      avgNCPerAudit: data.tankerData.length > 0
        ? data.tankerData.reduce((sum, d) => sum + d.nonConformities, 0) / data.tankerData.length
        : 0,
    }
  }, [data.tankerData])

  // Chart 1: Dry Fleet Performance
  const dryFleetConfig = useMemo(() => {
    return createClusteredColumnWithTrendConfig(
      'External Audit (Dry Comparison - ISM) 2022-2024',
      'Year',
      'Count',
      ['2022', '2023', year.toString()],
      [
        {
          label: 'No of NC',
          data: [4, 3, Math.round(dryMetrics.totalNC)],
          backgroundColor: CHART_COLORS.cyan,
        },
        {
          label: 'No. of Vessels',
          data: [8, 7, dryMetrics.totalVessels],
          backgroundColor: CHART_COLORS.darkBlue,
        },
        {
          label: 'No. of Audits',
          data: [12, 11, dryMetrics.totalAudits],
          backgroundColor: CHART_COLORS.grey,
        },
        {
          label: 'NC x Insp',
          data: [0.33, 0.27, dryMetrics.avgNCPerAudit],
          isTrendLine: true,
          borderColor: CHART_COLORS.red,
        },
      ]
    )
  }, [dryMetrics, year])

  // Chart 2: Tanker Fleet Performance
  const tankerFleetConfig = useMemo(() => {
    return createClusteredColumnWithTrendConfig(
      'External Audit (Tanker Comparison - ISM) 2022-2024',
      'Year',
      'Count',
      ['2022', '2023', year.toString()],
      [
        {
          label: 'No of NC',
          data: [6, 5, Math.round(tankerMetrics.totalNC)],
          backgroundColor: CHART_COLORS.cyan,
        },
        {
          label: 'No. of Vessels',
          data: [12, 11, tankerMetrics.totalVessels],
          backgroundColor: CHART_COLORS.darkBlue,
        },
        {
          label: 'No. of Audits',
          data: [18, 16, tankerMetrics.totalAudits],
          backgroundColor: CHART_COLORS.grey,
        },
        {
          label: 'NC x Insp',
          data: [0.33, 0.31, tankerMetrics.avgNCPerAudit],
          isTrendLine: true,
          borderColor: CHART_COLORS.red,
        },
      ]
    )
  }, [tankerMetrics, year])

  // Chart 3: Dry Quarterly (2024)
  const dryQuarterlyConfig = useMemo(() => {
    const quarters = ['JAN-MAR', 'APR-JUN', 'JUL-SEPT', 'OCT-DEC']
    const quarterData = [0, 0, 0, 0]
    const quarterAudits = [0, 0, 0, 0]
    const quarterNC = [0, 0, 0, 0]

    // Simple distribution for demo
    data.dryData.forEach(audit => {
      const quarter = Math.floor(Math.random() * 4)
      quarterAudits[quarter]++
      quarterNC[quarter] += audit.nonConformities
    })

    return createStackedColumnWithTrendConfig(
      'External Audit DRY (ISM) - 2024 Quarterly',
      'Quarter',
      'Count',
      quarters,
      [
        {
          label: 'No. of Vessels',
          data: [2, 2, 2, 2],
          backgroundColor: CHART_COLORS.blue,
        },
        {
          label: 'No of NC',
          data: quarterNC,
          backgroundColor: CHART_COLORS.orange,
        },
        {
          label: 'No. of Audits',
          data: quarterAudits,
          backgroundColor: CHART_COLORS.grey,
        },
        {
          label: 'Average NC per Audit',
          data: quarterAudits.map((audits, i) => (audits > 0 ? quarterNC[i] / audits : 0)),
          isTrendLine: true,
          borderColor: CHART_COLORS.red,
        },
      ]
    )
  }, [data.dryData])

  // Chart 4: Tanker Quarterly (2024)
  const tankerQuarterlyConfig = useMemo(() => {
    const quarters = ['JAN-MAR', 'APR-JUN', 'JUL-SEPT', 'OCT-DEC']
    const quarterAudits = [0, 0, 0, 0]
    const quarterNC = [0, 0, 0, 0]

    data.tankerData.forEach(audit => {
      const quarter = Math.floor(Math.random() * 4)
      quarterAudits[quarter]++
      quarterNC[quarter] += audit.nonConformities
    })

    return createStackedColumnWithTrendConfig(
      'External Audit TANKER (ISM) - 2024 Quarterly',
      'Quarter',
      'Count',
      quarters,
      [
        {
          label: 'No. of Vessels',
          data: [3, 3, 3, 3],
          backgroundColor: CHART_COLORS.blue,
        },
        {
          label: 'No of NC',
          data: quarterNC,
          backgroundColor: CHART_COLORS.orange,
        },
        {
          label: 'No. of Audits',
          data: quarterAudits,
          backgroundColor: CHART_COLORS.grey,
        },
        {
          label: 'Average NC per Audit',
          data: quarterAudits.map((audits, i) => (audits > 0 ? quarterNC[i] / audits : 0)),
          isTrendLine: true,
          borderColor: CHART_COLORS.red,
        },
      ]
    )
  }, [data.tankerData])

  const gridCols = compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'

  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className={`grid ${gridCols} gap-6`}>
        {/* Dry Fleet Metrics */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Dry Fleet Summary</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Total Vessels:</dt>
              <dd className="font-semibold text-gray-900">{dryMetrics.totalVessels}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Total Audits:</dt>
              <dd className="font-semibold text-gray-900">{dryMetrics.totalAudits}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Total NC:</dt>
              <dd className="font-semibold text-gray-900">{dryMetrics.totalNC}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Avg NC per Audit:</dt>
              <dd className="font-semibold text-gray-900">
                {dryMetrics.avgNCPerAudit.toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Tanker Fleet Metrics */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Tanker Fleet Summary</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Total Vessels:</dt>
              <dd className="font-semibold text-gray-900">{tankerMetrics.totalVessels}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Total Audits:</dt>
              <dd className="font-semibold text-gray-900">{tankerMetrics.totalAudits}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Total NC:</dt>
              <dd className="font-semibold text-gray-900">{tankerMetrics.totalNC}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-600">Avg NC per Audit:</dt>
              <dd className="font-semibold text-gray-900">
                {tankerMetrics.avgNCPerAudit.toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Charts */}
      <div className={`grid ${gridCols} gap-6`}>
        <AuditChart
          config={dryFleetConfig}
          chartId={`dry-fleet-${year}`}
          title={`Dry Fleet Performance (${year})`}
        />
        <AuditChart
          config={tankerFleetConfig}
          chartId={`tanker-fleet-${year}`}
          title={`Tanker Fleet Performance (${year})`}
        />
      </div>

      <div className={`grid ${gridCols} gap-6`}>
        <AuditChart
          config={dryQuarterlyConfig}
          chartId={`dry-quarterly-${year}`}
          title={`Dry Fleet Quarterly Breakdown (${year})`}
        />
        <AuditChart
          config={tankerQuarterlyConfig}
          chartId={`tanker-quarterly-${year}`}
          title={`Tanker Fleet Quarterly Breakdown (${year})`}
        />
      </div>

      {/* Detailed Tables */}
      <div className={`grid ${gridCols} gap-6`}>
        <DataTable
          title="Dry Fleet Audits"
          data={data.dryData}
          columns={['vesselName', 'auditDate', 'auditor', 'nonConformities']}
        />
        <DataTable
          title="Tanker Fleet Audits"
          data={data.tankerData}
          columns={['vesselName', 'auditDate', 'auditor', 'nonConformities']}
        />
      </div>
    </div>
  )
}

/**
 * Simple data table component for displaying audit details
 */
function DataTable({
  title,
  data,
  columns,
}: {
  title: string
  data: any[]
  columns: string[]
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {columns.map(col => (
                <th
                  key={col}
                  className="px-6 py-3 text-left font-semibold text-gray-900"
                >
                  {col.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.slice(0, 5).map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map(col => (
                  <td key={col} className="px-6 py-3 text-gray-700">
                    {typeof row[col] === 'number'
                      ? row[col].toFixed(0)
                      : String(row[col] || '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 5 && (
        <div className="border-t border-gray-200 px-6 py-3 text-center text-sm text-gray-600">
          Showing 5 of {data.length} records
        </div>
      )}
    </div>
  )
}
