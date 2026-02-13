'use client'

import { useState } from 'react'
import {
  Download,
  FileText,
  Sheet,
  Database,
  CheckSquare,
  Square,
  Loader,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { exportToCSV, exportToPDF } from '@/lib/export-utils'

interface BulkOperationsProps {
  data: Record<string, unknown>[]
  onExport?: (format: 'excel' | 'pdf' | 'csv', data: Record<string, unknown>[]) => void
}

export function BulkOperations({ data, onExport }: BulkOperationsProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf' | 'csv' | null>(null)

  const toggleRow = (index: number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedRows(newSelected)
  }

  const toggleAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(data.map((_, i) => i)))
    }
  }

  const getSelectedData = () => {
    return data.filter((_, i) => selectedRows.has(i))
  }

  const handleExport = async (format: 'excel' | 'pdf' | 'csv') => {
    setIsExporting(true)
    setExportFormat(format)

    try {
      const selectedData = getSelectedData().length > 0 ? getSelectedData() : data
      const timestamp = new Date().toISOString().split('T')[0]
      const fileName = `export-${timestamp}`

      if (format === 'csv') {
        exportToCSV(selectedData, { fileName: `${fileName}.csv` })
      } else if (format === 'pdf') {
        await exportToPDF(selectedData, { fileName: `${fileName}.pdf` })
      }

      if (onExport) {
        onExport(format, selectedData)
      }
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
      setExportFormat(null)
    }
  }

  const selectedCount = selectedRows.size
  const showBulkActions = selectedCount > 0 || data.length > 0

  return (
    <div className="space-y-4">
      {/* Selection and Actions Bar */}
      {showBulkActions && (
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Selection Info */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleAll}
                className="p-2 hover:bg-secondary/50 rounded-lg transition-colors"
                aria-label={selectedCount === data.length ? 'Deselect all' : 'Select all'}
              >
                {selectedCount === data.length && selectedCount > 0 ? (
                  <CheckSquare className="w-5 h-5 text-accent" />
                ) : (
                  <Square className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              <span className="text-sm font-medium text-foreground">
                {selectedCount > 0
                  ? `${selectedCount} of ${data.length} selected`
                  : `${data.length} items available`}
              </span>
            </div>

            {/* Export Actions */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors font-medium text-sm',
                  isExporting && exportFormat === 'csv' && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isExporting && exportFormat === 'csv' ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Database className="w-4 h-4" />
                )}
                CSV
              </button>
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors font-medium text-sm',
                  isExporting && exportFormat === 'pdf' && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isExporting && exportFormat === 'pdf' ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                PDF
              </button>
              <button
                onClick={() => handleExport('excel')}
                disabled={isExporting}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium text-sm',
                  isExporting && exportFormat === 'excel' && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isExporting && exportFormat === 'excel' ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Sheet className="w-4 h-4" />
                )}
                Excel
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors font-medium text-sm text-muted-foreground hover:text-foreground">
                <Download className="w-4 h-4" />
                More
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Grid with Selection */}
      {data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 border-b border-border sticky top-0">
              <tr>
                <th className="w-12 px-4 py-3">
                  <button
                    onClick={toggleAll}
                    className="p-1 hover:bg-secondary/50 rounded transition-colors"
                  >
                    {selectedCount === data.length && selectedCount > 0 ? (
                      <CheckSquare className="w-4 h-4 text-accent" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </th>
                {Object.keys(data[0] as Record<string, unknown>).map(key => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left font-semibold text-muted-foreground"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    'border-b border-border transition-colors',
                    selectedRows.has(rowIndex)
                      ? 'bg-accent/20 hover:bg-accent/30'
                      : 'hover:bg-secondary/30'
                  )}
                >
                  <td className="w-12 px-4 py-3">
                    <button
                      onClick={() => toggleRow(rowIndex)}
                      className="p-1 hover:bg-secondary/50 rounded transition-colors"
                    >
                      {selectedRows.has(rowIndex) ? (
                        <CheckSquare className="w-4 h-4 text-accent" />
                      ) : (
                        <Square className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </td>
                  {Object.keys(data[0] as Record<string, unknown>).map(key => (
                    <td key={`${rowIndex}-${key}`} className="px-4 py-3 text-foreground">
                      {String((row as Record<string, unknown>)[key] || '-').slice(0, 50)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
