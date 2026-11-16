const fs = require('fs');
const path = require('path');

const imagesToDownload = [
  { remote: 'https://www.ggcollege.ac.in/images/GG-College-Logo.jpg', local: 'public/images/GG-College-Logo.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/GG-College-Logo.png', local: 'public/images/GG-College-Logo.png' },
  { remote: 'https://www.ggcollege.ac.in/images/banner-image-college.jpg', local: 'public/images/banner-image-college.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/principal-sir-photo-2.jpg', local: 'public/images/principal.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/Chairman-image.jpg', local: 'public/images/chairman.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/Commerce_v2.jpg', local: 'public/images/Commerce.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/Science.jpg', local: 'public/images/Science.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/Arts.jpg', local: 'public/images/Arts.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/thumb-1.jpg', local: 'public/images/thumb-1.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/thumb-2.jpg', local: 'public/images/thumb-2.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/thumb-3.jpg', local: 'public/images/thumb-3.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/thumb-4.jpg', local: 'public/images/thumb-4.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/thumb-5.jpg', local: 'public/images/thumb-5.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/thumb-6.jpg', local: 'public/images/thumb-6.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/thumb-7.jpg', local: 'public/images/thumb-7.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/admission-banner.jpg', local: 'public/images/admission-banner.jpg' },
  { remote: 'https://www.ggcollege.ac.in/images/Students.png', local: 'public/images/Students.png' },
  { remote: 'https://www.ggcollege.ac.in/images/Courses.png', local: 'public/images/Courses.png' },
  { remote: 'https://www.ggcollege.ac.in/images/Years.png', local: 'public/images/Years.png' }
];

async function downloadAll() {
  for (const item of imagesToDownload) {
    try {
      const res = await fetch(item.remote);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(item.local, Buffer.from(buffer));
        console.log(`Downloaded ${item.local} (${buffer.byteLength} bytes) from ${item.remote}`);
      } else {
        console.warn(`Failed ${item.remote}: HTTP ${res.status}`);
      }
    } catch (e) {
      console.error(`Error downloading ${item.remote}: ${e.message}`);
    }
  }
}

downloadAll();
