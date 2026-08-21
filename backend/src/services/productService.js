import { prisma } from '../config/database.js';
import { AppError } from '../utils/errors.js';

class ProductService {
  async createProduct(productData, userId) {
    const {
      name,
      category,
      buyingPrice,
      sellingPrice,
      quantity,
      reorderLevel,
      unit,
      supplierId,
      expiryDate,
      description
    } = productData;

    const existingProduct = await prisma.product.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });

    if (existingProduct) {
      throw new AppError('Product with this name already exists', 409);
    }

    const sku = await this.generateSKU(name, category);

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        sku,
        buyingPrice: Number(buyingPrice),
        sellingPrice: Number(sellingPrice),
        quantity: Number(quantity),
        reorderLevel: Number(reorderLevel),
        unit,
        supplierId: supplierId || null,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
        isActive: true,
        barcode: productData.barcode || null
      },
      include: {
        supplier: true
      }
    });

    if (Number(quantity) > 0) {
      await prisma.inventoryHistory.create({
        data: {
          type: 'STOCK_IN',
          quantity: Number(quantity),
          previousQty: 0,
          newQty: Number(quantity),
          reason: 'Initial stock',
          productId: product.id,
          userId
        }
      });
    }

    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_CREATED',
        entity: 'Product',
        entityId: product.id,
        userId,
        details: { name: product.name, sku: product.sku }
      }
    });

    return product;
  }

  async generateSKU(name, category) {
    const prefix = String(category || 'GEN').substring(0, 3).toUpperCase();
    const namePrefix = String(name || 'ITM').substring(0, 3).toUpperCase();
    const count = await prisma.product.count();
    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}-${namePrefix}-${sequence}`;
  }

  async getProducts(filters = {}) {
    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 20);
    const skip = (page - 1) * limit;
    const { search, category, stockStatus, minPrice, maxPrice, supplierId } = filters;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (category) {
      where.category = category;
    }
    if (supplierId) {
      where.supplierId = supplierId;
    }
    if (minPrice) {
      where.sellingPrice = { gte: Number(minPrice) };
    }
    if (maxPrice) {
      where.sellingPrice = Object.assign(where.sellingPrice || {}, { lte: Number(maxPrice) });
    }
    if (stockStatus === 'low') {
      where.quantity = { gt: 0, lte: Number(filters.reorderLevel || 10) };
    } else if (stockStatus === 'out-of-stock') {
      where.quantity = 0;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          supplier: true,
          _count: {
            select: {
              saleItems: true,
              purchaseItems: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit))
      }
    };
  }

  async getProductById(productId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        supplier: true,
        inventoryHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  async updateProduct(productId, updateData, userId) {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const quantityChange = updateData.quantity !== undefined ? Number(updateData.quantity) - Number(product.quantity) : 0;

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: updateData.name,
        description: updateData.description,
        category: updateData.category,
        buyingPrice: updateData.buyingPrice !== undefined ? Number(updateData.buyingPrice) : undefined,
        sellingPrice: updateData.sellingPrice !== undefined ? Number(updateData.sellingPrice) : undefined,
        quantity: updateData.quantity !== undefined ? Number(updateData.quantity) : undefined,
        reorderLevel: updateData.reorderLevel !== undefined ? Number(updateData.reorderLevel) : undefined,
        unit: updateData.unit,
        supplierId: updateData.supplierId,
        expiryDate: updateData.expiryDate ? new Date(updateData.expiryDate).toISOString() : undefined,
        isActive: updateData.isActive !== undefined ? updateData.isActive : undefined,
        barcode: updateData.barcode
      },
      include: {
        supplier: true
      }
    });

    if (quantityChange !== 0) {
      await prisma.inventoryHistory.create({
        data: {
          type: quantityChange > 0 ? 'STOCK_IN' : 'STOCK_OUT',
          quantity: Math.abs(quantityChange),
          previousQty: Number(product.quantity),
          newQty: Number(updatedProduct.quantity),
          reason: 'Inventory adjustment',
          productId,
          userId
        }
      });
    }

    await prisma.auditLog.create({
      data: {
        action: 'PRODUCT_UPDATED',
        entity: 'Product',
        entityId: productId,
        userId,
        details: { name: updatedProduct.name, sku: updatedProduct.sku }
      }
    });

    return updatedProduct;
  }
}

export default new ProductService();
