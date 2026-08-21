import salesService from '../services/salesService.js';
import { sendSuccess } from '../utils/response.js';

async function listSales(req, res, next) {
  try {
    const result = await salesService.listSales(req.query);
    sendSuccess(res, result, 'Sales retrieved');
  } catch (error) {
    next(error);
  }
}

async function createSale(req, res, next) {
  try {
    const sale = await salesService.createSale(req.body, req.user?.userId);
    sendSuccess(res, sale, 'Sale created', 201);
  } catch (error) {
    next(error);
  }
}

export { listSales, createSale };
