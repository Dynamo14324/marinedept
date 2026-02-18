'use server'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { parseExcelFile, transformToAuditData } from '@/lib/excel-parser'
import { AuditYearData } from '@/types/audit-data'
import { saveCachedData } from '@/lib/data-cache'

/**
 * Server Action to handle Excel file upload
 * Requires password verification for security
 */
export async function uploadExcelFile(
  formData: FormData,
  password: string
): Promise<{
  success: boolean
  message: string
  year?: number
  error?: string
}> {
  try {
    // Verify password
    const correctPassword = process.env.UPLOAD_PASSWORD
    if (!correctPassword || password !== correctPassword) {
      return {
        success: false,
        message: 'Invalid password',
        error: 'Authentication failed',
      }
    }

    // Get file from FormData
    const file = formData.get('file') as File | null
    if (!file) {
      return {
        success: false,
        message: 'No file provided',
        error: 'File is required',
      }
    }

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return {
        success: false,
        message: 'Invalid file type. Only .xlsx and .xls files are supported.',
        error: 'Invalid file type',
      }
    }

    // Parse Excel file
    const parsed = await parseExcelFile(file)
    const auditData = transformToAuditData(parsed)

    if (!auditData) {
      return {
        success: false,
        message: 'Failed to transform Excel data. Check file format.',
        error: 'Data transformation failed',
      }
    }

    // Save to data cache
    await saveCachedData(auditData)

    // Also save raw file to /data/uploads for backup
    const uploadsDir = join(process.cwd(), 'data', 'uploads')
    await mkdir(uploadsDir, { recursive: true })
    
    const fileBytes = await file.arrayBuffer()
    const uploadPath = join(uploadsDir, `${auditData.year}-${file.name}`)
    await writeFile(uploadPath, Buffer.from(fileBytes))

    console.log(`[v0] File uploaded successfully: ${uploadPath}`)

    return {
      success: true,
      message: `Excel file for year ${auditData.year} uploaded and processed successfully`,
      year: auditData.year,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[v0] Upload error:', errorMessage)
    
    return {
      success: false,
      message: 'Failed to upload file',
      error: errorMessage,
    }
  }
}

/**
 * Get available data years (from cached data)
 */
export async function getAvailableYears(): Promise<number[]> {
  try {
    const { getAvailableDataYears } = await import('@/lib/data-cache')
    return getAvailableDataYears()
  } catch (error) {
    console.error('[v0] Error getting available years:', error)
    return []
  }
}

/**
 * Load audit data for a specific year
 */
export async function loadAuditDataForYear(year: number): Promise<AuditYearData | null> {
  try {
    const { getCachedData } = await import('@/lib/data-cache')
    return getCachedData(year)
  } catch (error) {
    console.error(`[v0] Error loading data for year ${year}:`, error)
    return null
  }
}
