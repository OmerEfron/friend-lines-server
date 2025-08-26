const healthService = {
  async getHealthStatus() {
    const timestamp = new Date().toISOString();
    
    return {
      status: 'healthy',
      timestamp,
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
  }
};

module.exports = healthService;
