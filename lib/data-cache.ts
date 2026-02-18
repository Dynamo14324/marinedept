/**
 * Data cache management for parsed Excel files
 * Stores parsed data in /data/parsed/ directory for secure access
 * Provides API for reading and updating cached data
 */

import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { AuditYearData } from '@/types/audit-data';

const DATA_CACHE_DIR = join(process.cwd(), 'data', 'parsed');

/**
 * Ensures the data cache directory exists
 */
export async function ensureCacheDir() {
  try {
    await mkdir(DATA_CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create data cache directory:', error);
    throw error;
  }
}

/**
 * Get the cache file path for a specific year
 */
export function getCacheFilePath(year: number): string {
  return join(DATA_CACHE_DIR, `parsed-data-${year}.json`);
}

/**
 * Save parsed audit data to cache
 */
export async function saveParsedData(data: AuditYearData): Promise<void> {
  try {
    await ensureCacheDir();
    const filePath = getCacheFilePath(data.year);
    const json = JSON.stringify(data, null, 2);
    await writeFile(filePath, json, 'utf-8');
    console.log(`[v0] Saved parsed data for year ${data.year}`);
  } catch (error) {
    console.error(`Failed to save parsed data for year ${data.year}:`, error);
    throw error;
  }
}

/**
 * Load parsed audit data from cache
 */
export async function loadParsedData(year: number): Promise<AuditYearData | null> {
  try {
    const filePath = getCacheFilePath(year);
    const json = await readFile(filePath, 'utf-8');
    const data = JSON.parse(json) as AuditYearData;
    console.log(`[v0] Loaded parsed data for year ${year}`);
    return data;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log(`No cached data for year ${year}`);
      return null;
    }
    console.error(`Failed to load parsed data for year ${year}:`, error);
    throw error;
  }
}

/**
 * Get list of available cached years
 */
export async function getAvailableYears(): Promise<number[]> {
  try {
    await ensureCacheDir();
    const { readdirSync } = require('fs');
    const files = readdirSync(DATA_CACHE_DIR);
    const years = files
      .filter((f: string) => f.match(/^parsed-data-\d+\.json$/))
      .map((f: string) => {
        const match = f.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
      })
      .filter((year: number | null): year is number => year !== null)
      .sort((a: number, b: number) => a - b);
    
    console.log(`[v0] Available cached years: ${years.join(', ')}`);
    return years;
  } catch (error) {
    console.error('Failed to get available years:', error);
    return [];
  }
}

/**
 * Delete cached data for a specific year
 */
export async function deleteParsedData(year: number): Promise<void> {
  try {
    const { unlinkSync } = require('fs');
    const filePath = getCacheFilePath(year);
    unlinkSync(filePath);
    console.log(`[v0] Deleted cached data for year ${year}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log(`No cached data to delete for year ${year}`);
      return;
    }
    console.error(`Failed to delete cached data for year ${year}:`, error);
    throw error;
  }
}

/**
 * Validate cached data integrity
 */
export async function validateCachedData(data: AuditYearData): Promise<boolean> {
  const requiredFields: (keyof AuditYearData)[] = [
    'year',
    'fileName',
    'uploadDate',
    'dryData',
    'tankerData',
    'inspectorPerformance',
    'auditCategories',
    'quarterlyData',
    'safetyInspection',
  ];

  for (const field of requiredFields) {
    if (!(field in data)) {
      console.error(`[v0] Missing required field in cached data: ${String(field)}`);
      return false;
    }
  }

  if (!Array.isArray(data.dryData)) {
    console.error('[v0] dryData is not an array');
    return false;
  }

  if (!Array.isArray(data.tankerData)) {
    console.error('[v0] tankerData is not an array');
    return false;
  }

  console.log(`[v0] Validated cached data for year ${data.year}`);
  return true;
}

/**
 * Export all cached data as a single JSON file (for backup/analysis)
 */
export async function exportAllCachedData(): Promise<Record<number, AuditYearData>> {
  try {
    const years = await getAvailableYears();
    const allData: Record<number, AuditYearData> = {};

    for (const year of years) {
      const data = await loadParsedData(year);
      if (data) {
        allData[year] = data;
      }
    }

    console.log(`[v0] Exported data for ${Object.keys(allData).length} years`);
    return allData;
  } catch (error) {
    console.error('Failed to export all cached data:', error);
    throw error;
  }
}

/**
 * Aliases for server action imports
 */
export const saveCachedData = saveParsedData;
export const getCachedData = loadParsedData;
export const getAvailableDataYears = getAvailableYears;
