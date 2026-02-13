export interface ParsedPDFData {
  text: string
  metadata: {
    fileName: string
    pageCount: number
    extractedAt: string
  }
  tables: string[][] // Simple table extraction
}

export async function parsePDFFile(file: File): Promise<ParsedPDFData> {
  const arrayBuffer = await file.arrayBuffer()
  
  // Dynamic import for pdfjs-dist
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.default.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.default.version}/pdf.worker.min.js`
  
  const pdf = await pdfjsLib.default.getDocument({ data: arrayBuffer }).promise
  let text = ''
  const tables: string[][] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    
    // Extract text
    const pageText = textContent.items
      .map(item => {
        if ('str' in item) {
          return item.str
        }
        return ''
      })
      .join(' ')
    
    text += pageText + '\n'

    // Try to extract table-like structures (simple heuristic)
    const lines = pageText.split('\n').filter(l => l.trim())
    if (lines.length > 0 && lines.some(l => /\d+/.test(l))) {
      tables.push(lines)
    }
  }

  return {
    text: text.trim(),
    metadata: {
      fileName: file.name,
      pageCount: pdf.numPages,
      extractedAt: new Date().toISOString(),
    },
    tables,
  }
}

export function extractTablesFromText(text: string): string[][] {
  // Attempt to identify table-like structures in text
  const lines = text.split('\n')
  const tables: string[][] = []
  let currentTable: string[] = []
  let inTable = false

  for (const line of lines) {
    const trimmed = line.trim()
    
    // Heuristic: lines with multiple numbers/aligned columns might be tables
    if (trimmed && /(\d+\s+)+/.test(trimmed)) {
      if (!inTable) {
        inTable = true
        currentTable = []
      }
      currentTable.push(trimmed)
    } else if (inTable && trimmed === '') {
      if (currentTable.length > 0) {
        tables.push(currentTable)
        currentTable = []
        inTable = false
      }
    }
  }

  if (currentTable.length > 0) {
    tables.push(currentTable)
  }

  return tables
}

export function extractKeyMetrics(text: string): Record<string, string | number> {
  const metrics: Record<string, string | number> = {}
  
  // Look for common patterns like "Total: 123" or "Revenue: $45,000"
  const patterns = [
    /(?:Total|Sum)[\s:]*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /(?:Revenue|Income)[\s:]*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /(?:Expense|Cost)[\s:]*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /(?:Budget|Allocation)[\s:]*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
    /(?:Percentage|Rate)[\s:]*(\d+(?:\.\d{2})?)\s*%/gi,
  ]

  patterns.forEach((pattern, index) => {
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      const key = `metric_${index}_${Object.keys(metrics).length}`
      const value = match[1].replace(/,/g, '')
      metrics[key] = isNaN(Number(value)) ? value : Number(value)
    }
  })

  return metrics
}
