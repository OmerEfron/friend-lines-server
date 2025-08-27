const { formatLog } = require('./logFormatter');

// Log levels configuration
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Current log level (configurable via environment)
const CURRENT_LOG_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || 'INFO'];

// Request context storage (using AsyncLocalStorage for request-scoped data)
let currentRequestContext = {};

// Set request context for the current request
const setRequestContext = (context) => {
  currentRequestContext = { ...context };
};

// Get current request context
const getRequestContext = () => currentRequestContext;

// Core logging function
const log = (level, category, message, data = {}) => {
  // Check if this log level should be output
  if (LOG_LEVELS[level] > CURRENT_LOG_LEVEL) {
    return;
  }

  // Get current request context
  const requestContext = getRequestContext();
  
  // Create log entry
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    category,
    message,
    ...data,
    ...requestContext
  };

  // Format and output log
  const formattedLog = formatLog(logEntry);
  
  // Output based on level
  switch (level) {
    case 'ERROR':
      console.error(formattedLog);
      break;
    case 'WARN':
      console.warn(formattedLog);
      break;
    case 'INFO':
      console.info(formattedLog);
      break;
    case 'DEBUG':
      console.debug(formattedLog);
      break;
    default:
      console.log(formattedLog);
  }
};

// Public logger interface
const logger = {
  // Set request context
  setContext: setRequestContext,
  getContext: getRequestContext,
  
  // Log methods
  error: (category, message, data) => log('ERROR', category, message, data),
  warn: (category, message, data) => log('WARN', category, message, data),
  info: (category, message, data) => log('INFO', category, message, data),
  debug: (category, message, data) => log('DEBUG', category, message, data),
  
  // Utility methods
  getCurrentLevel: () => Object.keys(LOG_LEVELS)[CURRENT_LOG_LEVEL],
  isLevelEnabled: (level) => LOG_LEVELS[level] <= CURRENT_LOG_LEVEL
};

module.exports = logger;
