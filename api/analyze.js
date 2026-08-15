export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const upstream = process.env.VISION_PROVIDER_URL;
  const token = process.env.VISION_PROVIDER_TOKEN;

  if (!upstream || !token) {
    return res.status(503).json({ error: 'vision_provider_not_configured' });
  }

  try {
    const response = await fetch(upstream, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch {
    res.status(502).json({ error: 'vision_provider_unavailable' });
  }
}
