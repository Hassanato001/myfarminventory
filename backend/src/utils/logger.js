function log(level, message, ...args) {
  const prefix = `[${level.toUpperCase()}]`;
  if (level === 'error') {
    console.error(prefix, message, ...args);
    return;
  }
  if (level === 'warn') {
    console.warn(prefix, message, ...args);
    return;
  }
  console.log(prefix, message, ...args);
}

const logger = {
  info: (message, ...args) => log('info', message, ...args),
  warn: (message, ...args) => log('warn', message, ...args),
  error: (message, ...args) => log('error', message, ...args),
  debug: (message, ...args) => log('debug', message, ...args)
};

export { logger };
