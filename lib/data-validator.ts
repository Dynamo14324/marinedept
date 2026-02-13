export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  statistics: {
    totalRecords: number
    emptyFields: number
    invalidNumbers: number
    completeness: number
  }
}

export function validateFinancialData(
  data: Record<string, unknown>[]
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  let emptyFields = 0
  let invalidNumbers = 0

  // Basic checks
  if (!Array.isArray(data) || data.length === 0) {
    errors.push('No data provided or invalid format')
    return {
      isValid: false,
      errors,
      warnings,
      statistics: {
        totalRecords: 0,
        emptyFields: 0,
        invalidNumbers: 0,
        completeness: 0,
      },
    }
  }

  const recordCount = data.length
  const firstRecord = data[0] as Record<string, unknown>
  const columns = Object.keys(firstRecord)

  // Validate each row
  let validRows = 0
  data.forEach((row, index) => {
    const record = row as Record<string, unknown>
    let rowValid = true

    columns.forEach(col => {
      const value = record[col]

      // Check for empty fields
      if (value === null || value === undefined || value === '') {
        emptyFields++
      }

      // Validate numeric columns
      if (col.toLowerCase().includes('total') || 
          col.toLowerCase().includes('amount') ||
          col.toLowerCase().includes('price') ||
          col.toLowerCase().includes('cost')) {
        const num = Number(value)
        if (isNaN(num) && value !== '' && value !== null) {
          invalidNumbers++
          rowValid = false
        }
        if (num < 0) {
          warnings.push(`Row ${index}: Negative value in ${col}`)
        }
      }
    })

    if (rowValid) validRows++
  })

  const completeness = (validRows / recordCount) * 100

  if (completeness < 80) {
    warnings.push(`Data completeness is low: ${completeness.toFixed(1)}%`)
  }

  if (invalidNumbers > 0) {
    warnings.push(`Found ${invalidNumbers} invalid numeric values`)
  }

  return {
    isValid: errors.length === 0 && validRows === recordCount,
    errors,
    warnings,
    statistics: {
      totalRecords: recordCount,
      emptyFields,
      invalidNumbers,
      completeness: Math.round(completeness),
    },
  }
}

export function detectDataType(value: unknown): string {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'date'
    if (/^\d+$/.test(value)) return 'integer'
    if (/^\d+\.\d+$/.test(value)) return 'decimal'
    return 'text'
  }
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return 'unknown'
}

export function getColumnStats(
  data: Record<string, unknown>[],
  columnName: string
) {
  const values = data
    .map(row => (row as Record<string, unknown>)[columnName])
    .filter(v => v !== null && v !== undefined && v !== '')

  if (values.length === 0) {
    return {
      type: 'empty',
      count: 0,
      unique: 0,
      nullCount: data.length,
    }
  }

  const numValues = values
    .map(v => Number(v))
    .filter(n => !isNaN(n))

  const stats: Record<string, unknown> = {
    type: detectDataType(values[0]),
    count: values.length,
    unique: new Set(values).size,
    nullCount: data.length - values.length,
  }

  if (numValues.length > 0) {
    stats.sum = numValues.reduce((a, b) => a + b, 0)
    stats.avg = stats.sum / numValues.length
    stats.min = Math.min(...numValues)
    stats.max = Math.max(...numValues)
  }

  return stats
}

export function sanitizeDataForDisplay(data: Record<string, unknown>[]) {
  return data.map(row => {
    const sanitized: Record<string, unknown> = {}
    
    Object.entries(row).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        sanitized[key] = '-'
      } else if (typeof value === 'number') {
        sanitized[key] = value.toLocaleString('en-US', {
          maximumFractionDigits: 2,
        })
      } else {
        sanitized[key] = String(value).slice(0, 500)
      }
    })
    
    return sanitized
  })
}
