const https = require('https');

const memoryCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse path and query parameters
  const urlObj = new URL(req.url, 'http://localhost');
  const pathParam = req.query?.path || urlObj.searchParams.get('path');
  const idParam = req.query?.id || urlObj.searchParams.get('id');
  const seasonParam = req.query?.season || urlObj.searchParams.get('season');

  let targetPath = '';
  if (pathParam) {
    targetPath = pathParam.startsWith('/') ? pathParam.slice(1) : pathParam;
  } else if (idParam) {
    if (seasonParam) {
      targetPath = `${idParam}/season/${seasonParam}`;
    } else {
      targetPath = `${idParam}`;
    }
  }

  if (!targetPath) {
    return res.status(400).json({ error: 'Missing TV series id or path', episodes: [] });
  }

  const cacheKey = `tv_${targetPath}`;
  const cached = memoryCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(cached.data);
  }

  const targetUrl = `https://api.framextv.tech/api/tv/${targetPath}`;

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://framextv.cc/',
    'Accept': 'application/json, text/plain, */*'
  };

  try {
    if (typeof fetch !== 'undefined') {
      const response = await fetch(targetUrl, { headers });
      if (!response.ok) {
        throw new Error(`Upstream returned ${response.status}`);
      }
      const data = await response.json();
      memoryCache.set(cacheKey, { timestamp: Date.now(), data });
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
      return res.status(200).json(data);
    }

    // Node fallback
    https.get(targetUrl, { headers }, (proxyRes) => {
      let body = '';
      proxyRes.on('data', chunk => body += chunk);
      proxyRes.on('end', () => {
        try {
          const json = JSON.parse(body);
          memoryCache.set(cacheKey, { timestamp: Date.now(), data: json });
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
          res.status(200).json(json);
        } catch (e) {
          if (cached) {
            return res.status(200).json(cached.data);
          }
          res.status(200).json({ error: 'Upstream parsing error', episodes: [] });
        }
      });
    }).on('error', (err) => {
      if (cached) {
        return res.status(200).json(cached.data);
      }
      res.status(200).json({ error: err.message, episodes: [] });
    });
  } catch (err) {
    if (cached) {
      return res.status(200).json(cached.data);
    }
    res.status(200).json({ error: err.message, episodes: [] });
  }
};
