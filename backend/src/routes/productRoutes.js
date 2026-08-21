import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { createProduct, getProducts, getProductById, updateProduct } from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);

export default router;
