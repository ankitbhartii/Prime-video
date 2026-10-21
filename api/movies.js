const https = require('https');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const page = req.query?.page || (new URL(req.url, 'http://localhost')).searchParams.get('page') || '1';
  const targetUrl = `https://api.framextv.tech/api/movies?page=${encodeURIComponent(page)}`;

  try {
    if (typeof fetch !== 'undefined') {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Referer': 'https://framextv.cc/'
        }
      });
      if (!response.ok) {
        throw new Error(`Upstream movies returned ${response.status}`);
      }
      const data = await response.json();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
      return res.status(200).json(data);
    }

    https.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://framextv.cc/'
      }
    }, (proxyRes) => {
      let body = '';
      proxyRes.on('data', chunk => body += chunk);
      proxyRes.on('end', () => {
        try {
          const json = JSON.parse(body);
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
          res.status(200).json(json);
        } catch (e) {
          res.status(200).json({ success: false, results: [] });
        }
      });
    }).on('error', (err) => {
      res.status(500).json({ error: err.message, results: [] });
    });
  } catch (err) {
    res.status(500).json({ error: err.message, results: [] });
  }
};
