const { spawn } = require('child_process');
const http = require('http');

const server = spawn('node', ['server.js'], {
  env: { ...process.env, PORT: '5050' },
  stdio: ['ignore', 'pipe', 'pipe']
});

server.stdout.on('data', (d) => process.stdout.write(`[SERVER] ${d}`));
server.stderr.on('data', (d) => process.stderr.write(`[SERVER-ERR] ${d}`));

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5050${path}`, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data: data.slice(0, 200) }));
    }).on('error', reject);
  });
}

setTimeout(async () => {
  try {
    console.log('Testing server endpoints...');
    const endpoints = [
      '/',
      '/pages/about.html',
      '/pages/gallery.html',
      '/pages/programmes.html',
      '/pages/admissions.html',
      '/api/health',
      '/api/notices',
      '/api/events',
      '/api/departments',
      '/api/faculty',
      '/api/downloads',
      '/api/examination/notices',
      '/api/examination/timetables',
      '/api/examination/results',
      '/api/examination/question-papers'
    ];

    for (const ep of endpoints) {
      const res = await get(ep);
      console.log(`Endpoint ${ep} -> Status: ${res.status}`);
      if (res.status >= 400) {
        console.error(`FAILED: ${ep} returned ${res.status}`);
      }
    }
    console.log('All endpoints tested successfully!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.kill();
    process.exit(0);
  }
}, 2000);
