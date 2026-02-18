import * as XLSX from 'xlsx'
import { AuditYearData, VesselRecord, AuditRecord, DeficiencyRecord } from '@/types/audit-data'

export interface ParsedExcelData {
  sheets: Record<string, Record<string, unknown>[]>
  metadata: {
    fileName: string
    sheetNames: string[]
    rowCounts: Record<string, number>
    year?: number
  }
}

/**
 * Parse an Excel file and return structured data
 */
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

  // Extract year from filename (e.g., "2024-IAnSISCHEDULE n Performances.xlsx" -> 2024)
  const yearMatch = file.name.match(/(\d{4})/)
  const year = yearMatch ? parseInt(yearMatch[1]) : undefined

  return {
    sheets,
    metadata: {
      fileName: file.name,
      sheetNames: workbook.SheetNames,
      rowCounts,
      year,
    },
  }
}

/**
 * Transform parsed Excel sheets into structured AuditYearData
 */
export function transformToAuditData(parsed: ParsedExcelData): AuditYearData | null {
  const { sheets, metadata } = parsed
  const year = metadata.year

  if (!year) {
    console.warn('[v0] Unable to extract year from filename:', metadata.fileName)
    return null
  }

  const dryData = transformVesselData(sheets['Dry Data'] || [], 'Dry')
  const tankerData = transformVesselData(sheets['Tanker Data'] || [], 'Tanker')
  const auditComparison = transformAuditComparison(sheets['Int. Audit Category'] || [])
  const safetyInspection = transformSafetyInspection(sheets['Saf. Insp. category'] || [])

  return {
    year,
    dryData,
    tankerData,
    auditComparison,
    safetyInspection,
  }
}

/**
 * Transform raw vessel data into standardized VesselRecord format
 */
function transformVesselData(rows: Record<string, unknown>[], fleetType: 'Dry' | 'Tanker'): VesselRecord[] {
  return rows
    .filter(row => row && typeof row === 'object' && Object.keys(row).length > 0)
    .map(row => {
      const obj = row as Record<string, unknown>
      return {
        vesselName: (obj['Vessel'] || obj['Vessel Name'] || '') as string,
        fleetType,
        auditDate: (obj['Audit Date'] || obj['Date'] || '') as string,
        auditor: (obj['Auditor'] || obj['Audited By'] || '') as string,
        nonConformities: parseNumber(obj['NC'] || obj['Non-Conformities'] || 0),
        observations: parseNumber(obj['Observations'] || obj['Obs'] || 0),
        auditType: (obj['Audit Type'] || obj['Type'] || '') as string,
        findings: (obj['Findings'] || '') as string,
      }
    })
}

/**
 * Transform audit category data
 */
function transformAuditComparison(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.filter(row => row && typeof row === 'object' && Object.keys(row).length > 0)
}

/**
 * Transform safety inspection data
 */
function transformSafetyInspection(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.filter(row => row && typeof row === 'object' && Object.keys(row).length > 0)
}

/**
 * Safe number parsing
 */
function parseNumber(value: unknown): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
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
