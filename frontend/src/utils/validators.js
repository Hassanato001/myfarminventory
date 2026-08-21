function required(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
}

export { required, isEmail };
