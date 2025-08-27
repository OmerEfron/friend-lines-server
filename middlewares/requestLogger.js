const logger = require('../services/utils/logger');
const { v4: uuidv4 } = require('uuid');

const requestLogger = (req, res, next) => {
  // Generate unique request ID
  const requestId = uuidv4();
  const startTime = Date.now();
  
  // Set request context for logging
  const requestContext = {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    userId: req.user?.uuid
  };
  
  logger.setContext(requestContext);
  
  // Log request start
  logger.info('HTTP_REQUEST', 'Request started', {
    method: req.method,
    url: req.originalUrl,
    ip: requestContext.ip
  });
  
  // Override res.end to capture response data
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    // Log request completion
    const logData = {
      statusCode,
      duration,
      contentLength: chunk ? chunk.length : 0
    };
    
    // Determine log level based on status code
    if (statusCode >= 500) {
      logger.error('HTTP_REQUEST', 'Request failed with server error', logData);
    } else if (statusCode >= 400) {
      logger.warn('HTTP_REQUEST', 'Request failed with client error', logData);
    } else {
      logger.info('HTTP_REQUEST', 'Request completed successfully', logData);
    }
    
    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

module.exports = requestLogger;
