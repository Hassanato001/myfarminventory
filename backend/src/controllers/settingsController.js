import settingsService from '../services/settingsService.js';
import { sendSuccess } from '../utils/response.js';

async function getSettings(req, res, next) {
  try {
    const settings = await settingsService.getSettings();
    sendSuccess(res, settings, 'Settings retrieved');
  } catch (error) {
    next(error);
  }
}

async function updateSettings(req, res, next) {
  try {
    const settings = await settingsService.updateSettings(req.body, req.user?.userId);
    sendSuccess(res, settings, 'Settings updated');
  } catch (error) {
    next(error);
  }
}

export { getSettings, updateSettings };
