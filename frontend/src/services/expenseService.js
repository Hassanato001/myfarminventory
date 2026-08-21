import { request } from './api.js';

const expenseService = {
  list: (params = '') => request(`/expenses${params}`),
  create: (payload) =>
    request('/expenses', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

export default expenseService;
