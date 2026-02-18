import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const excelPath = path.join(__dirname, '..', '2024-IAnSISCHEDULE n Performances.xlsx');

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
      console.log(`    Columns: ${Object.keys(data[0]).join(', ')}`);
      console.log(`    First row sample:`, data[0]);
    }
  });
} catch (error) {
  console.error('[v0] Error reading Excel:', error.message);
}
