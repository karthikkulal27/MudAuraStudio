import prisma from '../config/database.js';

export const getAllProducts = async (req, res) => {
  try {
    const { category, featured, search, limit = 50, offset = 0 } = req.query;

    const where = {};
    if (category) where.category = category;
    if (featured) where.featured = featured === 'true';
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.product.count({ where });

    res.json({ products, total });
  } catch (error) {
    console.error('GetAllProducts error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('GetProductById error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, stock, featured } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        category,
        images: images || [],
        stock: stock || 0,
        featured: featured || false,
      },
    });

    res.status(201).json({ product });
  } catch (error) {
    console.error('CreateProduct error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, images, stock, featured } = req.body;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
        price: price !== undefined ? parseFloat(price) : existing.price,
        category: category ?? existing.category,
        images: images ?? existing.images,
        stock: stock !== undefined ? stock : existing.stock,
        featured: featured !== undefined ? featured : existing.featured,
      },
    });
    res.json({ product });
  } catch (error) {
    console.error('UpdateProduct error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('DeleteProduct error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
