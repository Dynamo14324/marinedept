const XLSX = require('xlsx');
const path = require('path');

const excelPath = '/vercel/share/v0-project/2024-IAnSISCHEDULE n Performances.xlsx';

console.log(`[v0] Reading Excel file: ${excelPath}`);

try {
  const workbook = XLSX.readFile(excelPath);
  
  console.log('[v0] Sheet names:', workbook.SheetNames);
  console.log('\n[v0] Sheet Details:');
  
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    console.log(`\n  Sheet: "${sheetName}"`);
    console.log(`    Rows: ${data.length}`);
    if (data.length > 0) {
      console.log(`    Columns: ${Object.keys(data[0]).slice(0, 5).join(', ')}`);
    }
  });
} catch (error) {
  console.error('[v0] Error reading Excel:', error.message);
}
