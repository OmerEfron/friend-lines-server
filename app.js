const express = require('express');
const healthRoutes = require('./routes/healthRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const friendshipRoutes = require('./routes/friendshipRoutes');
const groupRoutes = require('./routes/groupRoutes');
const newsflashRoutes = require('./routes/newsflashRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware order: body parsers, custom middleware, routes, error handlers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/friendships', friendshipRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/newsflashes', newsflashRoutes);

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
