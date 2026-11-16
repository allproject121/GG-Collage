const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) res = res.concat(walk(fp));
    else if (fp.endsWith('.html')) res.push(fp);
  });
  return res;
}

const htmls = walk('public');
const imgRefs = new Map();

htmls.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const imgs = [...content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
  imgs.forEach(img => {
    if (!imgRefs.has(img)) imgRefs.set(img, []);
    imgRefs.get(img).push(f);
  });
});

console.log('All image references found across HTML files:');
for (const [img, files] of imgRefs.entries()) {
  console.log(`Image: ${img} (used in ${files.length} files) -> e.g. ${files[0]}`);
}
