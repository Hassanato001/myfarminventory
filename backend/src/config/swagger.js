function setupSwagger(app) {
  app.get('/api/docs', (req, res) => {
    res.json({
      success: true,
      message: 'Swagger documentation placeholder',
      endpoints: ['/api/auth', '/api/products', '/api/users']
    });
  });
}

export { setupSwagger };
