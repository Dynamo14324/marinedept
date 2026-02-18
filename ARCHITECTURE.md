# Marine Dashboard - System Architecture

## Overview

The Marine Department Audit Dashboard uses a modern Next.js 15 full-stack architecture with TypeScript, Server Actions, and a structured component system.

## Data Flow Architecture

```
Excel File Upload
      ↓
[POST] /admin/upload
      ↓
Server Action: uploadExcelFile()
      ↓
XLSX Parser (excel-parser.ts)
      ↓
Data Transformation → AuditYearData Type
      ↓
Validation & Persistence
      ↓
File System Cache (/data/parsed/{year}.json)
      ↓
Dashboard Retrieval
      ↓
Chart Rendering (Chart.js)
      ↓
User Display & Export
```

## Component Architecture

### Layer 1: Pages (User-Facing Routes)
- `/audits` - Audit dashboard view with year filtering
- `/admin/upload` - Excel upload interface
- `/` - Main financial dashboard (existing)

### Layer 2: Containers (Smart Components)
- `AuditsPage` - Handles year selection, data loading, comparison mode
- `AdminUploadPage` - Handles upload form and password validation

### Layer 3: Components (Presentational & Logic)
- `AuditDashboard` - Renders all charts and metrics for a year
- `AuditChart` - Individual chart rendering with export button
- `ExcelUploadForm` - Form handling and submission

### Layer 4: UI Components
- Button, Input, Tabs - Basic reusable UI elements
- All styled with Tailwind CSS

## Data Management System

### Caching Strategy
```
Request Data for Year
      ↓
Check /data/parsed/parsed-data-{year}.json
      ↓
Found? → Return cached data
      ↓
Not Found? → Load from database (future)
```

### Data Structure (AuditYearData)
```typescript
{
  year: 2024,
  fileName: "2024-Audits.xlsx",
  uploadDate: "2024-02-18T...",
  dryData: VesselRecord[],        // Fleet 1
  tankerData: VesselRecord[],      // Fleet 2
  auditComparison: Record[],
  safetyInspection: Record[],
  // ... metadata
}
```

## Type System

### Core Types (`/types/audit-data.ts`)
- `VesselRecord` - Individual vessel audit record
- `AuditYearData` - Entire year's audit data
- `ChartConfig` - Chart.js configuration
- `CHART_COLORS` - Standard color palette

### Parser Types
- `ParsedExcelData` - Raw parsed Excel output
- `ValidationResult` - Data validation results

## Server Action Flow

### uploadExcelFile() Server Action
```
1. Verify password
2. Extract file from FormData
3. Validate file type (.xlsx/.xls)
4. Parse Excel using parseExcelFile()
5. Transform to AuditYearData using transformToAuditData()
6. Validate transformed data
7. Save to /data/parsed/
8. Backup raw file to /data/uploads/
9. Return success/error response
```

### getAvailableYears() Server Action
```
1. Read /data/parsed/ directory
2. Extract year from filenames
3. Return sorted array of years
```

### loadAuditDataForYear(year) Server Action
```
1. Read /data/parsed/parsed-data-{year}.json
2. Parse JSON to AuditYearData
3. Return typed data
4. Handle errors gracefully
```

## Excel Parser Pipeline

### parseExcelFile(file)
```
1. Read file as ArrayBuffer
2. Parse with XLSX.read()
3. Iterate all sheets
4. Extract headers and rows
5. Build Record<string, unknown>[]
6. Return ParsedExcelData with metadata
```

### transformToAuditData(parsed)
```
1. Extract year from filename
2. Transform Dry Data sheet → VesselRecord[]
3. Transform Tanker Data sheet → VesselRecord[]
4. Transform audit categories → Record[]
5. Transform safety data → Record[]
6. Combine into AuditYearData
7. Return complete typed object
```

## Chart Rendering System

### Chart.js Configuration
- Factory functions: `createGroupedColumnChartConfig()`, etc.
- Consistent color palette via `getSeriesColor()`
- Responsive with maintained aspect ratio
- Grid, legend, and data labels configurable

### Export Function
```typescript
exportChartAsImage(chartRef, filename)
  ↓
chart.toBase64Image()  // Chart.js method
  ↓
Create blob from Base64
  ↓
Trigger download via virtual link
```

## Authentication & Security

