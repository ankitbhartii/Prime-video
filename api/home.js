const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const targetUrl = 'https://api.framextv.tech/api/home';

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
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
      return res.status(200).json(data);
    }

    // Node fallback with https
    https.get(targetUrl, { headers }, (proxyRes) => {
      let body = '';
      proxyRes.on('data', chunk => body += chunk);
      proxyRes.on('end', () => {
        try {
          const json = JSON.parse(body);
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
          res.status(200).json(json);
        } catch (e) {
          res.status(500).json({ error: 'Invalid JSON from upstream', rails: {} });
        }
      });
    }).on('error', (err) => {
      res.status(500).json({ error: err.message, rails: {} });
    });
  } catch (err) {
    res.status(500).json({ error: err.message, rails: {} });
  }
};
