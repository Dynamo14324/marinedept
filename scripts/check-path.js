const path = require('path');
const fs = require('fs');

console.log('[v0] __dirname:', __dirname);
console.log('[v0] process.cwd():', process.cwd());

// Check common paths
const paths = [
  process.cwd(),
  __dirname,
  '/home/user/project',
  '/root/project',
  path.join(__dirname, '..')
];

paths.forEach(p => {
  try {
    const files = fs.readdirSync(p);
    const xlsxFiles = files.filter(f => f.includes('.xlsx'));
    console.log(`[v0] ${p}:`);
    console.log(`     Files: ${files.length}, XLSX: ${xlsxFiles.length}`);
    if (xlsxFiles.length > 0) {
      console.log(`     XLSX files: ${xlsxFiles.join(', ')}`);
    }
  } catch (e) {
    console.log(`[v0] ${p}: Not accessible`);
  }
});
