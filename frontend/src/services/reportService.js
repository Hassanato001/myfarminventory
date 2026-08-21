import { request } from './api.js';

const reportService = {
  summary: () => request('/reports/summary')
};

export default reportService;
