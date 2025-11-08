export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    message: 'Direct function health check',
    env: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString(),
  });
}
