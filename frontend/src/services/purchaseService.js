import { request } from './api.js';

const purchaseService = {
  list: (params = '') => request(`/purchases${params}`),
  create: (payload) =>
    request('/purchases', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

export default purchaseService;
