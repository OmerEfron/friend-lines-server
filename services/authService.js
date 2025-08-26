const jwt = require('jsonwebtoken');
const userService = require('./userService');
const userValidator = require('./validators/userValidator');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

const authService = {
  async login(username, password) {
    // Validate input data
    userValidator.validateLogin({ username, password });
    
    const user = await userService.findUserByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isValidPassword = await userService.validatePassword(user, password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign(
      { uuid: user.uuid, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  },
  
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  },
  
  async getCurrentUser(token) {
    const decoded = this.verifyToken(token);
    const user = await userService.findUserByUuid(decoded.uuid);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
};

module.exports = authService;
