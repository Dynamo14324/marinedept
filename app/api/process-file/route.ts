import { NextRequest, NextResponse } from 'next/server'
import { parseExcelFile, calculateMetrics } from '@/lib/excel-parser'
import { parseCSVFile, normalizeCSVData } from '@/lib/csv-parser'
import { parsePDFFile, extractKeyMetrics } from '@/lib/pdf-parser'
import { validateFinancialData, getColumnStats } from '@/lib/data-validator'
import { env } from '@/lib/env'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }


    if (file.size === 0) {
      return NextResponse.json(
        { error: 'Uploaded file is empty' },
        { status: 400 }
      )
    }

    const maxUploadBytes = env.maxUploadMb * 1024 * 1024
    if (file.size > maxUploadBytes) {
      return NextResponse.json(
        { error: `File exceeds ${env.maxUploadMb}MB limit` },
        { status: 413 }
      )
    }

    const extension = file.name.split('.').pop()?.toLowerCase()
    let data: Record<string, unknown>[] = []
    let metadata: Record<string, unknown> = { fileName: file.name }

    if (extension === 'xlsx' || extension === 'xls') {
      const parsed = await parseExcelFile(file)
      const firstSheet = Object.values(parsed.sheets)[0] || []
      data = firstSheet
      metadata = { ...metadata, ...parsed.metadata }
    } else if (extension === 'csv') {
      const parsed = await parseCSVFile(file)
      data = normalizeCSVData(parsed.data)
      metadata = { ...metadata, ...parsed.metadata }
    } else if (extension === 'pdf') {
      const parsed = await parsePDFFile(file)
      const keyMetrics = extractKeyMetrics(parsed.text)
      return NextResponse.json({
        success: true,
        type: 'pdf',
        data: [{ content: parsed.text.slice(0, 1000), ...keyMetrics }],
        metadata: parsed.metadata,
      })
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Allowed: .xlsx, .xls, .csv, .pdf' },
        { status: 400 }
      )
    }

    // Validate data
    const validation = validateFinancialData(data)

    // Calculate metrics
    const metrics = calculateMetrics(data)

    // Get column statistics
    const columnStats: Record<string, unknown> = {}
    if (data.length > 0) {
      const columns = Object.keys(data[0] as Record<string, unknown>)
      columns.forEach(col => {
        columnStats[col] = getColumnStats(data, col)
      })
    }

    return NextResponse.json({
      success: true,
      data,
      metadata,
      metrics,
      columnStats,
      validation,
    })
  } catch (error) {
    console.error('File processing error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Error processing file',
      },
      { status: 500 }
    )
  }
}
