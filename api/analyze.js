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

  const image = req.body?.image;
  if (typeof image !== 'string' || !image.startsWith('data:image/')) {
    return res.status(400).json({ error: 'invalid_image_payload' });
  }

  // Keep the proxy bounded so a browser cannot submit arbitrarily large payloads.
  if (image.length > 12 * 1024 * 1024) {
    return res.status(413).json({ error: 'image_payload_too_large' });
  }

  try {
    const response = await fetch(upstream, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ image })
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch {
    res.status(502).json({ error: 'vision_provider_unavailable' });
  }
}
