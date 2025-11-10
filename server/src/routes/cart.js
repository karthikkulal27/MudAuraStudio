import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getCart, addOrUpdateItem, updateQuantity, removeItem, clearCart, syncCart } from '../controllers/cartController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getCart); // GET full cart
router.post('/items', addOrUpdateItem); // Add or increment existing
router.patch('/items/:productId', updateQuantity); // Set quantity / delete if 0
router.delete('/items/:productId', removeItem); // Remove specific item
router.delete('/', clearCart); // Clear all
router.post('/sync', syncCart); // Sync full cart after local+remote merge

export default router;
