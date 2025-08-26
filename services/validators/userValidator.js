const userValidator = {
  validateRegistration(userData) {
    const { username, fullName, email, password } = userData;
    const errors = [];
    
    if (!username || username.trim().length === 0) {
      errors.push('Username is required');
    }
    
    if (!fullName || fullName.trim().length === 0) {
      errors.push('Full name is required');
    }
    
    if (!email || email.trim().length === 0) {
      errors.push('Email is required');
    }
    
    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    return true;
  },
  
  validateLogin(credentials) {
    const { username, password } = credentials;
    const errors = [];
    
    if (!username || username.trim().length === 0) {
      errors.push('Username is required');
    }
    
    if (!password || password.trim().length === 0) {
      errors.push('Password is required');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    return true;
  }
};

module.exports = userValidator;
