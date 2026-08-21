import { request } from './api.js';

const dashboardService = {
  summary: () => request('/dashboard/summary')
};

export default dashboardService;
