import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import stripeRoutes from './routes/stripe.js';
import testimonialRoutes from './routes/testimonials.js';
import cartRoutes from './routes/cart.js';
import adminRoutes from './routes/admin.js';
import { debugTokenMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();

// CORS and cookies
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  'http://localhost:5173',
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(cookieParser());

// Debug request logger (temporary – remove once stable)
app.use((req, res, next) => {
  console.log('[REQ]', req.method, req.url);
  next();
});

// IMPORTANT: Mount Stripe webhook BEFORE express.json(), because it needs raw body
// Our stripeRoutes file defines router.post('/webhook', express.raw(...)),
// so we mount this router first to ensure raw body is available for that route.
app.use('/api/stripe', stripeRoutes);
app.use('/stripe', stripeRoutes);

// JSON parser for the rest
app.use(express.json());

// Routes (support both with and without /api prefix due to Vercel path behavior)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/testimonials', testimonialRoutes);
app.use('/cart', cartRoutes);
app.use('/admin', adminRoutes);

// Health check (both /api/health and /health for serverless path ambiguity)
const healthHandler = (req, res) => {
  res.json({
    status: 'ok',
    path: req.originalUrl,
    node: process.version,
    env: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString(),
  });
};
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// Dev-only token debug endpoint
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/debug/token', debugTokenMiddleware);
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

export default app;
