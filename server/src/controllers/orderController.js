import prisma from '../config/database.js';

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, total } = req.body;
    const userId = req.user.userId;

    if (!items || !items.length || !shippingAddress || !total) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId,
        total: parseFloat(total),
        shippingAddress,
        status: 'pending',
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(201).json({ order });
  } catch (error) {
    console.error('CreateOrder error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ orders });
  } catch (error) {
    console.error('GetUserOrders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('GetOrderById error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};
