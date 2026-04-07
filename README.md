# IAnSI Executive Dashboard

## Intelligence and Analysis System Interface

A comprehensive Next.js 15 executive dashboard for the Marine Department featuring real-time financial analytics, compliance tracking, and document management.

### Features

- **Dashboard**: Real-time KPI cards, metrics display, and financial overview
- **Analytics Center**: Advanced charting (Line, Area, Bar, Pie), compliance dashboards, and data trends
- **Data Processing**: Parse and validate Excel, CSV, and PDF files
- **Financial Tables**: Interactive tables with sorting, filtering, searching, and export capabilities
- **Document Management**: Upload, organize, and track financial documents
- **Export Center**: Multi-format export (Excel, PDF, CSV), bulk operations, and scheduled exports
- **Compliance Tracking**: Compliance indicators, audit trails, and recommendations
- **Settings**: Organization configuration, data management, security, and backup options

### Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI components
- **Data Visualization**: Recharts
- **File Processing**: 
  - XLSX (Excel)
  - CSV (Papa Parse)
  - PDF (PDF.js)
- **Export**: ExcelJS, jsPDF, jsPDF-AutoTable
- **UI Components**: Radix UI (Tabs), Lucide Icons
- **State Management**: React Hooks

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


### Environment Variables

Create a `.env.local` file based on `.env.example`.

| Variable | Required | Default | Description |
|---|---|---|---|
| `MAX_UPLOAD_MB` | No | `50` | Maximum upload size accepted by `POST /api/process-file`. |

### Project Structure

```
/app
  /api
    /process-file        # File upload and processing endpoint
  /analytics             # Analytics center page
  /documents             # Document management page
  /export                # Export center page
  /settings              # Settings configuration page
  page.tsx              # Main dashboard
  layout.tsx            # Root layout with navigation
  globals.css           # Global styles and design tokens

/components
  file-upload.tsx       # File upload component
  kpi-card.tsx          # Key performance indicator card
  data-table.tsx        # Basic data table
  financial-table.tsx   # Advanced financial table with filtering
  financial-chart.tsx   # Multi-type charts (Line, Area, Bar, Pie)
  compliance-dashboard.tsx  # Compliance indicators and tracking
  bulk-operations.tsx   # Bulk export and selection component
  navigation.tsx        # Sidebar navigation
  /ui
    tabs.tsx            # Radix UI Tabs component

/lib
  excel-parser.ts       # Excel file parsing and metrics
  csv-parser.ts         # CSV file parsing
  pdf-parser.ts         # PDF file parsing and text extraction
  data-validator.ts     # Data validation and statistics
  export-utils.ts       # Export functions (Excel, PDF, CSV)
  utils.ts              # Common utility functions
  sample-data.ts        # Sample data generator
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

- Enforces max file size via `MAX_UPLOAD_MB` (default 50MB).

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


### Deployment (Vercel)

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Set environment variables from `.env.example` in Vercel Project Settings.
4. Deploy using the default Next.js settings (`vercel.json` is included).
5. Verify runtime health by opening `/api/health` after deployment.

#### GET /api/health

Simple readiness probe returning service status, timestamp, and uptime.

### Performance Optimizations

- Server-side rendering with React Server Components
- Lazy loading of charts and tables
- Optimized re-renders with React hooks
- Tailwind CSS purging for minimal bundle size
- Image optimization with Next.js built-in tools

### Security Features

- Data validation on upload
- File type verification
- Size limit enforcement (50MB default)
- Secure file handling
- Input sanitization for display

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
