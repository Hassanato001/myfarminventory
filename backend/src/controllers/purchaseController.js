import purchaseService from '../services/purchaseService.js';
import { sendSuccess } from '../utils/response.js';

async function listPurchases(req, res, next) {
  try {
    const result = await purchaseService.listPurchases(req.query);
    sendSuccess(res, result, 'Purchases retrieved');
  } catch (error) {
    next(error);
  }
}

async function createPurchase(req, res, next) {
  try {
    const purchase = await purchaseService.createPurchase(req.body, req.user?.userId);
    sendSuccess(res, purchase, 'Purchase created', 201);
  } catch (error) {
    next(error);
  }
}

export { listPurchases, createPurchase };
