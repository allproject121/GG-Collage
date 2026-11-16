const fs = require('fs');
const path = require('path');

// 1. Update index.html
let index = fs.readFileSync('public/index.html', 'utf8');

// Postgraduate card
index = index.replace(
  /<img src="images\/event-placeholder\.svg" data-src="images\/event-placeholder\.svg" alt="Postgraduate Programmes"/g,
  '<img src="images/gallery-real-3.jpg" data-src="images/gallery-real-3.jpg" alt="Postgraduate & Research Programmes"'
);

// Event cards in index.html
index = index.replace(
  /<img src="images\/event-placeholder\.svg" data-src="images\/event-placeholder\.svg" alt="Awareness Campaign"/g,
  '<img src="images/thumb-4.jpg" data-src="images/thumb-4.jpg" alt="Awareness Campaign"'
);
index = index.replace(
  /<img src="images\/event-placeholder\.svg" data-src="images\/event-placeholder\.svg" alt="Conference"/g,
  '<img src="images/thumb-1.jpg" data-src="images/thumb-1.jpg" alt="International Conference"'
);
index = index.replace(
  /<img src="images\/event-placeholder\.svg" data-src="images\/event-placeholder\.svg" alt="Convocation"/g,
  '<img src="images/thumb-5.jpg" data-src="images/thumb-5.jpg" alt="Annual Convocation"'
);

// Video thumbnails in index.html
index = index.replace(
  /src="images\/cultural-activity\.svg" data-src="images\/cultural-activity\.svg"/g,
  'src="images/thumb-6.jpg" data-src="images/thumb-6.jpg"'
);
index = index.replace(
  /src="images\/nss-activity\.svg" data-src="images\/nss-activity\.svg"/g,
  'src="images/thumb-2.jpg" data-src="images/thumb-2.jpg"'
);

fs.writeFileSync('public/index.html', index, 'utf8');
console.log('Updated index.html placeholders.');

// 2. Update about.html
let about = fs.readFileSync('public/pages/about.html', 'utf8');
about = about.replace(
  /src="\.\.\/images\/event-placeholder\.svg" data-src="\.\.\/images\/event-placeholder\.svg" alt="College Historical Photo"/g,
  'src="../images/gallery-real-1.jpg" data-src="../images/gallery-real-1.jpg" alt="St. Gonsalo Garcia College Historic Campus Quadrangle"'
);
fs.writeFileSync('public/pages/about.html', about, 'utf8');
console.log('Updated about.html placeholders.');

// 3. Update activities.html
let activities = fs.readFileSync('public/pages/activities.html', 'utf8');
activities = activities.replace(
  /src="\.\.\/images\/nss-activity\.svg" data-src="\.\.\/images\/nss-activity\.svg"/g,
  'src="../images/thumb-4.jpg" data-src="../images/thumb-4.jpg"'
);
activities = activities.replace(
  /src="\.\.\/images\/ncc-activity\.svg" data-src="\.\.\/images\/ncc-activity\.svg"/g,
  'src="../images/thumb-1.jpg" data-src="../images/thumb-1.jpg"'
);
activities = activities.replace(
  /src="\.\.\/images\/dlle-activity\.svg" data-src="\.\.\/images\/dlle-activity\.svg"/g,
  'src="../images/thumb-2.jpg" data-src="../images/thumb-2.jpg"'
);
activities = activities.replace(
  /src="\.\.\/images\/sports-activity\.svg" data-src="\.\.\/images\/sports-activity\.svg"/g,
  'src="../images/thumb-7.jpg" data-src="../images/thumb-7.jpg"'
);
fs.writeFileSync('public/pages/activities.html', activities, 'utf8');
console.log('Updated activities.html placeholders.');

// 4. Update career-katta.html
let career = fs.readFileSync('public/pages/career-katta.html', 'utf8');
career = career.replace(
  /images\/event-placeholder\.svg/g,
  'images/thumb-4.jpg'
);
fs.writeFileSync('public/pages/career-katta.html', career, 'utf8');
console.log('Updated career-katta.html.');

// 5. Update events.html
let events = fs.readFileSync('public/pages/events.html', 'utf8');
events = events.replace(
  /images\/event-placeholder\.svg/g,
  'images/thumb-1.jpg'
);
fs.writeFileSync('public/pages/events.html', events, 'utf8');
console.log('Updated events.html.');

// 6. Update library.html
let library = fs.readFileSync('public/pages/library.html', 'utf8');
library = library.replace(
  /images\/event-placeholder\.svg/g,
  'images/gallery-real-2.jpg'
);
fs.writeFileSync('public/pages/library.html', library, 'utf8');
console.log('Updated library.html.');

// 7. Update media-centre.html
let media = fs.readFileSync('public/pages/media-centre.html', 'utf8');
media = media.replace(
  /images\/event-placeholder\.svg/g,
  'images/thumb-2.jpg'
);
fs.writeFileSync('public/pages/media-centre.html', media, 'utf8');
console.log('Updated media-centre.html.');

// 8. Update swayam.html
let swayam = fs.readFileSync('public/pages/swayam.html', 'utf8');
swayam = swayam.replace(
  /images\/event-placeholder\.svg/g,
  'images/thumb-2.jpg'
);
fs.writeFileSync('public/pages/swayam.html', swayam, 'utf8');
console.log('Updated swayam.html.');

// 9. Update wdc.html
let wdc = fs.readFileSync('public/pages/wdc.html', 'utf8');
wdc = wdc.replace(
  /images\/event-placeholder\.svg/g,
  'images/thumb-6.jpg'
);
fs.writeFileSync('public/pages/wdc.html', wdc, 'utf8');
console.log('Updated wdc.html.');

// 10. Update grievance.html
let grievance = fs.readFileSync('public/pages/grievance.html', 'utf8');
grievance = grievance.replace(
  /images\/event-placeholder\.svg/g,
  'images/gallery-real-2.jpg'
);
fs.writeFileSync('public/pages/grievance.html', grievance, 'utf8');
console.log('Updated grievance.html.');

console.log('All page image placeholders successfully updated with real college assets!');
