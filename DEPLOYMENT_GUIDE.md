# Marine Department Audit Dashboard - Deployment Guide

## Overview

This guide covers deploying the audit dashboard to Vercel with GitHub integration. The system automatically updates charts and data whenever new Excel files are uploaded.

## Prerequisites

- GitHub account with access to the private repository (Dynamo14324/marinedept)
- Vercel account (free tier is sufficient)
- Node.js 18+ and npm/pnpm installed locally

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/Dynamo14324/marinedept.git
cd marinedept
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:

```
UPLOAD_PASSWORD=your_secure_password_here
```

### 4. Run Development Server

```bash
npm run dev
# Server runs at http://localhost:3000
```

### 5. Access the Application

- **Main Dashboard**: http://localhost:3000
- **Audit Dashboard**: http://localhost:3000/audits
- **Admin Upload**: http://localhost:3000/admin/upload

## Deployment to Vercel

### Step 1: Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Select "Import Git Repository"
5. Search for `Dynamo14324/marinedept`
6. Click "Import"

### Step 2: Configure Project

1. **Project Name**: Keep default or customize
2. **Framework**: Next.js (auto-detected)
3. **Root Directory**: Leave empty (project root)
4. **Build Settings**: Use defaults

### Step 3: Set Environment Variables

1. In the Vercel dashboard, go to Settings → Environment Variables
2. Add the following variables:

| Name | Value | Notes |
|------|-------|-------|
| `UPLOAD_PASSWORD` | [Your secure password] | Used for admin file uploads |

3. Click "Save"

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Your site will be available at `https://[project-name].vercel.app`

## Automatic Deployment

Once connected to GitHub:

- **Production Branch** (`main`): Automatically deploys on push
- **Preview Deployments**: Created for pull requests
- **Continuous Updates**: Any changes pushed to GitHub trigger automatic redeployment

## Data Management

### Uploading New Excel Files

1. Navigate to `https://[your-domain]/admin/upload`
2. Click "Select File" and choose your Excel file (.xlsx or .xls)
3. Enter the admin password set in environment variables
4. Click "Upload Excel"
5. Dashboard automatically updates with new data

### Excel File Format Requirements

**Filename**: Must contain year (e.g., `2024-IAnSISCHEDULE.xlsx`)

**Required Sheets**:
- `Dry Data` - Dry fleet audit records
- `Tanker Data` - Tanker fleet audit records
- `Int. Audit Category` - Internal audit categories
- `Saf. Insp. category` - Safety inspection categories

**Required Columns**:
- **Dry Data / Tanker Data**:
  - `Vessel` or `Vessel Name`
  - `Audit Date` or `Date`
  - `Auditor` or `Audited By`
  - `NC` or `Non-Conformities`
  - `Observations` or `Obs`

### Data Storage

- **Uploaded Files**: Stored in `/data/uploads/` (backed up)
- **Parsed Data**: Cached in `/data/parsed/` in JSON format
- **Security**: Only authenticated uploads via admin interface

## Features

### Dashboard Views

1. **Main Dashboard** (`/`)
   - Sample data overview
   - Financial metrics
   - Compliance indicators

2. **Audit Dashboard** (`/audits`)
   - Year-based filtering
   - Single year or comparison view
   - Fleet performance metrics (Dry vs Tanker)
   - Quarterly breakdowns
   - NC trends and analysis

3. **Admin Upload** (`/admin/upload`)
   - Secure Excel file uploads
   - Password-protected access
   - Real-time processing

### Chart Types

- **Clustered Column Charts**: Fleet comparison across years
- **Stacked Column Charts**: Quarterly breakdowns
- **Trend Lines**: NC per audit trends
- **Data Tables**: Detailed audit records

### Export Capabilities

Each chart includes a download button to save as PNG:
- Click "Download" on any chart
- Automatically named with chart title
- Full resolution export

## Security

### Code Repository (Private)

- Private GitHub repository
- Only authorized collaborators can view code
- GitHub branch protection rules recommended

### Live Dashboard (Public)

- Password-protected admin upload
- No authentication required for viewing charts
- Suitable for public/internal company access

### Best Practices

1. **Environment Variables**:
   - Never commit `.env.local` to Git
   - Use `.env.example` as template
   - Rotate `UPLOAD_PASSWORD` quarterly

2. **File Management**:
   - Validate Excel files before upload
   - Keep encrypted backups
   - Archive historical files

3. **Access Control**:
   - Only share upload URL with authorized users
   - Communicate password securely (never in chat/email)
   - Monitor upload activity

## Troubleshooting

### Build Failures

```bash
# Clear build cache
vercel env pull  # Pull env vars locally
npm run build    # Test build locally
```

### Upload Issues

- **"Invalid file type"**: Ensure .xlsx or .xls format
- **"Invalid password"**: Verify UPLOAD_PASSWORD matches env var
- **"Data transformation failed"**: Check Excel sheet names and format

### Missing Data in Dashboard

1. Check browser console for errors (F12 → Console)
2. Verify file was uploaded successfully
3. Confirm year is visible in year selector
4. Check data format matches requirements

### Deployment Troubleshooting

1. **Check Deployment Status**:
   - Go to Vercel Dashboard → Deployments
   - Look for red × (failed) or green ✓ (success)

2. **View Build Logs**:
   - Click on deployment
   - Scroll to "Build Logs" section
   - Check for error messages

3. **Redeploy**:
   - Go to Deployments tab
   - Click three dots on latest deployment
   - Select "Redeploy"

## Monitoring & Maintenance

### Regular Tasks

- **Weekly**: Check dashboard for new data and uploads
- **Monthly**: Review upload logs and data quality
- **Quarterly**: Backup important files and audit logs

### Performance Optimization

- Dashboard loads should be < 2 seconds
- Charts render in < 1 second
- File uploads handle up to 50MB

## Support & Documentation

- **Issues**: Create issues in the private GitHub repository
- **Documentation**: See `/docs` folder (if exists)
- **Charts**: See `CHART_SPECIFICATIONS.md` for detailed chart definitions
- **Data**: See `dashboard_requirements.md` for data structure

## Quick Reference

| URL | Purpose | Protected |
|-----|---------|-----------|
| `/` | Main dashboard | No |
| `/audits` | Audit performance | No |
| `/admin/upload` | File uploads | Password |
| `/settings` | Settings page | No |
| `/export` | Data export | No |

## Next Steps

1. Deploy to Vercel (follow steps above)
2. Test with sample Excel file
3. Set secure admin password in production
4. Share dashboard URL with stakeholders
5. Begin uploading real audit data

---

**Last Updated**: 2024
**Version**: 1.0
