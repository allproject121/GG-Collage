const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /images\/GG-College-Logo\.svg/g, to: 'images/GG-College-Logo.png' },
  { from: /images\/banner-image-college\.svg/g, to: 'images/banner-image-college.jpg' },
  { from: /images\/chairman\.svg/g, to: 'images/chairman.jpg' },
  { from: /images\/principal\.svg/g, to: 'images/principal.jpg' },
  { from: /images\/Arts\.svg/g, to: 'images/Arts.jpg' },
  { from: /images\/Commerce_v2\.svg/g, to: 'images/Commerce.jpg' },
  { from: /images\/Commerce\.svg/g, to: 'images/Commerce.jpg' },
  { from: /images\/Science\.svg/g, to: 'images/Science.jpg' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      processDir(full);
    } else if (f.endsWith('.html') || f.endsWith('.js')) {
      let content = fs.readFileSync(full, 'utf8');
      let changed = false;
      for (const r of replacements) {
        if (r.from.test(content)) {
          content = content.replace(r.from, r.to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(full, content, 'utf8');
        console.log(`Updated images in: ${full}`);
      }
    }
  }
}

processDir('public');
console.log('Finished updating standard image references.');
