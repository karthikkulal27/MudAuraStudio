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

dotenv.config();

const app = express();

// CORS and cookies
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());

// IMPORTANT: Mount Stripe webhook BEFORE express.json(), because it needs raw body
// Our stripeRoutes file defines router.post('/webhook', express.raw(...)),
// so we mount this router first to ensure raw body is available for that route.
app.use('/api/stripe', stripeRoutes);

// JSON parser for the rest
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/cart', cartRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

export default app;
