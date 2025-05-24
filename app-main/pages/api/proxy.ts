// pages/api/proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  if (!url || Array.isArray(url)) {
    res.status(400).send('Missing or invalid `url` query');
    return;
  }

  try {
    const targetRes = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/115.0.0.0 Safari/537.36',
      },
    });

    const contentType = targetRes.headers.get('content-type') || 'text/html';
    res.setHeader('Content-Type', contentType);
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');

    const html = await targetRes.text();
    const origin = new URL(url as string).origin;
    const proxied = html.replace(
      /<head([^>]*)>/i,
      `<head$1><base href="${origin}">`
    );

    res.status(targetRes.status).send(proxied);
  } catch {
    // no console.error here, so nothing shows up in your Next.js console
    res.status(500).send('Proxy error');
  }
}
