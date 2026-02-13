export interface ParsedCSVData {
  data: Record<string, unknown>[]
  metadata: {
    fileName: string
    rowCount: number
    columnCount: number
    columns: string[]
  }
}

export async function parseCSVFile(file: File): Promise<ParsedCSVData> {
  const text = await file.text()
  const lines = text.trim().split('\n')
  
  if (lines.length === 0) {
    return {
      data: [],
      metadata: {
        fileName: file.name,
        rowCount: 0,
        columnCount: 0,
        columns: [],
      },
    }
  }

  // Parse header
  const headers = parseCSVLine(lines[0])
  const rows: Record<string, unknown>[] = []

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue
    
    const values = parseCSVLine(lines[i])
    const row: Record<string, unknown> = {}
    
    headers.forEach((header, index) => {
      row[header || `Column ${index}`] = values[index] || ''
    })
    
    rows.push(row)
  }

  return {
    data: rows,
    metadata: {
      fileName: file.name,
      rowCount: rows.length,
      columnCount: headers.length,
      columns: headers,
    },
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let insideQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"'
        i++
      } else {
        insideQuotes = !insideQuotes
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

export function normalizeCSVData(
  data: Record<string, unknown>[]
): Record<string, unknown>[] {
  return data.map(row => {
    const normalized: Record<string, unknown> = {}
    
    Object.entries(row).forEach(([key, value]) => {
      // Attempt to parse numbers
      if (typeof value === 'string') {
        const trimmed = value.trim()
        
        // Try to parse as number
        if (!isNaN(Number(trimmed)) && trimmed !== '') {
          normalized[key] = Number(trimmed)
        } else if (trimmed.toLowerCase() === 'true') {
          normalized[key] = true
        } else if (trimmed.toLowerCase() === 'false') {
          normalized[key] = false
        } else {
          normalized[key] = trimmed
        }
      } else {
        normalized[key] = value
      }
    })
    
    return normalized
  })
}
