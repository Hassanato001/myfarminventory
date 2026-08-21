import { request } from './api.js';

const productService = {
  list: (params = '') => request(`/products${params}`),
  create: (token, payload) =>
    request('/products', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(payload)
    }),
  update: (token, id, payload) =>
    request(`/products/${id}`, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify(payload)
    }),
  getById: (id) => request(`/products/${id}`)
};

export default productService;
