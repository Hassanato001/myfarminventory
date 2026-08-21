import { request } from './api.js';

const salesService = {
  list: () => request('/sales'),
  create: (payload) =>
    request('/sales', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};

export default salesService;
