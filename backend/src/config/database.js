import { hashPassword } from '../utils/bcrypt.js';

const state = {
  users: [],
  products: [],
  sales: [],
  customers: [],
  purchases: [],
  expenses: [],
  auditLogs: [],
  inventoryHistory: [],
  suppliers: [],
  settings: {
    businessProfile: {
      businessName: 'Farm Shop Inventory',
      phone: '',
      email: '',
      address: ''
    },
    receiptSettings: {
      footerText: 'Thank you for shopping with us',
      showLogo: true,
      showTax: true
    },
    userPreferences: {
      theme: 'light',
      currency: 'USD',
      language: 'en'
    }
  }
};

const counters = {
  users: 1,
  products: 1,
  sales: 1,
  customers: 1,
  purchases: 1,
  expenses: 1,
  auditLogs: 1,
  inventoryHistory: 1,
  suppliers: 1
};

function nextId(collection) {
  const id = counters[collection];
  counters[collection] += 1;
  return String(id);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalize(value) {
  return String(value).toLowerCase();
}

function matchesScalar(actual, condition) {
  if (condition && typeof condition === 'object' && !Array.isArray(condition)) {
    if (Object.prototype.hasOwnProperty.call(condition, 'equals')) {
      const expected = condition.mode === 'insensitive' ? normalize(condition.equals) : condition.equals;
      const current = condition.mode === 'insensitive' ? normalize(actual) : actual;
      return current === expected;
    }

    if (Object.prototype.hasOwnProperty.call(condition, 'contains')) {
      const current = condition.mode === 'insensitive' ? normalize(actual) : String(actual);
      const expected = condition.mode === 'insensitive' ? normalize(condition.contains) : String(condition.contains);
      return current.includes(expected);
    }

    if (Object.prototype.hasOwnProperty.call(condition, 'gte') && !(actual >= condition.gte)) {
      return false;
    }

    if (Object.prototype.hasOwnProperty.call(condition, 'lte') && !(actual <= condition.lte)) {
      return false;
    }

    if (Object.prototype.hasOwnProperty.call(condition, 'gt') && !(actual > condition.gt)) {
      return false;
    }

    if (Object.prototype.hasOwnProperty.call(condition, 'lt') && !(actual < condition.lt)) {
      return false;
    }

    return true;
  }

  return actual === condition;
}

function matchesWhere(record, where = {}) {
  if (!where || Object.keys(where).length === 0) {
    return true;
  }

  if (Array.isArray(where.OR) && where.OR.length > 0) {
    const orMatches = where.OR.some((clause) => matchesWhere(record, clause));
    if (!orMatches) {
      return false;
    }
  }

  for (const [key, condition] of Object.entries(where)) {
    if (key === 'OR') {
      continue;
    }

    if (!matchesScalar(record[key], condition)) {
      return false;
    }
  }

  return true;
}

function applySelect(record, select) {
  if (!select) {
    return clone(record);
  }

  const result = {};
  for (const [key, enabled] of Object.entries(select)) {
    if (!enabled) {
      continue;
    }

    if (key === '_count') {
      result._count = {};
      for (const relatedKey of Object.keys(enabled.select || {})) {
        if (relatedKey === 'sales') {
          result._count.sales = state.sales ? state.sales.filter((item) => item.userId === record.id).length : 0;
        } else if (relatedKey === 'saleItems') {
          result._count.saleItems = state.sales
            ? state.sales.reduce((count, sale) => count + (sale.items ? sale.items.filter((item) => item.productId === record.id).length : 0), 0)
            : 0;
        } else if (relatedKey === 'purchaseItems') {
          result._count.purchaseItems = state.purchases
            ? state.purchases.reduce((count, purchase) => count + (purchase.items ? purchase.items.filter((item) => item.productId === record.id).length : 0), 0)
            : 0;
        }
      }
      continue;
    }

    result[key] = record[key];
  }

  return result;
}

function attachIncludes(record, include, entityName) {
  if (!include) {
    return clone(record);
  }

  const result = clone(record);

  if (include.supplier) {
    result.supplier = null;
    if (record.supplierId) {
      const supplier = state.suppliers.find((item) => item.id === record.supplierId);
      result.supplier = supplier ? clone(supplier) : null;
    }
  }

  if (include.inventoryHistory && entityName === 'product') {
    const history = state.inventoryHistory
      .filter((item) => item.productId === record.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    result.inventoryHistory = include.inventoryHistory.take ? history.slice(0, include.inventoryHistory.take) : history;
  }

  if (include._count) {
    result._count = {};
    for (const relatedKey of Object.keys(include._count.select || {})) {
      if (relatedKey === 'saleItems') {
    result._count.saleItems = state.sales
      ? state.sales.reduce((count, sale) => count + (sale.items ? sale.items.filter((item) => item.productId === record.id).length : 0), 0)
      : 0;
  } else if (relatedKey === 'purchaseItems') {
    result._count.purchaseItems = state.purchases
      ? state.purchases.reduce((count, purchase) => count + (purchase.items ? purchase.items.filter((item) => item.productId === record.id).length : 0), 0)
      : 0;
  } else if (relatedKey === 'sales') {
    result._count.sales = state.sales ? state.sales.filter((item) => item.userId === record.id).length : 0;
  }
    }
  }

  return result;
}

function makeEntity(collection) {
  return {
    async create({ data, select, include }) {
      const record = {
        id: nextId(collection),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...clone(data)
      };
      state[collection].push(record);
      const shaped = include ? attachIncludes(record, include, collection.slice(0, -1)) : record;
      return select ? applySelect(shaped, select) : clone(shaped);
    },
    async findUnique({ where, select, include }) {
      const key = Object.keys(where || {})[0];
      const value = where ? where[key] : undefined;
      const record = state[collection].find((item) => item[key] === value);
      if (!record) {
        return null;
      }
      const shaped = include ? attachIncludes(record, include, collection.slice(0, -1)) : record;
      return select ? applySelect(shaped, select) : clone(shaped);
    },
    async findFirst({ where, select, include }) {
      const record = state[collection].find((item) => matchesWhere(item, where));
      if (!record) {
        return null;
      }
      const shaped = include ? attachIncludes(record, include, collection.slice(0, -1)) : record;
      return select ? applySelect(shaped, select) : clone(shaped);
    },
    async findMany({ where, orderBy, skip = 0, take, select, include } = {}) {
      let records = state[collection].filter((item) => matchesWhere(item, where));
      if (orderBy) {
        const [field, direction] = Object.entries(orderBy)[0];
        records = records.slice().sort((a, b) => {
          const left = a[field];
          const right = b[field];
          if (left < right) return direction === 'desc' ? 1 : -1;
          if (left > right) return direction === 'desc' ? -1 : 1;
          return 0;
        });
      }
      if (typeof skip === 'number' && skip > 0) {
        records = records.slice(skip);
      }
      if (typeof take === 'number') {
        records = records.slice(0, take);
      }
      return records.map((record) => {
        const shaped = include ? attachIncludes(record, include, collection.slice(0, -1)) : record;
        return select ? applySelect(shaped, select) : clone(shaped);
      });
    },
    async update({ where, data, select, include }) {
      const key = Object.keys(where || {})[0];
      const value = where ? where[key] : undefined;
      const index = state[collection].findIndex((item) => item[key] === value);
      if (index === -1) {
        throw new Error(`${collection.slice(0, -1)} not found`);
      }
      const current = state[collection][index];
      const updated = {
        ...current,
        ...clone(data),
        updatedAt: new Date().toISOString()
      };
      state[collection][index] = updated;
      const shaped = include ? attachIncludes(updated, include, collection.slice(0, -1)) : updated;
      return select ? applySelect(shaped, select) : clone(shaped);
    },
    async count({ where } = {}) {
      return state[collection].filter((item) => matchesWhere(item, where)).length;
    }
  };
}

const prisma = {
  async $connect() {
    return undefined;
  },
  async $disconnect() {
    return undefined;
  },
  user: makeEntity('users'),
  product: makeEntity('products'),
  sales: makeEntity('sales'),
  customers: makeEntity('customers'),
  purchases: makeEntity('purchases'),
  expenses: makeEntity('expenses'),
  auditLog: {
    async create({ data }) {
      const record = {
        id: nextId('auditLogs'),
        createdAt: new Date().toISOString(),
        ...clone(data)
      };
      state.auditLogs.push(record);
      return clone(record);
    }
  },
  inventoryHistory: {
    async create({ data }) {
      const record = {
        id: nextId('inventoryHistory'),
        createdAt: new Date().toISOString(),
        ...clone(data)
      };
      state.inventoryHistory.push(record);
      return clone(record);
    }
  },
  supplier: makeEntity('suppliers'),
  __state: state
};

async function seedDemoData() {
  if (state.users.length === 0) {
    const password = await hashPassword('Password123!');
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password,
        firstName: 'Admin',
        lastName: 'User',
        phone: '0000000000',
        role: 'ADMIN',
        isActive: true,
        refreshToken: null,
        lastLogin: null
      }
    });
  }

  if (state.suppliers.length === 0) {
    await prisma.supplier.create({
      data: {
        name: 'Default Supplier',
        contactPerson: 'Supply Team',
        phone: '0000000000',
        email: 'supplier@example.com',
        address: 'Main Market'
      }
    });
  }

  if (state.products.length === 0) {
    await prisma.product.create({
      data: {
        name: 'Maize Flour',
        description: 'Starter inventory item',
        category: 'Groceries',
        sku: 'GRO-MAI-0001',
        buyingPrice: 10,
        sellingPrice: 15,
        quantity: 25,
        reorderLevel: 5,
        unit: 'bag',
        supplierId: state.suppliers[0].id,
        expiryDate: null,
        isActive: true,
        barcode: 'MAIZE-0001'
      }
    });
  }

  if (state.customers.length === 0) {
    await prisma.customers.create({
      data: {
        name: 'Walk-in Customer',
        phone: '',
        email: '',
        address: '',
        notes: 'Default customer record',
        totalSpent: 0,
        lastPurchaseAt: null
      }
    });
  }
}

export { prisma };
export { seedDemoData };
export default prisma;
