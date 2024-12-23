// pages/api/proxy.js
export default async function handler(req, res) {
    const response = await fetch('http://104.197.36.5:5001/api', {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers,
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : null,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  }
  