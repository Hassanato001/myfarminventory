import { prisma } from '../config/database.js';

class ReportService {
  async getSummary() {
    const [users, products, sales, purchases, expenses] = await Promise.all([
      prisma.user.findMany(),
      prisma.product.findMany(),
      prisma.sales.findMany(),
      prisma.purchases.findMany(),
      prisma.expenses.findMany()
    ]);

    const salesTotal = sales.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const purchasesTotal = purchases.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const expensesTotal = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const lowStockItems = products.filter((product) => Number(product.quantity) <= Number(product.reorderLevel || 0));

    return {
      metrics: {
        users: users.length,
        products: products.length,
        sales: sales.length,
        purchases: purchases.length,
        expenses: expenses.length,
        revenue: Number((salesTotal - expensesTotal).toFixed(2)),
        salesTotal: Number(salesTotal.toFixed(2)),
        purchasesTotal: Number(purchasesTotal.toFixed(2)),
        expensesTotal: Number(expensesTotal.toFixed(2)),
        lowStock: lowStockItems.length
      },
      breakdown: {
        sales,
        purchases,
        expenses
      },
      lowStockItems
    };
  }
}

export default new ReportService();
