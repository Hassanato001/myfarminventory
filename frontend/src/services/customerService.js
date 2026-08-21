import { request } from './api.js';

const customerService = {
  list: (params = '') => request(`/customers${params}`),
  create: (payload) =>
    request('/customers', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

export default customerService;
