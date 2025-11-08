import prisma from '../config/database.js';

export const getCart = async (req, res) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user.userId },
      include: { product: true }
    });
    const transformed = items.map(i => ({
      product: i.product,
      quantity: i.quantity
    }));
    res.json({ items: transformed });
  } catch (err) {
    console.error('GetCart error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

export const addOrUpdateItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ error: 'productId required' });
    if (quantity <= 0) return res.status(400).json({ error: 'quantity must be > 0' });

    // Ensure product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await prisma.cartItem.upsert({
      where: { userId_productId: { userId: req.user.userId, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId: req.user.userId, productId, quantity }
    });

    const items = await prisma.cartItem.findMany({
      where: { userId: req.user.userId },
      include: { product: true }
    });
    res.json({ items: items.map(i => ({ product: i.product, quantity: i.quantity })) });
  } catch (err) {
    console.error('AddOrUpdateCartItem error:', err);
    res.status(500).json({ error: 'Failed to add item' });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined) return res.status(400).json({ error: 'quantity required' });
    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({ where: { userId: req.user.userId, productId } });
    } else {
      await prisma.cartItem.update({
        where: { userId_productId: { userId: req.user.userId, productId } },
        data: { quantity }
      }).catch(async () => {
        // If item not found, create it
        await prisma.cartItem.create({ data: { userId: req.user.userId, productId, quantity } });
      });
    }
    const items = await prisma.cartItem.findMany({ where: { userId: req.user.userId }, include: { product: true } });
    res.json({ items: items.map(i => ({ product: i.product, quantity: i.quantity })) });
  } catch (err) {
    console.error('UpdateCartItem error:', err);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    await prisma.cartItem.deleteMany({ where: { userId: req.user.userId, productId } });
    const items = await prisma.cartItem.findMany({ where: { userId: req.user.userId }, include: { product: true } });
    res.json({ items: items.map(i => ({ product: i.product, quantity: i.quantity })) });
  } catch (err) {
    console.error('RemoveCartItem error:', err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

export const clearCart = async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.userId } });
    res.json({ items: [] });
  } catch (err) {
    console.error('ClearCart error:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
