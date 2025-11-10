import express from 'express';
import prisma from '../config/database.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

// List users (basic fields)
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    res.json({ users });
  } catch (e) {
    console.error('Admin users list error:', e);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Promote user to admin
router.post('/users/:id/promote', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.update({ where: { id }, data: { role: 'ADMIN' }, select: { id: true, email: true, name: true, role: true } });
    res.json({ user });
  } catch (e) {
    console.error('Promote user error:', e);
    res.status(500).json({ error: 'Failed to promote user' });
  }
});

// List all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, email: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ orders });
  } catch (e) {
    console.error('Admin orders list error:', e);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['pending','processing','completed','cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const order = await prisma.order.update({ where: { id }, data: { status }, include: { items: true } });
    res.json({ order });
  } catch (e) {
    console.error('Update order status error:', e);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;