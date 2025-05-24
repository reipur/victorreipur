// pages/api/proxy.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  if (!url || Array.isArray(url)) {
    res.status(400).send('Missing or invalid `url` query');
    return;
  }

  try {
    // fetch with a desktop UA to get desktop layout
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

    // strip browser frame-busting headers
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');

    const html = await targetRes.text();
    const origin = new URL(url as string).origin;

    // inject <base> so assets resolve
    const proxied = html.replace(
      /<head([^>]*)>/i,
      `<head$1><base href="${origin}">`
    );

    res.status(targetRes.status).send(proxied);
  } catch (err) {
    console.error(err);
    res.status(500).send('Proxy error');
  }
}
