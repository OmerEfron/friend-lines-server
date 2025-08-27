// Logging configuration
const loggingConfig = {
  // Default log level
  defaultLevel: process.env.LOG_LEVEL || 'INFO',
  
  // Environment-specific settings
  development: {
    level: 'DEBUG',
    includeStackTraces: true,
    prettyPrint: true
  },
  
  production: {
    level: 'INFO',
    includeStackTraces: false,
    prettyPrint: false
  },
  
  test: {
    level: 'ERROR',
    includeStackTraces: false,
    prettyPrint: false
  },
  
  // Log categories and their default levels
  categories: {
    'USER_AUTH': 'INFO',
    'FRIENDSHIP': 'INFO',
    'GROUP': 'INFO',
    'NEWSFLASH': 'INFO',
    'SYSTEM': 'WARN',
    'SECURITY': 'WARN',
    'HTTP_REQUEST': 'INFO',
    'DATABASE': 'WARN'
  },
  
  // Performance thresholds for warnings
  performance: {
    slowRequestThreshold: 1000, // 1 second
    slowDatabaseThreshold: 100,  // 100ms
    maxLogEntrySize: 10000      // 10KB
  }
};

// Get current environment config
const getCurrentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return {
    ...loggingConfig,
    ...loggingConfig[env]
  };
};

// Validate log level
const isValidLogLevel = (level) => {
  const validLevels = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
  return validLevels.includes(level);
};

module.exports = {
  loggingConfig,
  getCurrentConfig,
  isValidLogLevel
};
