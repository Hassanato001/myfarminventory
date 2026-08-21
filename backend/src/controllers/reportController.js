import reportService from '../services/reportService.js';
import { sendSuccess } from '../utils/response.js';

async function getSummary(req, res, next) {
  try {
    const summary = await reportService.getSummary();
    sendSuccess(res, summary, 'Reports summary retrieved');
  } catch (error) {
    next(error);
  }
}

export { getSummary };
