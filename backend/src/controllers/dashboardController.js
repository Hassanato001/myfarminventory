import { prisma } from '../config/database.js';
import { sendSuccess } from '../utils/response.js';

async function getDashboardSummary(req, res, next) {
  try {
    const [users, products, sales] = await Promise.all([
      prisma.user.findMany(),
      prisma.product.findMany(),
      prisma.sales.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
    ]);

    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
    const lowStockItems = products.filter((product) => Number(product.quantity) <= Number(product.reorderLevel || 0));

    sendSuccess(res, {
      metrics: {
        users: users.length,
        products: products.length,
        sales: sales.length,
        revenue: Number(totalRevenue.toFixed(2)),
        lowStock: lowStockItems.length
      },
      recentSales: sales,
      lowStockItems
    }, 'Dashboard summary retrieved');
  } catch (error) {
    next(error);
  }
}

export { getDashboardSummary };
