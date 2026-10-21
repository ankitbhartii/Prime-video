const https = require('https');

const TOP_ANIME = [
  'anime', 'one piece', 'naruto', 'attack on titan', 'demon slayer',
  'jujutsu kaisen', 'dragon ball', 'bleach', 'hunter x hunter', 'solo leveling',
  'chainsaw man', 'death note', 'spy x family', 'my hero academia', 'tokyo ghoul'
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const page = parseInt(req.query?.page || (new URL(req.url, 'http://localhost')).searchParams.get('page') || '1');
  const query = TOP_ANIME[(page - 1) % TOP_ANIME.length];
  const targetUrl = `https://api.framextv.tech/api/search?q=${encodeURIComponent(query)}`;

  try {
    if (typeof fetch !== 'undefined') {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Referer': 'https://framextv.cc/'
        }
      });
      if (!response.ok) {
        throw new Error(`Upstream anime returned ${response.status}`);
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
