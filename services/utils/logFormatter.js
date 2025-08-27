// Log formatting utilities
const formatLog = (logEntry) => {
  try {
    // Ensure sensitive data is not logged
    const sanitizedEntry = sanitizeLogEntry(logEntry);
    
    // Format as JSON for structured logging
    return JSON.stringify(sanitizedEntry, null, 2);
  } catch (error) {
    // Fallback to simple format if JSON serialization fails
    return `[${logEntry.timestamp}] ${logEntry.level}: ${logEntry.message}`;
  }
};

// Sanitize log entry to remove sensitive information
const sanitizeLogEntry = (entry) => {
  const sanitized = { ...entry };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'authorization', 'secret'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  // Clean up undefined/null values
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === undefined) {
      delete sanitized[key];
    }
    if (sanitized[key] === null) {
      sanitized[key] = 'null';
    }
  });
  
  return sanitized;
};

// Create a simple log entry for quick logging
const createSimpleLog = (level, message, data = {}) => {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data
  };
};

// Format error objects for better logging
const formatError = (error) => {
  if (!error) return null;
  
  return {
    message: error.message,
    name: error.name,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    code: error.code,
    statusCode: error.statusCode
  };
};

module.exports = {
  formatLog,
  sanitizeLogEntry,
  createSimpleLog,
  formatError
};
