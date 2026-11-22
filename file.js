// Vercel serverless function: chuyển tiếp tải file sticker từ Telegram (tránh lỗi CORS).
export default async function handler(req, res) {
  const path = String(req.query.path || '');
  const token = String(req.headers['x-bot-token'] || '');
  if (!/^\d+:[\w-]+$/.test(token) || !/^[\w\-./]+$/.test(path) || path.includes('..')) {
    return res.status(400).send('bad request');
  }
  try {
    const r = await fetch(`https://api.telegram.org/file/bot${token}/${path}`);
    res.status(r.status);
    res.setHeader('content-type', r.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('cache-control', 'no-store');
    res.send(Buffer.from(await r.arrayBuffer()));
  } catch (e) {
    res.status(502).send('upstream error');
  }
}
