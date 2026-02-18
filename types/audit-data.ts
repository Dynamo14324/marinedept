/**
 * Central type definitions for Marine Department audit data
 * Ensures type safety across all data ingestion, transformation, and visualization
 */

export interface VesselRecord {
  vesselName: string;
  vesselType: 'Dry' | 'Tanker';
  flag: string;
  company: string;
  auditDate: string;
  inspector: string;
  ncCount: number;
  ncRate: number;
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Pending';
  [key: string]: unknown;
}

export interface InspectorMetric {
  inspectorName: string;
  totalAudits: number;
  completedAudits: number;
  completionRate: number;
  averageNcCount: number;
  performanceRating: number;
  [key: string]: unknown;
}

export interface AuditCategory {
  categoryName: string;
  ncCount: number;
  ncRate: number;
  totalAudits: number;
  vessels: VesselRecord[];
  [key: string]: unknown;
}

export interface AuditComparisonMetric {
  metric: string;
  year2022: number;
  year2023: number;
  year2024: number;
  year2025?: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  [key: string]: unknown;
}

export interface QuarterlyData {
  quarter: string;
  year: number;
  vesselCount: number;
  auditCount: number;
  ncCount: number;
  averageNcPerAudit: number;
  [key: string]: unknown;
}

export interface SafetyMetric {
  categoryName: string;
  compliancePercentage: number;
  ncCount: number;
  lastUpdated: string;
  trend: number;
  [key: string]: unknown;
}

export interface AuditYearData {
  year: number;
  fileName: string;
  uploadDate: string;
  
  // Main data collections
  dryData: VesselRecord[];
  tankerData: VesselRecord[];
  
  // Audit and inspection data
  inspectorPerformance: InspectorMetric[];
  auditCategories: Record<string, AuditCategory>;
  auditComparison: AuditComparisonMetric[];
  quarterlyData: QuarterlyData[];
  safetyInspection: SafetyMetric[];
  
  // Metadata
  totalVessels: number;
  totalAudits: number;
  totalNC: number;
  averageNCRate: number;
  compliancePercentage: number;
}

export interface ParsedExcelSheets {
  sheets: Record<string, Record<string, unknown>[]>;
  metadata: {
    fileName: string;
    sheetNames: string[];
    rowCounts: Record<string, number>;
  };
}

export interface DashboardState {
  selectedYear: number;
  comparisonMode: boolean;
  selectedYears: number[];
  loading: boolean;
  error: string | null;
  data: Record<number, AuditYearData>;
}

export interface ChartConfig {
  title: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'mixed';
  colors: string[];
  showLegend: boolean;
  showDataLabels: boolean;
  showGrid: boolean;
  responsive: boolean;
  maintainAspectRatio: boolean;
}

// Color palette constants matching specifications
export const CHART_COLORS = {
  primary: '#0078D4',
  darkBlue: '#003D82',
  darkBlueAlt: '#004B87',
  cyan: '#00B4D8',
  orange: '#FF9500',
  grey: '#A8A8A8',
  lightGrey: '#E0E0E0',
  red: '#FF0000',
  headerBg: '#1F4E78',
  textDark: '#333333',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const DEFAULT_CHART_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.darkBlueAlt,
  CHART_COLORS.cyan,
  CHART_COLORS.orange,
  CHART_COLORS.grey,
  CHART_COLORS.red,
] as const;
