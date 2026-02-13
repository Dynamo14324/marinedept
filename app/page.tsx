'use client'

import { useState, useCallback, useEffect } from 'react'
import { BarChart3, TrendingUp, AlertCircle, Activity } from 'lucide-react'
import { parseExcelFile, extractFinancialData, calculateMetrics } from '@/lib/excel-parser'
import { parseCSVFile, normalizeCSVData } from '@/lib/csv-parser'
import { parsePDFFile } from '@/lib/pdf-parser'
import { validateFinancialData } from '@/lib/data-validator'
import { FileUpload } from '@/components/file-upload'
import { KPICard } from '@/components/kpi-card'
import { DataTable } from '@/components/data-table'
import { FinancialChart } from '@/components/financial-chart'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { generateSampleData, generateFinancialMetrics, SAMPLE_COMPLIANCE_INDICATORS } from '@/lib/sample-data'

interface DashboardState {
  data: Record<string, unknown>[] | null
  fileName: string | null
  metrics: Record<string, number> | null
  validation: { isValid: boolean; warnings: string[] } | null
  loading: boolean
  error: string | null
  isUsingRealData: boolean
}

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    data: null,
    fileName: null,
    metrics: null,
    validation: null,
    loading: false,
    error: null,
    isUsingRealData: false,
  })

  // Load sample data on mount
  useEffect(() => {
    const sampleData = generateSampleData(50)
    const metrics = generateFinancialMetrics(sampleData)
    
    setState(prev => ({
      ...prev,
      data: sampleData,
      fileName: 'Sample Data (2024)',
      metrics: metrics as Record<string, number>,
      validation: {
        isValid: true,
        warnings: [],
      },
      isUsingRealData: false,
    }))
  }, [])

  const handleFileSelect = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const extension = file.name.split('.').pop()?.toLowerCase()
      let data: Record<string, unknown>[] = []

      if (extension === 'xlsx' || extension === 'xls') {
        const parsed = await parseExcelFile(file)
        // Get the first sheet
        const firstSheet = Object.values(parsed.sheets)[0] || []
        data = firstSheet
      } else if (extension === 'csv') {
        const parsed = await parseCSVFile(file)
        data = normalizeCSVData(parsed.data)
      } else if (extension === 'pdf') {
        const parsed = await parsePDFFile(file)
        // For PDF, create a simple data structure from extracted text
        data = [{ content: parsed.text.slice(0, 500), metadata: parsed.metadata }]
      }

      // Validate the data
      const validation = validateFinancialData(data)

      // Calculate metrics
      const metrics = calculateMetrics(data)

      setState(prev => ({
        ...prev,
        data,
        fileName: file.name,
        metrics,
        validation: {
          isValid: validation.isValid,
          warnings: validation.warnings,
        },
        loading: false,
        isUsingRealData: true,
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }))
    }
  }, [])

  const handleExport = useCallback((exportData: Record<string, unknown>[]) => {
    try {
      // Convert to CSV
      if (exportData.length === 0) return

      const headers = Object.keys(exportData[0] as Record<string, unknown>)
      const csvContent = [
        headers.join(','),
        ...exportData.map(row =>
          headers
            .map(header => {
              const value = (row as Record<string, unknown>)[header]
              const stringValue = String(value || '')
              // Escape quotes and wrap in quotes if contains comma
              return stringValue.includes(',')
                ? `"${stringValue.replace(/"/g, '""')}"`
                : stringValue
            })
            .join(',')
        ),
      ].join('\n')

      // Download
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `export-${Date.now()}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent">
                <BarChart3 className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">IAnSI Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Intelligence and Analysis System Interface
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <section className="mb-12">
          <div className="rounded-lg border border-border bg-secondary/30 p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Upload Your Data Files
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a financial data file (Excel, CSV, or PDF) to replace the sample data
            </p>
            <FileUpload
              onFileSelect={handleFileSelect}
              accept=".xlsx,.xls,.csv,.pdf"
              maxSize={50 * 1024 * 1024}
              label="Select financial data file (Excel, CSV, or PDF)"
            />
            {state.loading && (
              <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
                <div className="flex items-center gap-2 text-accent">
                  <Activity className="w-5 h-5 animate-spin" />
                  <span>Processing file...</span>
                </div>
              </div>
            )}
            {state.error && (
              <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                  <span>{state.error}</span>
                </div>
              </div>
            )}
            {state.isUsingRealData && (
              <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 text-green-600">
                  <Activity className="w-5 h-5" />
                  <span>Successfully loaded {state.fileName}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Dashboard Content */}
        {state.data && (
          <>
            {/* Validation Info */}
            {state.validation && !state.validation.isValid && (
              <div className="mb-8 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-600">Data Validation Warnings</p>
                    <ul className="mt-2 space-y-1 text-sm text-yellow-600">
                      {state.validation.warnings.map((warning, i) => (
                        <li key={i}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* KPI Cards */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Key Performance Indicators
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                  title="TOTAL AMOUNT"
                  value={state.metrics?.total ? formatCurrency(state.metrics.total) : '$0'}
                  icon={<TrendingUp className="w-5 h-5" />}
                  variant="accent"
                />
                <KPICard
                  title="AVERAGE"
                  value={state.metrics?.average ? formatCurrency(state.metrics.average) : '$0'}
                  icon={<TrendingUp className="w-5 h-5" />}
                  variant="default"
                />
                <KPICard
                  title="MEDIAN"
                  value={state.metrics?.median ? formatCurrency(state.metrics.median) : '$0'}
                  icon={<TrendingUp className="w-5 h-5" />}
                  variant="default"
                />
                <KPICard
                  title="MAX VALUE"
                  value={state.metrics?.max ? formatCurrency(state.metrics.max) : '$0'}
                  icon={<TrendingUp className="w-5 h-5" />}
                  variant="default"
                />
                <KPICard
                  title="MIN VALUE"
                  value={state.metrics?.min ? formatCurrency(state.metrics.min) : '$0'}
                  icon={<TrendingUp className="w-5 h-5" />}
                  variant="default"
                />
                <KPICard
                  title="RECORD COUNT"
                  value={state.metrics?.count ? formatNumber(state.metrics.count) : '0'}
                  icon={<TrendingUp className="w-5 h-5" />}
                  variant="default"
                />
              </div>
            </section>

            {/* Charts Section */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Financial Analysis
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FinancialChart
                  data={state.data}
                  type="bar"
                  xKey="department"
                  yKeys={['amount']}
                  title="Amount by Department"
                  height={350}
                />
                <FinancialChart
                  data={state.data}
                  type="pie"
                  xKey="category"
                  yKeys={['amount']}
                  title="Spending by Category"
                  height={350}
                />
              </div>
            </section>

            <section className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FinancialChart
                  data={state.data}
                  type="line"
                  xKey="date"
                  yKeys={['amount']}
                  title="Amount Trends Over Time"
                  height={350}
                />
                <FinancialChart
                  data={state.data}
                  type="area"
                  xKey="status"
                  yKeys={['amount']}
                  title="Amount by Status"
                  height={350}
                />
              </div>
            </section>

            {/* Compliance Indicators */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Compliance Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SAMPLE_COMPLIANCE_INDICATORS.map((indicator) => (
                  <div
                    key={indicator.name}
                    className="rounded-lg border border-border bg-secondary/20 p-4"
                  >
                    <h3 className="font-semibold text-foreground text-sm">{indicator.name}</h3>
                    <p className="text-2xl font-bold text-accent my-2">{indicator.percentage}%</p>
                    <p className="text-xs text-muted-foreground">{indicator.detail}</p>
                    <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          indicator.status === 'compliant'
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                        }`}
                        style={{ width: `${indicator.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Table */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Data Review
              </h2>
              <DataTable
                data={state.data}
                onExport={handleExport}
                maxRows={15}
              />
            </section>

            {/* File Info */}
            <section className="p-6 rounded-lg border border-border bg-secondary/20">
              <h3 className="font-semibold text-foreground mb-3">Data Source Information</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Source:</dt>
                  <dd className="text-foreground">{state.fileName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status:</dt>
                  <dd className="text-foreground">
                    {state.isUsingRealData ? 'Real Data Loaded' : 'Sample Data'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Records Loaded:</dt>
                  <dd className="text-foreground">{state.data.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Columns:</dt>
                  <dd className="text-foreground">
                    {state.data.length > 0
                      ? Object.keys(state.data[0] as Record<string, unknown>).length
                      : 0}
                  </dd>
                </div>
              </dl>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
