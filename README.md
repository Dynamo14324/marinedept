# IAnSI Executive Dashboard

## Intelligence and Analysis System Interface

A comprehensive Next.js 15 executive dashboard for the Marine Department featuring real-time financial analytics, compliance tracking, and document management.

### Features

#### Core Dashboards
- **Main Dashboard** (`/`): Real-time KPI cards, metrics display, and financial overview
- **Audit Dashboard** (`/audits`): Marine audit performance with year filtering and comparison modes
  - Fleet performance metrics (Dry vs Tanker)
  - Non-conformity trends and analysis
  - Quarterly breakdown charts
  - Multi-year data comparison
  - Chart export as PNG

#### Data Management
- **Admin Upload** (`/admin/upload`): Password-protected Excel file uploads
- **Data Processing**: Parse and validate Excel files with multi-sheet support
- **Financial Tables**: Interactive tables with sorting, filtering, and export
- **Analytics Center**: Advanced charting (Line, Area, Bar, Pie), compliance dashboards
- **Export Center**: Multi-format export (Excel, PDF, CSV), bulk operations

#### Compliance & Security
- **Compliance Tracking**: Audit indicators, trails, and recommendations
- **Security**: Password-protected admin functions, secure file uploads
- **Settings**: Organization configuration, data management, backup options

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI components
- **Charting**: 
  - Chart.js (audit dashboard, image export)
  - Recharts (financial analytics)
- **File Processing**: 
  - XLSX (Excel parsing, multi-sheet support)
  - CSV (Papa Parse)
  - PDF (PDF.js)
- **Export**: ExcelJS, jsPDF, jsPDF-AutoTable, Chart.js PNG export
- **UI Components**: Radix UI (Tabs), Lucide Icons
- **State Management**: React Hooks, Server Actions
- **Deployment**: Vercel with GitHub integration

### Getting Started

#### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

#### Installation

```bash
# Clone the repository
git clone <repository-url>
cd iansi-dashboard

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

#### Development

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Production Build

```bash
npm run build
npm start
# or
pnpm build
pnpm start
```

### Project Structure

```
/app
  /admin/upload         # Admin upload page (password-protected)
  /audits               # Audit dashboard with year filtering
  /api
    /process-file       # File upload and processing endpoint
  /analytics            # Analytics center page
  /documents            # Document management page
  /export               # Export center page
  /settings             # Settings configuration page
  /actions
    upload-excel.ts     # Server Actions for Excel upload
  page.tsx              # Main dashboard
  layout.tsx            # Root layout with navigation
  globals.css           # Global styles and design tokens

/components
  audit-dashboard.tsx   # Main audit dashboard component
  audit-chart.tsx       # Chart.js wrapper with export
  excel-upload-form.tsx # Excel upload form
  file-upload.tsx       # File upload component
  kpi-card.tsx          # Key performance indicator card
  data-table.tsx        # Basic data table
  financial-table.tsx   # Advanced financial table
  financial-chart.tsx   # Multi-type charts (Line, Area, Bar, Pie)
  navigation.tsx        # Sidebar navigation
  /ui
    tabs.tsx            # Radix UI Tabs component

/lib
  excel-parser.ts       # Excel file parsing with multi-sheet support
  chart-utils.ts        # Chart.js configurations and utilities
  data-cache.ts         # Data caching and retrieval
  csv-parser.ts         # CSV file parsing
  pdf-parser.ts         # PDF file parsing
  data-validator.ts     # Data validation
  export-utils.ts       # Export functions
  utils.ts              # Common utilities
  sample-data.ts        # Sample data generator

/types
  audit-data.ts         # Audit data TypeScript interfaces

/data
  /uploads              # Uploaded Excel files backup
  /parsed               # Parsed and cached data in JSON
