import auditService from '../services/auditService.js';
import { sendSuccess } from '../utils/response.js';

async function listAuditLogs(req, res, next) {
  try {
    const result = await auditService.listAuditLogs(req.query);
    sendSuccess(res, result, 'Audit logs retrieved');
  } catch (error) {
    next(error);
  }
}

export { listAuditLogs };
