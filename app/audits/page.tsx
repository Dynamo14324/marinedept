'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { loadAuditDataForYear, getAvailableYears } from '@/app/actions/upload-excel'
import { AuditDashboard } from '@/components/audit-dashboard'
import { AuditYearData } from '@/types/audit-data'

export default function AuditsPage() {
  const [availableYears, setAvailableYears] = useState<number[]>([])
  const [selectedYears, setSelectedYears] = useState<number[]>([])
  const [auditData, setAuditData] = useState<Record<number, AuditYearData | null>>({})
  const [loading, setLoading] = useState(true)
  const [comparisonMode, setComparisonMode] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load available years on mount
  useEffect(() => {
    const loadYears = async () => {
      try {
        setLoading(true)
        const years = await getAvailableYears()
        setAvailableYears(years)
        
        if (years.length > 0) {
          setSelectedYears([years[0]])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load available years')
      } finally {
        setLoading(false)
      }
    }

    loadYears()
  }, [])

  // Load data for selected years
  useEffect(() => {
    const loadData = async () => {
      const newData: Record<number, AuditYearData | null> = {}
      
      for (const year of selectedYears) {
        if (!auditData[year]) {
          try {
            const data = await loadAuditDataForYear(year)
            newData[year] = data
          } catch (err) {
            console.error(`[v0] Failed to load data for year ${year}:`, err)
            newData[year] = null
          }
        }
      }

      if (Object.keys(newData).length > 0) {
        setAuditData(prev => ({ ...prev, ...newData }))
      }
    }

    if (selectedYears.length > 0) {
      loadData()
    }
  }, [selectedYears, auditData])

  const handleToggleYear = (year: number) => {
    setSelectedYears(prev => {
      if (prev.includes(year)) {
        return prev.filter(y => y !== year)
      } else {
        return [...prev, year]
      }
    })
  }

  const handleToggleComparisonMode = () => {
    setComparisonMode(!comparisonMode)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto" />
          <p className="text-gray-600">Loading audit data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  if (availableYears.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">Audit Dashboard</h1>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
            <p className="text-yellow-700">
              No audit data available. Please upload Excel files using the admin interface.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Audit Dashboard</h1>
          <p className="text-gray-600">
            Marine Department Internal & External Audit Performance
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Select Years</h2>
              <div className="flex flex-wrap gap-2">
                {availableYears.map(year => (
                  <Button
                    key={year}
                    onClick={() => handleToggleYear(year)}
                    variant={selectedYears.includes(year) ? 'default' : 'outline'}
                    size="sm"
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-right">
              {selectedYears.length > 1 && (
                <Button
                  onClick={handleToggleComparisonMode}
                  variant={comparisonMode ? 'default' : 'outline'}
                  size="sm"
                >
                  {comparisonMode ? 'Single View' : 'Comparison View'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {selectedYears.length === 0 ? (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
            <p className="text-yellow-700">Please select at least one year to view audit data.</p>
          </div>
        ) : comparisonMode && selectedYears.length > 1 ? (
          // Comparison Mode - Side-by-side view
          <div className="grid gap-6 lg:grid-cols-2">
            {selectedYears.map(year => (
              <div key={year}>
                <h2 className="mb-4 text-xl font-bold text-gray-900">Year {year}</h2>
                <AuditDashboard
                  data={auditData[year]}
                  year={year}
                  compact
                />
              </div>
            ))}
          </div>
        ) : (
          // Single Year View - Full width
          <>
            {selectedYears.map(year => (
              <AuditDashboard
                key={year}
                data={auditData[year]}
                year={year}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