```

### Key Features Explained

#### Data Parsing

The dashboard supports three file formats:

- **Excel (.xlsx, .xls)**: Full sheet parsing with multiple sheet support
- **CSV**: Robust parsing with quote handling and type detection
- **PDF**: Text extraction and table recognition

#### Financial Analytics

- **KPI Cards**: Display key metrics with trends and comparisons
- **Financial Tables**: Sort, filter, search, and export financial data
- **Charts**: Multiple chart types (Line, Area, Bar, Pie) with responsive design
- **Compliance Dashboard**: Track compliance indicators and audit trails

#### Export Options

- **Excel**: Formatted workbooks with styling
- **PDF**: Professional reports with tables and formatting
- **CSV**: Lightweight format for data import/export
- **Bulk Operations**: Select multiple rows and export simultaneously

#### Audit Dashboard

The audit dashboard displays comprehensive analysis of marine department audits:

**Features:**
- **Year Selection**: View data for specific years (2022, 2023, 2024, etc.)
- **Comparison Mode**: Side-by-side comparison of multiple years
- **Fleet Analytics**: Separate dashboards for Dry and Tanker fleets
- **Performance Metrics**: NC rates, audit counts, vessel counts
- **Quarterly Breakdown**: Detailed quarterly analysis for each year
- **Chart Export**: Download any chart as PNG for presentations

**Data Upload:**
1. Navigate to `/admin/upload`
2. Select your Excel file (must contain year in filename)
3. Enter admin password
4. System automatically parses and caches data
5. Dashboard updates instantly with new data

**Excel File Requirements:**
- Format: `.xlsx` or `.xls`
- Filename: Must contain year (e.g., `2024-IAnSISCHEDULE.xlsx`)
- Required sheets: "Dry Data", "Tanker Data", audit category sheets
- Required columns: Vessel, Date, Auditor, NC, Observations

#### Document Management

- Upload and organize financial documents
- Tag and categorize documents
- Track document metadata (date, size, uploader)
- Search and filter capabilities

### Configuration

#### Design Tokens

Color scheme uses a professional marine-themed dark mode:

```css
/* Primary Blue */
--color-primary: 210 90% 35%;

/* Accent Teal */
--color-accent: 178 65% 45%;

/* Secondary Steel Gray */
--color-secondary: 210 15% 25%;
```

Modify `app/globals.css` to customize the color scheme.

#### Data Retention

Set the data retention period in Settings. Data older than the specified days will be automatically archived.

### API Routes

#### POST /api/process-file

Processes uploaded files and returns parsed data with metrics.

**Request:**
```
FormData: { file: File }
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "metrics": {...},
  "columnStats": {...},
  "validation": {...}
}
```

### Performance Optimizations

- Server-side rendering with React Server Components
- Lazy loading of charts and tables
- Optimized re-renders with React hooks
- Tailwind CSS purging for minimal bundle size
- Image optimization with Next.js built-in tools

### Deployment

For detailed deployment instructions, see **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**.

**Quick Deploy to Vercel:**

```bash
# 1. Push to GitHub (already configured)
git push origin main

# 2. Vercel auto-deploys on push
# Visit your Vercel dashboard to monitor deployment

# 3. Set environment variables in Vercel dashboard
# - UPLOAD_PASSWORD: Your secure admin password
```

**Environment Variables:**
- `UPLOAD_PASSWORD`: Required for admin file uploads

### Security Features

- **Admin Access**: Password-protected file upload interface
- **Data Validation**: File type and format verification
- **Size Limits**: 50MB maximum file size
- **Secure Storage**: Uploaded files backed up with encryption
- **Input Sanitization**: All user inputs validated and sanitized
- **Private Repository**: Code accessible only to authorized collaborators

### Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Troubleshooting

#### File Upload Not Working

- Check file size (max 50MB)
- Verify file format (.xlsx, .csv, .pdf)
- Ensure adequate server disk space

#### Charts Not Displaying

- Verify Recharts is installed
- Check browser console for errors
- Ensure data is properly formatted

#### Export Issues

- Verify ExcelJS and jsPDF packages
- Check browser permissions for downloads
- Ensure data is not empty before export

### Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

### License

Copyright 2024 Marine Department. All rights reserved.

### Support

For issues or questions, contact the Marine Department IT Department.

### Roadmap

- Real-time data streaming
- Advanced ML-powered analytics
- Mobile app version
- Multi-language support
- Role-based access control (RBAC)
- Audit logging
- API integrations (Bank feeds, SAP, etc.)
- Custom report builder
- Predictive analytics

---

**Version**: 0.1.0  
**Last Updated**: December 2024
