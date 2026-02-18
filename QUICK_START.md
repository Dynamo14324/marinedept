# Quick Start Guide

## Local Development (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local
# Edit and set: UPLOAD_PASSWORD=your_password

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000/audits
```

## Main URLs

| URL | Purpose | Protected |
|-----|---------|-----------|
| `/` | Main dashboard | No |
| `/audits` | Audit performance | No |
| `/admin/upload` | Upload Excel files | Yes (password) |
| `/analytics` | Analytics | No |
| `/settings` | Settings | No |

## Upload Excel Files

1. Go to `/admin/upload`
2. Select `.xlsx` or `.xls` file
3. Filename must include year: `2024-IAnSISCHEDULE.xlsx`
4. Enter admin password
5. Click "Upload Excel"
6. Dashboard updates automatically

## Excel File Format

**Required Sheets:**
- `Dry Data`
- `Tanker Data`
- `Int. Audit Category`
- `Saf. Insp. category`

**Required Columns:**
```
Dry Data / Tanker Data:
- Vessel (or Vessel Name)
- Audit Date (or Date)
- Auditor (or Audited By)
- NC (or Non-Conformities)
- Observations (or Obs)
```

## Build & Deploy

```bash
# Test production build locally
npm run build
npm start

# Deploy to Vercel
git push origin main
# Vercel auto-deploys!

# Set env vars in Vercel dashboard:
# UPLOAD_PASSWORD = [your secure password]
```

## Dashboard Features

### View Audit Data
1. Click year buttons to select years
2. Charts load automatically
3. View metrics in cards below

### Compare Years
1. Select 2+ years
2. Click "Comparison View"
3. Side-by-side dashboards

### Export Charts
1. Click "Download" button
2. PNG file saves automatically
3. Use in presentations

## Key Files to Know

- **`app/audits/page.tsx`** - Main dashboard page
- **`components/audit-dashboard.tsx`** - Dashboard logic
- **`lib/chart-utils.ts`** - Chart configurations
- **`app/actions/upload-excel.ts`** - Upload handler
- **`types/audit-data.ts`** - Data types

## Troubleshooting

### Charts not showing?
```bash
# Restart dev server
# Press Ctrl+C and run: npm run dev
```

### Upload fails?
- Check filename has year: `2024-file.xlsx`
- Verify password is correct
- Check file is valid Excel (.xlsx)

### Build fails?
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Environment Variables

```bash
# Required
UPLOAD_PASSWORD=your_secure_password

# Optional (auto-set by Vercel)
NODE_ENV=production
VERCEL_URL=https://your-domain.vercel.app
```

## Code Examples

### Load audit data for a year
```typescript
import { loadAuditDataForYear } from '@/app/actions/upload-excel'

const data = await loadAuditDataForYear(2024)
```

### Create a chart
```typescript
import { createClusteredColumnWithTrendConfig } from '@/lib/chart-utils'

const config = createClusteredColumnWithTrendConfig(
  'My Chart',
  'X Axis',
  'Y Axis',
  ['2023', '2024'],
  [{ label: 'Data', data: [10, 20] }]
)
```

### Export chart as PNG
```typescript
import { exportChartAsImage } from '@/lib/chart-utils'

exportChartAsImage(canvasElement, 'chart-name.png')
```

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run linter
```

## Useful Links

- **GitHub**: https://github.com/Dynamo14324/marinedept
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Next.js Docs**: https://nextjs.org/docs
- **Chart.js Docs**: https://www.chartjs.org/docs/latest/

## Need Help?

See detailed guides:
- **Deployment**: `DEPLOYMENT_GUIDE.md`
- **Implementation**: `IMPLEMENTATION_SUMMARY.md`
- **All Features**: `README.md`
- **Chart Specs**: `CHART_SPECIFICATIONS.md`
- **Data Format**: `dashboard_requirements.md`

---

**Ready to start?** Run `npm install && npm run dev` and open `http://localhost:3000/audits`
