const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const apiCache = new Map();

const server = http.createServer((req, res) => {
  // Handle all /api/ proxies (/api/search, /api/home, /api/tv, /api/trending, etc.)
  if (req.url.startsWith('/api/')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    const cached = apiCache.get(req.url);
    if (cached && (Date.now() - cached.time < 3600000)) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(cached.body);
      return;
    }

    const targetUrl = `https://api.framextv.tech${req.url}`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://framextv.cc/',
        'Accept': 'application/json, text/plain, */*'
      }
    };

    https.get(targetUrl, options, (proxyRes) => {
      let body = '';
      proxyRes.on('data', chunk => body += chunk);
      proxyRes.on('end', () => {
        if (proxyRes.statusCode >= 200 && proxyRes.statusCode < 300) {
          try {
            JSON.parse(body);
            apiCache.set(req.url, { time: Date.now(), body });
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(body);
            return;
          } catch (e) {}
        }
        if (cached) {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(cached.body);
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Upstream status ' + proxyRes.statusCode, episodes: [] }));
      });
    }).on('error', (err) => {
      if (cached) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(cached.body);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: err.message, episodes: [] }));
    });
    return;
  }

  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback to index.html for SPA routes
      fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (fallbackErr, fallbackData) => {
        if (fallbackErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fallbackData);
      });
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n======================================================`);
  console.log(`🎬 Amazon Prime Video TV - Interface Running Live!`);
  console.log(`📡 URL: ${url}`);
  console.log(`✨ Features: Prime Top 10, Live TMDB Search, X-Ray, Player HUD`);
  console.log(`======================================================\n`);
});