### Password Protection
- Environment variable: `UPLOAD_PASSWORD`
- Checked on server-side in uploadExcelFile()
- No passwords stored in code
- Client sends via POST body

### File Validation
- Extension whitelist: `.xlsx`, `.xls`
- Type checking on server
- Size limits enforced
- Content validation post-parsing

## Performance Optimizations

### Data Caching
- File system cache prevents re-parsing
- Metadata with upload timestamp
- getAvailableYears() caches directory reads

### Component Optimization
- Client-side state management with useState/useCallback
- Memoization for expensive computations
- Chart cleanup to prevent memory leaks

### Next.js Optimizations
- Dynamic imports for heavy libraries
- ISR (Incremental Static Regeneration) capable
- Automatic code splitting

## Directory Structure & Purpose

```
/app                    → Pages and layouts
├── admin/              → Admin-only pages
├── audits/             → Public audit dashboard
├── actions/            → Server Actions
├── layout.tsx          → Root layout
└── page.tsx            → Main dashboard

/components             → Reusable React components
├── audit-*.tsx         → Audit-specific components
├── [others]            → General components
└── ui/                 → Basic UI primitives

/lib                    → Utility functions & logic
├── *-parser.ts         → File parsing functions
├── *-utils.ts          → Helper utilities
├── data-cache.ts       → Persistence logic
└── chart-utils.ts      → Chart configuration

/types                  → TypeScript interfaces
└── audit-data.ts       → Audit domain types

/data                   → Persisted data
├── parsed/             → Cached parsed JSON
└── uploads/            → Backup Excel files

/public                 → Static assets

/scripts                → Build/maintenance scripts
```

## Error Handling Strategy

### Excel Upload Errors
```
- Invalid password → "Invalid password" message
- Wrong file type → "Only .xlsx/.xls supported"
- Parse failure → "Failed to parse file"
- Transform failure → "Data transformation failed"
- Save failure → "Failed to save data"
```

### Data Loading Errors
```
- Year not found → Show empty state
- Parse error → Show error message
- Cache miss → Graceful fallback
```

### Component Errors
```
- Missing data → Render placeholder
- Chart error → Display error notification
- Export error → User-friendly message
```

## Extension Points

### Adding a New Chart Type
1. Create `createMyChartConfig()` in `/lib/chart-utils.ts`
2. Add data mapping in `AuditDashboard` component
3. Render with `<AuditChart>`

### Adding a New Data Type
1. Define interface in `/types/audit-data.ts`
2. Update parser transform in `/lib/excel-parser.ts`
3. Add to `AuditYearData` interface
4. Use in components as needed

### Adding Excel Sheets
1. Add sheet mapping in `transformToAuditData()`
2. Define data structure
3. Update dashboard to display
4. Add validation rules

## Dependencies

### Core
- `next`: Framework
- `react`: UI library
- `typescript`: Type safety

### Charting
- `chart.js`: Chart rendering
- `chartjs-plugin-datalabels`: Data labels on charts

### Data Processing
- `xlsx`: Excel parsing
- `pdfjs-dist`: PDF text extraction
- `papaparse`: CSV parsing

### Styling
- `tailwindcss`: CSS framework
- `clsx`/`class-variance-authority`: Class utilities

### UI Framework
- `@radix-ui/react-tabs`: Tab component
- `lucide-react`: Icons

### Export/Download
- `exceljs`: Excel export
- `jspdf`: PDF generation
- `jspdf-autotable`: PDF tables

## Deployment Configuration

### Vercel Settings
- Auto-deploy on push to main
- Environment variables via Vercel dashboard
- Build command: `next build`
- Start command: `next start`
- Output directory: `.next`

### GitHub Integration
- Auto-deploy on push
- Pull request previews available
- Protected main branch recommended

## Future Enhancements

### Possible Features
- Database persistence instead of file system
- User authentication system
- Role-based access control
- Real-time data sync
- Analytics and reporting
- Scheduled data imports
- Data archival system
- Multi-organization support

### Scalability Considerations
- File system cache → Database (PostgreSQL/MongoDB)
- Server Actions → API routes for 3rd party integrations
- Client-side charts → Server-side rendering for large datasets
- Caching strategy → Redis for distributed systems

---

This architecture is designed for clarity, maintainability, and scalability while keeping the system simple and focused on audit data visualization.
