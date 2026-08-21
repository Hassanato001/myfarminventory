import { prisma } from '../config/database.js';
import { AppError } from '../utils/errors.js';

class CustomerService {
  async listCustomers(filters = {}) {
    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 20);
    const skip = (page - 1) * limit;
    const search = filters.search || '';

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {};

    const [customers, total] = await Promise.all([
      prisma.customers.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.customers.count({ where })
    ]);

    return {
      data: customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit))
      }
    };
  }

  async createCustomer(payload, userId) {
    if (!payload.name) {
      throw new AppError('Customer name is required', 400);
    }

    const customer = await prisma.customers.create({
      data: {
        name: payload.name,
        phone: payload.phone || '',
        email: payload.email || '',
        address: payload.address || '',
        notes: payload.notes || '',
        totalSpent: 0,
        lastPurchaseAt: null
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'CUSTOMER_CREATED',
        entity: 'Customer',
        entityId: customer.id,
        userId,
        details: { name: customer.name, email: customer.email }
      }
    });

    return customer;
  }
}

export default new CustomerService();
