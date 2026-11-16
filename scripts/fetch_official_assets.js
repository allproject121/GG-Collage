const fs = require('fs');

async function inspectGallery() {
  try {
    const res = await fetch('https://www.ggcollege.ac.in/Gallery.aspx');
    const html = await res.text();
    fs.writeFileSync('scripts/gallery_remote.html', html);
    const regex = /(?:src|href)=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
    let m;
    const imgs = new Set();
    while ((m = regex.exec(html)) !== null) {
      imgs.add(m[1]);
    }
    console.log('Gallery page images count:', imgs.size);
    [...imgs].forEach(img => console.log(' ', img));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

inspectGallery();
