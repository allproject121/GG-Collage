const fs = require('fs');
const path = require('path');

function scan(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) scan(full);
    else if (f.endsWith('.html')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = content.match(/src=["'][^"']+\.(?:svg|png|jpg|jpeg)["']/gi) || [];
      const hrefIcons = content.match(/href=["'][^"']+\.(?:svg|png|jpg|ico)["']/gi) || [];
      const all = [...new Set([...matches, ...hrefIcons])];
      if (all.length > 0) {
        console.log(`=== ${f} ===\n${all.join('\n')}\n`);
      }
    }
  }
}
scan('public');
