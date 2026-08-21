import { prisma } from '../config/database.js';
import { AppError } from '../utils/errors.js';

class SalesService {
  async listSales(filters = {}) {
    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 20);
    const skip = (page - 1) * limit;

    const [sales, total] = await Promise.all([
      prisma.sales.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.sales.count()
    ]);

    return {
      data: sales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit))
      }
    };
  }

  async createSale(payload, userId) {
    const items = Array.isArray(payload.items) ? payload.items : [];
    if (items.length === 0) {
      throw new AppError('At least one sale item is required', 400);
    }

    const processedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        throw new AppError(`Product not found: ${item.productId}`, 404);
      }

      const quantity = Number(item.quantity || 0);
      if (quantity <= 0) {
        throw new AppError('Sale item quantity must be greater than zero', 400);
      }

      if (Number(product.quantity) < quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400);
      }

      const unitPrice = Number(item.unitPrice || product.sellingPrice);
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      const updatedQuantity = Number(product.quantity) - quantity;
      await prisma.product.update({
        where: { id: product.id },
        data: { quantity: updatedQuantity }
      });

      await prisma.inventoryHistory.create({
        data: {
          type: 'STOCK_OUT',
          quantity,
          previousQty: Number(product.quantity),
          newQty: updatedQuantity,
          reason: 'POS sale',
          productId: product.id,
          userId
        }
      });

      processedItems.push({
        productId: product.id,
        name: product.name,
        quantity,
        unitPrice,
        lineTotal
      });
    }

    const total = Number(subtotal.toFixed(2));
    const amountPaid = Number(payload.amountPaid || total);
    const change = Number((amountPaid - total).toFixed(2));

    const sale = await prisma.sales.create({
      data: {
        userId,
        customerName: payload.customerName || 'Walk-in Customer',
        paymentMethod: payload.paymentMethod || 'CASH',
        subtotal,
        total,
        amountPaid,
        change,
        items: processedItems
      }
    });

    if (payload.customerName) {
      const customer = await prisma.customers.findFirst({
        where: { name: { equals: payload.customerName, mode: 'insensitive' } }
      });
      if (customer) {
        await prisma.customers.update({
          where: { id: customer.id },
          data: {
            totalSpent: Number(customer.totalSpent || 0) + total,
            lastPurchaseAt: new Date().toISOString()
          }
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        action: 'SALE_CREATED',
        entity: 'Sale',
        entityId: sale.id,
        userId,
        details: { total, paymentMethod: sale.paymentMethod }
      }
    });

    return sale;
  }
}

export default new SalesService();
