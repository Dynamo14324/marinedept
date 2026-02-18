const fs = require('fs');
const path = require('path');

console.log('[v0] Current working directory:', process.cwd());
console.log('[v0] Script directory:', __dirname);

// List files in current directory
const cwd = process.cwd();
const files = fs.readdirSync(cwd);
console.log('[v0] Files in cwd:', files.filter(f => f.includes('.xlsx') || f.includes('2024')));

// Try to find the file
const candidates = [
  path.join(cwd, '2024-IAnSISCHEDULE n Performances.xlsx'),
  '/vercel/share/v0-project/2024-IAnSISCHEDULE n Performances.xlsx',
  path.join(__dirname, '../2024-IAnSISCHEDULE n Performances.xlsx')
];

candidates.forEach(candidate => {
  if (fs.existsSync(candidate)) {
    console.log(`[v0] FOUND: ${candidate}`);
  }
});
