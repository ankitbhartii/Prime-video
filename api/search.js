const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query?.q || (new URL(req.url, 'http://localhost')).searchParams.get('q') || '';
  if (!query) {
    return res.status(200).json({ results: [] });
  }

  const targetUrl = `https://api.framextv.tech/api/search?q=${encodeURIComponent(query)}`;

  try {
    if (typeof fetch !== 'undefined') {
      const response = await fetch(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!response.ok) {
        throw new Error(`Upstream search returned ${response.status}`);
      }
      const data = await response.json();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
      return res.status(200).json(data);
    }

    https.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (proxyRes) => {
      let body = '';
      proxyRes.on('data', chunk => body += chunk);
      proxyRes.on('end', () => {
        try {
          const json = JSON.parse(body);
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(json);
        } catch (e) {
          res.status(200).json({ results: [] });
        }
      });
    }).on('error', (err) => {
      res.status(500).json({ error: err.message, results: [] });
    });
  } catch (err) {
    res.status(500).json({ error: err.message, results: [] });
  }
};
