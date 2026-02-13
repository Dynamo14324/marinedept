import * as XLSX from 'xlsx'

export interface ParsedExcelData {
  sheets: Record<string, Record<string, unknown>[]>
  metadata: {
    fileName: string
    sheetNames: string[]
    rowCounts: Record<string, number>
  }
}

export async function parseExcelFile(file: File): Promise<ParsedExcelData> {
  const arrayBuffer = await file.arrayBuffer()
  const workbook = XLSX.read(arrayBuffer, { cellFormulas: false })
  
  const sheets: Record<string, Record<string, unknown>[]> = {}
  const rowCounts: Record<string, number> = {}

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
    }) as unknown[][]

    // Convert to array of objects with proper handling
    const headers = data[0] as string[]
    const rows = data.slice(1).map(row => {
      const obj: Record<string, unknown> = {}
      headers.forEach((header, index) => {
        obj[header || `Column ${index}`] = row[index] || ''
      })
      return obj
    })

    sheets[sheetName] = rows
    rowCounts[sheetName] = rows.length
  }

  return {
    sheets,
    metadata: {
      fileName: file.name,
      sheetNames: workbook.SheetNames,
      rowCounts,
    },
  }
}

export function extractFinancialData(sheetData: Record<string, unknown>[]) {
  // Extract common financial metrics from parsed sheet
  const financials: Record<string, unknown> = {}
  
  sheetData.forEach(row => {
    const rowObj = row as Record<string, unknown>
    const keys = Object.keys(rowObj)
    
    // Look for common financial patterns
    keys.forEach(key => {
      const lowerKey = key.toLowerCase()
      if (lowerKey.includes('total') || lowerKey.includes('revenue') || 
          lowerKey.includes('expense') || lowerKey.includes('budget')) {
        financials[key] = rowObj[key]
      }
    })
  })
  
  return financials
}

export function calculateMetrics(data: Record<string, unknown>[]) {
  const metrics: Record<string, number> = {}
  
  // Auto-detect numeric columns and calculate sums
  if (data.length > 0) {
    const firstRow = data[0] as Record<string, unknown>
    
    Object.keys(firstRow).forEach(key => {
      const values = data
        .map(row => {
          const val = (row as Record<string, unknown>)[key]
          return typeof val === 'number' ? val : parseFloat(String(val))
        })
        .filter(v => !isNaN(v))
      
      if (values.length > 0) {
        metrics[`${key}_sum`] = values.reduce((a, b) => a + b, 0)
        metrics[`${key}_avg`] = metrics[`${key}_sum`] / values.length
        metrics[`${key}_max`] = Math.max(...values)
        metrics[`${key}_min`] = Math.min(...values)
      }
    })
  }
  
  return metrics
}
