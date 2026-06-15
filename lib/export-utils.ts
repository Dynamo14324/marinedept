import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ExportOptions {
  fileName?: string
  sheetName?: string
  includeHeader?: boolean
}

export async function exportToExcel(
  data: Record<string, unknown>[],
  options: ExportOptions = {}
) {
  const { fileName = 'export.xlsx', sheetName = 'Data' } = options

  // Dynamic import for ExcelJS to avoid SSR issues
  const { Workbook } = await import('exceljs')
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  if (data.length === 0) {
    worksheet.addRow(['No data available'])
    await workbook.xlsx.writeFile(fileName)
    return
  }

  // Get headers
  const headers = Object.keys(data[0] as Record<string, unknown>)
  worksheet.addRow(headers)

  // Style header row
  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0B4B6D' }, // Ocean blue
  }
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' }

  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => (row as Record<string, unknown>)[header] || '')
    worksheet.addRow(values)
  })

  // Auto-size columns
  worksheet.columns.forEach(column => {
    let maxLength = 0
    if (typeof column.eachCell === 'function') {
      column.eachCell({ includeEmpty: true }, cell => {
        const cellLength = String(cell.value).length
        if (cellLength > maxLength) {
          maxLength = cellLength
        }
      })
    }
    column.width = Math.min(maxLength + 2, 50)
  })

  // Write file
  await workbook.xlsx.writeFile(fileName)
}

export function exportToCSV(
  data: Record<string, unknown>[],
  options: ExportOptions = {}
): string {
  const { fileName = 'export.csv' } = options

  if (data.length === 0) {
    return ''
  }

  const headers = Object.keys(data[0] as Record<string, unknown>)
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const value = (row as Record<string, unknown>)[header]
          const stringValue = String(value || '')
          return stringValue.includes(',')
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue
        })
        .join(',')
    ),
  ].join('\n')

  // Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  return csvContent
}

export async function exportToPDF(
  data: Record<string, unknown>[],
  options: ExportOptions = {}
) {
  const { fileName = 'export.pdf' } = options

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  if (data.length === 0) {
    pdf.text('No data available', 10, 10)
    pdf.save(fileName)
    return
  }

  const headers = Object.keys(data[0] as Record<string, unknown>)
  const tableData = data.map(row =>
    headers.map(header => {
      const value = (row as Record<string, unknown>)[header]
      const str = String(value || '')
      return str.length > 50 ? str.slice(0, 50) + '...' : str
    })
  )

  // Use autotable plugin
  autoTable(pdf, {
    head: [headers],
    body: tableData,
    headStyles: {
      fillColor: [11, 75, 109], // Ocean blue
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      textColor: [200, 200, 200],
    },
    alternateRowStyles: {
      fillColor: [30, 40, 50],
    },
    margin: 10,
    didDrawPage: () => {
      const pageHeight = pdf.internal.pageSize.getHeight()
      const pageCount = pdf.getNumberOfPages()
      pdf.setFontSize(8)
      pdf.text(
        `Page ${pageCount}`,
        pdf.internal.pageSize.getWidth() / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    },
  })

  pdf.save(fileName)
}

export function generateSummaryReport(data: Record<string, unknown>[]): string {
  const timestamp = new Date().toISOString()
  const recordCount = data.length
  const columns = data.length > 0 ? Object.keys(data[0] as Record<string, unknown>) : []

  const report = `Data Export Report
====================
Generated: ${timestamp}
Records: ${recordCount}
Columns: ${columns.length}

Column List:
${columns.map((col, i) => `${i + 1}. ${col}`).join('\n')}

Data Summary:
${columns
  .slice(0, 5)
  .map(col => {
    const values = data
      .map(row => (row as Record<string, unknown>)[col])
      .filter(v => v !== null && v !== undefined)
    const numValues = values
      .map(v => Number(v))
      .filter(n => !isNaN(n))

    if (numValues.length > 0) {
      const sum = numValues.reduce((a, b) => a + b, 0)
      const avg = sum / numValues.length
      return `${col}: Sum=${sum.toFixed(2)}, Avg=${avg.toFixed(2)}, Count=${numValues.length}`
    }
    return `${col}: ${values.length} non-null values`
  })
  .join('\n')}
`

  return report
}
