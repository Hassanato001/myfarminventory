import customerService from '../services/customerService.js';
import { sendSuccess } from '../utils/response.js';

async function listCustomers(req, res, next) {
  try {
    const result = await customerService.listCustomers(req.query);
    sendSuccess(res, result, 'Customers retrieved');
  } catch (error) {
    next(error);
  }
}

async function createCustomer(req, res, next) {
  try {
    const customer = await customerService.createCustomer(req.body, req.user?.userId);
    sendSuccess(res, customer, 'Customer created', 201);
  } catch (error) {
    next(error);
  }
}

export { listCustomers, createCustomer };
