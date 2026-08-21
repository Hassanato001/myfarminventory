import expenseService from '../services/expenseService.js';
import { sendSuccess } from '../utils/response.js';

async function listExpenses(req, res, next) {
  try {
    const result = await expenseService.listExpenses(req.query);
    sendSuccess(res, result, 'Expenses retrieved');
  } catch (error) {
    next(error);
  }
}

async function createExpense(req, res, next) {
  try {
    const expense = await expenseService.createExpense(req.body, req.user?.userId);
    sendSuccess(res, expense, 'Expense created', 201);
  } catch (error) {
    next(error);
  }
}

export { listExpenses, createExpense };
