'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, TrendingUp, AlertCircle, Settings } from 'lucide-react'
import { FinancialChart } from '@/components/financial-chart'
import { FinancialTable } from '@/components/financial-table'
import { ComplianceDashboard } from '@/components/compliance-dashboard'
import { KPICard } from '@/components/kpi-card'
import { generateSampleData } from '@/lib/sample-data'
import { calculateMetrics } from '@/lib/excel-parser'
import { formatCurrency, formatNumber } from '@/lib/utils'

export default function AnalyticsPage() {
  const [sampleData] = useState(() => generateSampleData(100))
  const [metrics] = useState(() => calculateMetrics(sampleData))

  // Extract numeric columns for charts
  const numericColumns = Object.keys(sampleData[0] || {}).filter(
    col =>
      typeof sampleData[0][col as keyof typeof sampleData[0]] === 'number' ||
      /amount|total|budget|revenue|cost|expense/.test(col.toLowerCase())
  )

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
                <h1 className="text-2xl font-bold text-foreground">Analytics Center</h1>
                <p className="text-sm text-muted-foreground">
                  Comprehensive financial and compliance analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top KPIs */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Revenue"
              value={formatCurrency(
                metrics[numericColumns[0] + '_sum'] || 0
              )}
              trend={12}
              trendLabel="Previous Period"
              icon={<TrendingUp className="w-5 h-5" />}
              variant="accent"
            />
            <KPICard
              title="Average Amount"
              value={formatNumber(
                (metrics[numericColumns[0] + '_avg'] || 0) as number
              )}
              subtitle="Per transaction"
              icon={<BarChart3 className="w-5 h-5" />}
            />
            <KPICard
              title="Records Processed"
              value={sampleData.length}
              subtitle={`${Object.keys(sampleData[0] || {}).length} columns`}
              icon={<Settings className="w-5 h-5" />}
            />
            <KPICard
              title="Data Quality"
              value="98%"
              subtitle="Validation passed"
              trend={3}
              trendLabel="vs last month"
              variant="accent"
            />
          </div>
        </section>

        {/* Tabs for different views */}
        <Tabs defaultValue="charts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="tables">Data</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {numericColumns.slice(0, 2).map((col, idx) => (
                <FinancialChart
                  key={col}
                  data={sampleData.slice(0, 50)}
                  type={idx === 0 ? 'line' : 'area'}
                  xKey="id"
                  yKeys={[col]}
                  title={`${col} Trend`}
                  height={300}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {numericColumns.slice(2, 4).map((col, idx) => (
                <FinancialChart
                  key={col}
                  data={sampleData.slice(0, 30)}
                  type={idx === 0 ? 'bar' : 'line'}
                  xKey="id"
                  yKeys={[col]}
                  title={`${col} Distribution`}
                  height={300}
                />
              ))}
            </div>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="tables">
            <FinancialTable
              data={sampleData}
              title="Financial Data Details"
              maxRows={15}
              highlightNumeric={true}
            />
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <ComplianceDashboard data={sampleData} />
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export">
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-secondary/20 p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Export Options
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Export your financial data in multiple formats for further analysis and
                  reporting.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/10 transition-all text-left group">
                    <h4 className="font-semibold text-foreground mb-2 group-hover:text-accent">
                      Excel (.xlsx)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Professional spreadsheet format with formatting
                    </p>
                  </button>
                  <button className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/10 transition-all text-left group">
                    <h4 className="font-semibold text-foreground mb-2 group-hover:text-accent">
                      PDF Report
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Formatted report with charts and tables
                    </p>
                  </button>
                  <button className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/10 transition-all text-left group">
                    <h4 className="font-semibold text-foreground mb-2 group-hover:text-accent">
                      CSV (.csv)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Lightweight format for data import/export
                    </p>
                  </button>
                </div>
              </div>

              {/* Recent Exports */}
              <div className="rounded-lg border border-border bg-secondary/20 p-6">
                <h3 className="font-semibold text-foreground mb-4">Recent Exports</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium text-foreground">Q4_Financial_Report.xlsx</p>
                      <p className="text-xs text-muted-foreground">Exported 2 hours ago</p>
                    </div>
                    <button className="px-3 py-1 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
                      Download
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium text-foreground">Compliance_Summary.pdf</p>
                      <p className="text-xs text-muted-foreground">Exported 1 day ago</p>
                    </div>
                    <button className="px-3 py-1 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
