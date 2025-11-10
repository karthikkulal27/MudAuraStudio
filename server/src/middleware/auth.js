import jwt from 'jsonwebtoken';

// Enhanced auth middleware with debug logging (only in development)
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[AUTH] No token cookie present');
      }
      return res.status(401).json({ error: 'Authentication required' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[AUTH] JWT verify failed:', {
          name: err?.name,
          message: err?.message,
          tokenSample: token.slice(0, 25) + '...' + token.slice(-10),
          secretLen: process.env.JWT_SECRET?.length,
        });
      }
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (outer) {
    console.error('[AUTH] Unexpected error:', outer);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Optional diagnostic endpoint to inspect token validity manually (enable only in development)
export const debugTokenMiddleware = (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(404).end();
  const token = req.cookies?.token;
  if (!token) return res.json({ hasToken: false });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ valid: true, decoded });
  } catch (e) {
    return res.json({ valid: false, error: e.message, name: e.name });
  }
};
