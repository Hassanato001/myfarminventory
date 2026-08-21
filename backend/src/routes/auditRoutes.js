import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { listAuditLogs } from '../controllers/auditController.js';

const router = Router();

router.get('/', auth, listAuditLogs);

export default router;
