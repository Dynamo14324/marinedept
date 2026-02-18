// Test critical imports to identify build issues
const fs = require('fs');
const path = require('path');

const criticalFiles = [
  'types/audit-data.ts',
  'lib/excel-parser.ts',
  'lib/data-cache.ts',
  'lib/chart-utils.ts',
  'lib/utils.ts',
  'lib/csv-parser.ts',
  'lib/pdf-parser.ts',
  'lib/data-validator.ts',
  'lib/sample-data.ts',
  'app/actions/upload-excel.ts',
  'components/audit-dashboard.tsx',
  'components/audit-chart.tsx',
  'components/excel-upload-form.tsx',
  'components/ui/button.tsx',
  'components/ui/input.tsx',
  'components/ui/tabs.tsx',
  'app/audits/page.tsx',
  'app/admin/upload/page.tsx',
];

console.log('[v0] Checking critical files...');
const missing = [];

criticalFiles.forEach(file => {
  const fullPath = path.join('/vercel/share/v0-project', file);
  if (!fs.existsSync(fullPath)) {
    missing.push(file);
    console.log(`[v0] ✗ Missing: ${file}`);
  } else {
    console.log(`[v0] ✓ Found: ${file}`);
  }
});

if (missing.length > 0) {
  console.log(`\n[v0] Missing ${missing.length} critical files:`);
  missing.forEach(f => console.log(`  - ${f}`));
  process.exit(1);
} else {
  console.log(`\n[v0] All critical files present!`);
  process.exit(0);
}
