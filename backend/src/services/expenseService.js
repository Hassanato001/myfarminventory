import { prisma } from '../config/database.js';
import { AppError } from '../utils/errors.js';

class ExpenseService {
  async listExpenses(filters = {}) {
    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 20);
    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      prisma.expenses.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.expenses.count()
    ]);

    return {
      data: expenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit))
      }
    };
  }

  async createExpense(payload, userId) {
    if (!payload.title) {
      throw new AppError('Expense title is required', 400);
    }

    const expense = await prisma.expenses.create({
      data: {
        title: payload.title,
        category: payload.category || 'General',
        amount: Number(payload.amount || 0),
        note: payload.note || '',
        paymentMethod: payload.paymentMethod || 'CASH',
        userId
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'EXPENSE_CREATED',
        entity: 'Expense',
        entityId: expense.id,
        userId,
        details: { title: expense.title, amount: expense.amount }
      }
    });

    return expense;
  }
}

export default new ExpenseService();
