'use client'

import { useState, useMemo } from 'react'
import {
  ChevronUp,
  ChevronDown,
  Download,
  Filter,
  X,
  Settings2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { exportToCSV, exportToPDF } from '@/lib/export-utils'

interface FinancialTableProps {
  data: Record<string, unknown>[]
  columns?: string[]
  title?: string
  onExport?: (data: Record<string, unknown>[]) => void
  maxRows?: number
  highlightNumeric?: boolean
  complianceView?: boolean
}

interface FilterConfig {
  column: string
  operator: 'contains' | 'equals' | 'greaterThan' | 'lessThan'
  value: string
}

export function FinancialTable({
  data,
  columns,
  title,
  onExport,
  maxRows = 15,
  highlightNumeric = true,
  complianceView = false,
}: FinancialTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    column: string
    direction: 'asc' | 'desc'
  } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterConfig[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns || (data.length > 0 ? Object.keys(data[0] as Record<string, unknown>) : []))
  )

  const tableColumns = useMemo(() => {
    if (columns?.length) return columns
    return data.length > 0 ? Object.keys(data[0] as Record<string, unknown>) : []
  }, [data, columns])

  // Apply filters
  const filteredData = useMemo(() => {
    let result = data

    // Search filter
    if (searchTerm) {
      result = result.filter(row => {
        return tableColumns.some(col => {
          const value = (row as Record<string, unknown>)[col]
          return String(value).toLowerCase().includes(searchTerm.toLowerCase())
        })
      })
    }

    // Column filters
    filters.forEach(filter => {
      result = result.filter(row => {
        const value = (row as Record<string, unknown>)[filter.column]
        const stringValue = String(value || '').toLowerCase()

        switch (filter.operator) {
          case 'contains':
            return stringValue.includes(filter.value.toLowerCase())
          case 'equals':
            return stringValue === filter.value.toLowerCase()
          case 'greaterThan':
            return Number(value) > Number(filter.value)
          case 'lessThan':
            return Number(value) < Number(filter.value)
          default:
            return true
        }
      })
    })

    return result
  }, [data, tableColumns, searchTerm, filters])

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    const sorted = [...filteredData].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortConfig.column]
      const bVal = (b as Record<string, unknown>)[sortConfig.column]

      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      const aNum = Number(aVal)
      const bNum = Number(bVal)

      if (!isNaN(aNum) && !isNaN(bNum)) {
        const comparison = aNum < bNum ? -1 : 1
        return sortConfig.direction === 'asc' ? comparison : -comparison
      }

      const comparison = aVal < bVal ? -1 : 1
      return sortConfig.direction === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [filteredData, sortConfig])

  // Paginate
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

  const addFilter = (column: string) => {
    if (!filters.find(f => f.column === column)) {
      setFilters([...filters, { column, operator: 'contains', value: '' }])
    }
  }

  const removeFilter = (column: string) => {
    setFilters(filters.filter(f => f.column !== column))
  }

  const updateFilter = (column: string, key: keyof FilterConfig, value: unknown) => {
    setFilters(
      filters.map(f =>
        f.column === column ? { ...f, [key]: value } : f
      )
    )
    setCurrentPage(1)
  }

  const toggleColumn = (column: string) => {
    const newSet = new Set(visibleColumns)
    if (newSet.has(column)) {
      newSet.delete(column)
    } else {
      newSet.add(column)
    }
    setVisibleColumns(newSet)
  }

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '-'

    if (typeof value === 'number') {
      if (value > 1000000) {
        return `$${(value / 1000000).toFixed(2)}M`
      }
      if (value > 1000) {
        return `$${(value / 1000).toFixed(1)}K`
      }
      return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }

    const str = String(value)
    return str.length > 100 ? str.slice(0, 100) + '...' : str
  }

  const isNumericColumn = (col: string): boolean => {
    return ['total', 'amount', 'price', 'cost', 'revenue', 'budget', 'sum'].some(keyword =>
      col.toLowerCase().includes(keyword)
    )
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
      {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <input
          type="text"
          placeholder="Search data..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="flex-1 px-3 py-2 rounded-lg border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
        />

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors font-medium text-sm',
              showFilters && 'bg-secondary/50'
            )}
          >
            <Filter className="w-4 h-4" />
            Filters {filters.length > 0 && `(${filters.length})`}
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary/50 transition-colors font-medium text-sm"
          >
            <Settings2 className="w-4 h-4" />
            Columns
          </button>

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
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-3">
          {filters.length === 0 ? (
            <div className="flex flex-wrap gap-2">
              {tableColumns
                .filter(col => !filters.find(f => f.column === col))
                .map(col => (
                  <button
                    key={col}
                    onClick={() => addFilter(col)}
                    className="px-3 py-1 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-sm text-muted-foreground hover:text-foreground"
                  >
                    + {col}
                  </button>
                ))}
            </div>
          ) : (
            filters.map(filter => (
              <div key={filter.column} className="flex gap-2 items-center">
                <select
                  value={filter.operator}
                  onChange={e =>
                    updateFilter(
                      filter.column,
                      'operator',
                      e.target.value as FilterConfig['operator']
                    )
                  }
                  className="px-2 py-1 rounded-lg border border-input bg-input text-foreground text-sm"
                >
                  <option value="contains">contains</option>
                  <option value="equals">equals</option>
                  <option value="greaterThan">&gt;</option>
                  <option value="lessThan">&lt;</option>
                </select>
                <input
                  type="text"
                  value={filter.value}
                  onChange={e => updateFilter(filter.column, 'value', e.target.value)}
                  placeholder={`Filter by ${filter.column}`}
                  className="flex-1 px-2 py-1 rounded-lg border border-input bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
                <button
                  onClick={() => removeFilter(filter.column)}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border sticky top-0">
            <tr>
              {tableColumns
                .filter(col => visibleColumns.has(col))
                .map(column => (
                  <th
                    key={column}
                    onClick={() => handleSort(column)}
                    className={cn(
                      'px-4 py-3 text-left font-semibold text-muted-foreground cursor-pointer hover:bg-secondary/70 transition-colors whitespace-nowrap',
                      isNumericColumn(column) && highlightNumeric && 'text-right'
                    )}
                  >
                    <div className={cn('flex items-center gap-2', isNumericColumn(column) && highlightNumeric && 'justify-end')}>
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
                className={cn(
                  'border-b border-border transition-colors',
                  rowIndex % 2 === 0 ? 'hover:bg-secondary/20' : 'bg-secondary/10 hover:bg-secondary/30'
                )}
              >
                {tableColumns
                  .filter(col => visibleColumns.has(col))
                  .map(column => {
                    const value = (row as Record<string, unknown>)[column]
                    const isNumeric = isNumericColumn(column)

                    return (
                      <td
                        key={`${rowIndex}-${column}`}
                        className={cn(
                          'px-4 py-3 text-foreground',
                          isNumeric && highlightNumeric && 'text-right font-medium text-accent'
                        )}
                      >
                        {formatValue(value)}
                      </td>
                    )
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info and Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>
          Showing {paginatedData.length > 0 ? (currentPage - 1) * maxRows + 1 : 0} to{' '}
          {Math.min(currentPage * maxRows, sortedData.length)} of {sortedData.length} records
          {filters.length > 0 && ` (filtered from ${data.length})`}
        </span>

        {totalPages > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-border hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'px-3 py-1 rounded-lg transition-colors text-sm',
                  currentPage === page
                    ? 'bg-accent text-accent-foreground'
                    : 'border border-border hover:bg-secondary/50'
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-border hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
