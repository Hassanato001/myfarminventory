import { prisma } from '../config/database.js';

class AuditService {
  async listAuditLogs(filters = {}) {
    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 20);
    const skip = (page - 1) * limit;
    const search = String(filters.search || '').toLowerCase();

    let logs = prisma.__state.auditLogs.slice();
    if (search) {
      logs = logs.filter((log) =>
        String(log.action || '').toLowerCase().includes(search) ||
        String(log.entity || '').toLowerCase().includes(search) ||
        String(log.entityId || '').toLowerCase().includes(search)
      );
    }

    logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const paged = logs.slice(skip, skip + limit);

    return {
      data: paged,
      pagination: {
        page,
        limit,
        total: logs.length,
        pages: Math.max(1, Math.ceil(logs.length / limit))
      }
    };
  }
}

export default new AuditService();
