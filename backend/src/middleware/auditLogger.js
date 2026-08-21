function auditLogger(action, entity) {
  return (req, res, next) => {
    req.audit = { action, entity };
    next();
  };
}

export { auditLogger };
