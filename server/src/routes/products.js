import express from 'express';
import { getAllProducts, getProductById, createProduct } from '../controllers/productController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, createProduct); // Admin only in production

export default router;
