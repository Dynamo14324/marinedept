'use client'

import { useState } from 'react'
import {
  Download,
  FileText,
  Sheet,
  Database,
  Archive,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { BulkOperations } from '@/components/bulk-operations'
import { generateSampleData } from '@/lib/sample-data'
import { formatDate } from '@/lib/utils'

interface ExportJob {
  id: string
  name: string
  format: 'excel' | 'pdf' | 'csv'
  recordCount: number
  status: 'completed' | 'processing' | 'failed'
  createdAt: string
  size?: number
}

export default function ExportPage() {
  const [sampleData] = useState(() => generateSampleData(50))
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([
    {
      id: '1',
      name: 'Q4_Financial_Report',
      format: 'excel',
      recordCount: 1250,
      status: 'completed',
      createdAt: '2024-12-15T14:30:00',
      size: 2048000,
    },
    {
      id: '2',
      name: 'Operations_Summary',
      format: 'pdf',
      recordCount: 850,
      status: 'completed',
      createdAt: '2024-12-14T10:15:00',
      size: 1536000,
    },
    {
      id: '3',
      name: 'Budget_Export',
      format: 'csv',
      recordCount: 500,
      status: 'processing',
      createdAt: '2024-12-13T16:45:00',
    },
  ])

  const [scheduledExports] = useState([
    {
      id: 'sched-1',
      name: 'Weekly Financial Report',
      format: 'excel' as const,
      frequency: 'Every Monday at 9:00 AM',
      nextRun: '2024-12-16T09:00:00',
      isActive: true,
    },
    {
      id: 'sched-2',
      name: 'Monthly Compliance Report',
      format: 'pdf' as const,
      frequency: 'First day of month at 8:00 AM',
      nextRun: '2025-01-01T08:00:00',
      isActive: true,
    },
  ])

  const handleExport = (format: 'excel' | 'pdf' | 'csv', data: Record<string, unknown>[]) => {
    const newJob: ExportJob = {
      id: `job-${Date.now()}`,
      name: `Export_${new Date().toLocaleDateString().replace(/\//g, '-')}`,
      format,
      recordCount: data.length,
      status: 'processing',
      createdAt: new Date().toISOString(),
    }

    setExportJobs([newJob, ...exportJobs])

    // Simulate processing
    setTimeout(() => {
      setExportJobs(jobs =>
        jobs.map(j =>
          j.id === newJob.id
            ? { ...j, status: 'completed', size: Math.random() * 5000000 + 512000 }
            : j
        )
      )
    }, 2000)
  }

  const getStatusIcon = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'excel':
        return <Sheet className="w-4 h-4" />
      case 'pdf':
        return <FileText className="w-4 h-4" />
      case 'csv':
        return <Database className="w-4 h-4" />
      default:
        return <Download className="w-4 h-4" />
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Export Center</h1>
            <p className="text-sm text-muted-foreground">
              Manage data exports and scheduled reports
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Export Section */}
        <section className="rounded-lg border border-border bg-secondary/20 p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Quick Export</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/10 transition-all text-left group">
              <div className="flex items-center gap-3 mb-2">
                <Sheet className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground group-hover:text-accent">
                  Excel Export
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Export to .xlsx format with formatting
              </p>
            </button>
            <button className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/10 transition-all text-left group">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground group-hover:text-accent">
                  PDF Report
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Generate professional PDF reports
              </p>
            </button>
            <button className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/10 transition-all text-left group">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground group-hover:text-accent">
                  CSV Export
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Lightweight CSV format for data import
              </p>
            </button>
          </div>

          {/* Bulk Operations */}
          <BulkOperations data={sampleData} onExport={handleExport} />
        </section>

        {/* Export History */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-6">Export History</h2>
          <div className="space-y-3">
            {exportJobs.map(job => (
              <div
                key={job.id}
                className="rounded-lg border border-border bg-secondary/20 p-4 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary">
                      {getFormatIcon(job.format)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{job.name}</h3>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{job.format.toUpperCase()}</span>
                        <span>{job.recordCount.toLocaleString()} records</span>
                        <span>{formatFileSize(job.size)}</span>
                        <span>{formatDate(job.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(job.status)}
                      <span className="text-sm font-medium text-muted-foreground capitalize">
                        {job.status}
                      </span>
                    </div>
                    {job.status === 'completed' && (
                      <button className="px-3 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-sm font-medium">
                        Download
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Scheduled Exports */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Scheduled Exports</h2>
            <button className="px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium text-sm">
              + New Schedule
            </button>
          </div>

          <div className="space-y-3">
            {scheduledExports.map(schedule => (
              <div
                key={schedule.id}
                className="rounded-lg border border-border bg-secondary/20 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={
                        schedule.isActive ? 'w-3 h-3 rounded-full bg-green-500' : 'w-3 h-3 rounded-full bg-gray-500'
                      }
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{schedule.name}</h3>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{getFormatIcon(schedule.format)} {schedule.format.toUpperCase()}</span>
                        <span>{schedule.frequency}</span>
                        <span>Next: {formatDate(schedule.nextRun)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-sm font-medium">
                      Edit
                    </button>
                    <button className="px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Export Settings */}
        <section className="rounded-lg border border-border bg-secondary/20 p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Export Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
              <div>
                <h3 className="font-medium text-foreground">Auto-archive old exports</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Automatically delete exports older than 30 days
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
              <div>
                <h3 className="font-medium text-foreground">Email notifications</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive email when exports are completed
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
