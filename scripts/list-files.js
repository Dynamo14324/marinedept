const fs = require('fs');

console.log('[v0] Listing /vercel/share/v0-project:');
const files = fs.readdirSync('/vercel/share/v0-project');
files.forEach(f => {
  if (f.toLowerCase().includes('xlsx') || f.toLowerCase().includes('excel') || f.includes('2024')) {
    console.log('[v0] Found:', f);
  }
});

console.log('\n[v0] All files:');
files.slice(0, 20).forEach(f => {
  const stat = fs.statSync(`/vercel/share/v0-project/${f}`);
  console.log(`  ${f} ${stat.isDirectory() ? '[DIR]' : ''}`);
});
