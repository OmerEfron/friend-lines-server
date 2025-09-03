const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/database');
const requestLogger = require('./middlewares/requestLogger');
const healthRoutes = require('./routes/healthRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const friendshipRoutes = require('./routes/friendshipRoutes');
const groupRoutes = require('./routes/groupRoutes');
const newsflashRoutes = require('./routes/newsflashRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware order: body parsers, custom middleware, routes, error handlers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware (must be after body parsers)
app.use(requestLogger);

// Serve static files (API documentation)
app.use(express.static('public'));

// Routes
app.use('/api', healthRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/friendships', friendshipRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/newsflashes', newsflashRoutes);

// Root route - serve API documentation
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// AI-friendly documentation routes
app.get('/api/docs/openapi.yaml', (req, res) => {
  res.setHeader('Content-Type', 'text/yaml');
  res.sendFile(path.join(__dirname, 'public', 'openapi.yaml'));
});

app.get('/api/docs/reference.md', (req, res) => {
  res.setHeader('Content-Type', 'text/markdown');
  res.sendFile(path.join(__dirname, 'public', 'api-reference.md'));
});

app.get('/api/docs/endpoints.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, 'public', 'endpoints-summary.txt'));
});

// AI documentation index
app.get('/api/docs', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, 'public', 'ai-docs-index.json'));
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  const logger = require('./services/utils/logger');
  logger.info('SYSTEM', 'Server started successfully', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
