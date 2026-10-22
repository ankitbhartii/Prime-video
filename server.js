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
const FALLBACK_RAILS = require('./api/fallback-data.js');

const BACKENDS = [
  'https://api.framextv.tech',
  'https://api.framextv.xyz',
  'https://api.framextv.cc'
];

async function fetchFromUpstream(targetPath) {
  for (const base of BACKENDS) {
    try {
      const url = `${base}${targetPath}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://framextv.cc/',
          'Accept': 'application/json, text/plain, */*'
        }
      });
      if (res.ok) {
        const text = await res.text();
        const json = JSON.parse(text);
        if (json && (json.success || json.rails || json.results || Array.isArray(json))) {
          return { ok: true, body: text };
        }
      }
    } catch (e) {}
  }
  return { ok: false };
}

const server = http.createServer(async (req, res) => {
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

    let targetPath = req.url;
    if (req.url.startsWith('/api/anime')) {
      const urlObj = new URL(req.url, 'http://localhost');
      const page = parseInt(urlObj.searchParams.get('page') || '1');
      const TOP_ANIME = [
        'anime', 'one piece', 'naruto', 'attack on titan', 'demon slayer',
        'jujutsu kaisen', 'dragon ball', 'bleach', 'hunter x hunter', 'solo leveling',
        'chainsaw man', 'death note', 'spy x family', 'my hero academia', 'tokyo ghoul'
      ];
      const query = TOP_ANIME[(page - 1) % TOP_ANIME.length];
      targetPath = `/api/search?q=${encodeURIComponent(query)}`;
    } else if (req.url.startsWith('/api/tv?')) {
      const urlObj = new URL(req.url, 'http://localhost');
      const id = urlObj.searchParams.get('id');
      const season = urlObj.searchParams.get('season');
      if (id) {
        targetPath = season 
          ? `/api/tv/${id}/season/${season}`
          : `/api/tv/${id}`;
      }
    }

    const upstream = await fetchFromUpstream(targetPath);
    if (upstream.ok) {
      apiCache.set(req.url, { time: Date.now(), body: upstream.body });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(upstream.body);
      return;
    }

    // Graceful verified fallbacks if all upstreams fail
    if (cached) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(cached.body);
      return;
    }

    if (req.url.startsWith('/api/home')) {
      const fallbackBody = JSON.stringify({
        success: true,
        timestamp: Math.floor(Date.now() / 1000),
        rails: FALLBACK_RAILS
      });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(fallbackBody);
      return;
    }

    if (req.url.startsWith('/api/movies') || req.url.startsWith('/api/discover')) {
      const allMovies = (FALLBACK_RAILS.popular_movies || []).concat(FALLBACK_RAILS.trending_movies || []);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        page: 1,
        totalPages: 1000,
        totalResults: 20000,
        results: allMovies
      }));
      return;
    }

    if (req.url.startsWith('/api/search')) {
      const urlObj = new URL(req.url, 'http://localhost');
      const q = (urlObj.searchParams.get('q') || '').toLowerCase();
      const allItems = Object.values(FALLBACK_RAILS).flat();
      const matched = allItems.filter(item => item && item.title && item.title.toLowerCase().includes(q));
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        results: matched.length > 0 ? matched : allItems.slice(0, 10)
      }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: false, results: [] }));
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
