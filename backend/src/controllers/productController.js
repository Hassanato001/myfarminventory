import productService from '../services/productService.js';
import { sendSuccess } from '../utils/response.js';

async function createProduct(req, res, next) {
  try {
    const product = await productService.createProduct(req.body, req.user?.userId);
    sendSuccess(res, product, 'Product created', 201);
  } catch (error) {
    next(error);
  }
}

async function getProducts(req, res, next) {
  try {
    const result = await productService.getProducts(req.query);
    sendSuccess(res, result, 'Products retrieved');
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    sendSuccess(res, product, 'Product retrieved');
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body, req.user?.userId);
    sendSuccess(res, product, 'Product updated');
  } catch (error) {
    next(error);
  }
}

export { createProduct, getProducts, getProductById, updateProduct };
