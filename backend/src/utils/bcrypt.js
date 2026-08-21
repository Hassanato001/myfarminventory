import crypto from 'node:crypto';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function comparePassword(password, hashedPassword) {
  const [salt, hash] = String(hashedPassword).split(':');
  if (!salt || !hash) {
    return false;
  }
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
  if (hash.length !== testHash.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(testHash, 'hex'));
}

export { hashPassword, comparePassword };
