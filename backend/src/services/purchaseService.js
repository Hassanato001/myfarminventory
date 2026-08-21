import { prisma } from '../config/database.js';
import { AppError } from '../utils/errors.js';

class PurchaseService {
  async listPurchases(filters = {}) {
    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 20);
    const skip = (page - 1) * limit;

    const [purchases, total] = await Promise.all([
      prisma.purchases.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.purchases.count()
    ]);

    return {
      data: purchases,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit))
      }
    };
  }

  async createPurchase(payload, userId) {
    const items = Array.isArray(payload.items) ? payload.items : [];
    if (items.length === 0) {
      throw new AppError('At least one purchase item is required', 400);
    }

    let total = 0;
    const normalizedItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        throw new AppError(`Product not found: ${item.productId}`, 404);
      }

      const quantity = Number(item.quantity || 0);
      const unitCost = Number(item.unitCost || product.buyingPrice);
      if (quantity <= 0) {
        throw new AppError('Purchase quantity must be greater than zero', 400);
      }

      const previousQty = Number(product.quantity);
      const newQty = previousQty + quantity;

      await prisma.product.update({
        where: { id: product.id },
        data: { quantity: newQty }
      });

      await prisma.inventoryHistory.create({
        data: {
          type: 'STOCK_IN',
          quantity,
          previousQty,
          newQty,
          reason: 'Purchase order',
          productId: product.id,
          userId
        }
      });

      const lineTotal = quantity * unitCost;
      total += lineTotal;
      normalizedItems.push({
        productId: product.id,
        name: product.name,
        quantity,
        unitCost,
        lineTotal
      });
    }

    const purchase = await prisma.purchases.create({
      data: {
        supplierName: payload.supplierName || 'Unspecified Supplier',
        reference: payload.reference || `PUR-${Date.now()}`,
        total: Number(total.toFixed(2)),
        items: normalizedItems,
        notes: payload.notes || '',
        userId
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'PURCHASE_CREATED',
        entity: 'Purchase',
        entityId: purchase.id,
        userId,
        details: { total: purchase.total, supplierName: purchase.supplierName }
      }
    });

    return purchase;
  }
}

export default new PurchaseService();
