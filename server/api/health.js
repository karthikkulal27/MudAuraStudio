export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    path: req.url,
    mode: 'serverless-direct',
    node: process.version,
    timestamp: new Date().toISOString(),
  });
}