'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DataTableProps {
  data: Record<string, unknown>[]
  columns?: string[]
  onExport?: (data: Record<string, unknown>[]) => void
  maxRows?: number
  searchable?: boolean
}

export function DataTable({
  data,
  columns,
  onExport,
  maxRows = 10,
  searchable = true,
}: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    column: string
    direction: 'asc' | 'desc'
  } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Get columns from data if not provided
  const tableColumns = useMemo(() => {
    if (columns?.length) return columns
    return data.length > 0 ? Object.keys(data[0] as Record<string, unknown>) : []
  }, [data, columns])

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchTerm) return data

    return data.filter(row => {
      return tableColumns.some(col => {
        const value = (row as Record<string, unknown>)[col]
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      })
    })
  }, [data, tableColumns, searchTerm])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortConfig.column]
      const bVal = (b as Record<string, unknown>)[sortConfig.column]

      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      const comparison = aVal < bVal ? -1 : 1
      return sortConfig.direction === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [filteredData, sortConfig])

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * maxRows
    return sortedData.slice(start, start + maxRows)
  }, [sortedData, currentPage, maxRows])

  const totalPages = Math.ceil(sortedData.length / maxRows)

  const handleSort = (column: string) => {
    setSortConfig(current => {
      if (current?.column === column) {
        return {
          column,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        }
      }
      return { column, direction: 'asc' }
    })
    setCurrentPage(1)
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig?.column !== column) {
      return <div className="w-4 h-4" />
    }

    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted p-8 text-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Export */}
      <div className="flex items-center justify-between gap-4">
        {searchable && (
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="flex-1 px-3 py-2 rounded-lg border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        )}
        {onExport && (
          <button
            onClick={() => onExport(sortedData)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              {tableColumns.map(column => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className="px-4 py-3 text-left font-semibold text-muted-foreground cursor-pointer hover:bg-secondary/70 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{column}</span>
                    <SortIcon column={column} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-border hover:bg-secondary/30 transition-colors"
              >
                {tableColumns.map(column => (
                  <td
                    key={`${rowIndex}-${column}`}
                    className="px-4 py-3 text-foreground"
                  >
                    {String((row as Record<string, unknown>)[column] || '-').slice(0, 100)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {Math.min((currentPage - 1) * maxRows + 1, sortedData.length)} to{' '}
            {Math.min(currentPage * maxRows, sortedData.length)} of {sortedData.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-border hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'px-3 py-1 rounded-lg transition-colors',
                    currentPage === page
                      ? 'bg-accent text-accent-foreground'
                      : 'border border-border hover:bg-secondary/50'
                  )}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-border hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
