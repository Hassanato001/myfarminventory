import { request } from './api.js';

const settingsService = {
  get: () => request('/settings'),
  update: (payload) =>
    request('/settings', {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
};

export default settingsService;
