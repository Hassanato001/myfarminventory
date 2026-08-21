import { sendSuccess } from '../utils/response.js';

function createPlaceholderController(name) {
  return (req, res) => sendSuccess(res, { route: name }, `${name} endpoint`);
}

export { createPlaceholderController };
