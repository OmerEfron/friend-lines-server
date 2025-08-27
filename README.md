# 🚀 Friend Lines - Social Networking Platform

A modern, scalable social networking API built with Express.js, MongoDB, and Firebase Cloud Messaging for push notifications.

## ✨ Features

### 🔐 **Authentication & User Management**
- **JWT-based authentication** with secure token management
- **User registration** with email, username, and password validation
- **Secure password hashing** using bcrypt.js
- **UUID-based user identification** for enhanced security
- **User search** with pagination and multi-field search capabilities

### 🤝 **Friendship System**
- **Friend requests** - send and manage friend invitations
- **Request acceptance/rejection** workflow
- **Friendship status tracking** (pending, accepted, blocked)
- **Friends list management** with real-time updates
- **Bidirectional friendship** validation

### 👥 **Group Management**
- **Group creation** with customizable names and descriptions
- **Member invitations** system for expanding groups
- **Group membership** management (join, leave, roles)
- **Group-specific content** and newsflashes
- **Member list** with detailed user information

### 📰 **Newsflash System**
- **Content creation** with 100-character limit
- **Targeted sharing** (friends only or specific groups)
- **Real-time updates** across the platform
- **Content moderation** and deletion capabilities
- **Author attribution** and timestamp tracking

### 🔔 **Push Notifications**
- **Firebase Cloud Messaging (FCM)** integration
- **Cross-platform support** (iOS, Android, Web)
- **Device token management** for multiple devices
- **Smart notification routing** based on relationships
- **Newsflash notifications** to friends and group members

### 📊 **Advanced Features**
- **Pagination** for all list endpoints (configurable page size)
- **Search functionality** across users and content
- **Real-time logging** with structured JSON output
- **Performance monitoring** and request tracking
- **Error handling** with detailed error messages

## 🏗️ Architecture

### **Backend Stack**
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt.js
- **Notifications**: Firebase Admin SDK for FCM
- **Logging**: Custom structured logging system

### **Project Structure**
```
friend-lines/
├── config/                 # Configuration files
│   ├── database.js        # MongoDB connection
│   ├── firebase.js        # Firebase configuration
│   └── logging.js         # Logging configuration
├── controllers/            # HTTP request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── friendshipController.js
│   ├── groupController.js
│   ├── newsflashController.js
│   └── notificationController.js
├── middlewares/            # Express middleware
│   ├── authMiddleware.js  # JWT authentication
│   ├── errorHandler.js    # Error handling
│   └── requestLogger.js   # Request logging
├── models/                 # MongoDB schemas
│   ├── User.js
│   ├── Friendship.js
│   ├── Group.js
│   ├── GroupInvitation.js
│   ├── Newsflash.js
│   └── DeviceToken.js
├── routes/                 # API route definitions
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── friendshipRoutes.js
│   ├── groupRoutes.js
│   ├── newsflashRoutes.js
│   └── notificationRoutes.js
├── services/               # Business logic
│   ├── authService.js
│   ├── userService.js
│   ├── friendshipService.js
│   ├── groupService.js
│   ├── newsflashService.js
│   ├── notificationService.js
│   ├── fcmService.js
│   ├── validators/        # Input validation
│   └── utils/             # Utility functions
│       ├── logger.js
│       └── logFormatter.js
├── public/                 # Static files & documentation
│   ├── index.html         # API documentation
│   ├── openapi.json       # OpenAPI specification
│   └── api-endpoints.json # Endpoints reference
├── scripts/                # Deployment scripts
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Local development
├── render.yaml            # Infrastructure as Code
└── package.json           # Dependencies & scripts
```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- MongoDB (local or Atlas)
- Firebase project (for notifications)
- Git

### **Local Development**
```bash
# Clone the repository
git clone https://github.com/OmerEfron/friend-lines-server.git
cd friend-lines-server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### **Docker Development**
```bash
# Start with Docker Compose
npm run docker:compose

# Or use the quick start script
./scripts/quick-start.sh
```

### **Environment Variables**
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Firebase (for notifications)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_BASE64=base64-encoded-service-account

# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=INFO
```

## 📚 API Documentation

### **Live Documentation**
- **Interactive Docs**: [https://friend-lines-server.onrender.com/](https://friend-lines-server.onrender.com/)
- **OpenAPI Spec**: [https://friend-lines-server.onrender.com/openapi.json](https://friend-lines-server.onrender.com/openapi.json)
- **Endpoints List**: [https://friend-lines-server.onrender.com/api-endpoints.json](https://friend-lines-server.onrender.com/api-endpoints.json)

### **Key Endpoints**
```bash
# Health Check
GET /api/health

# Authentication
POST /api/auth/login
POST /api/users/register

# Users
GET /api/users/search?q=term&page=1&limit=20

# Friendships
POST /api/friendships/request
POST /api/friendships/accept
GET /api/friendships/list

# Groups
POST /api/groups/create
POST /api/groups/invite
GET /api/groups/my-groups

# Newsflashes
POST /api/newsflashes/create
GET /api/newsflashes/my-feed

# Notifications
POST /api/notifications/register-device
```

## 🐳 Deployment

### **Docker Deployment**
```bash
# Build and run locally
npm run docker:build
npm run docker:run

# Or use deployment script
./scripts/deploy.sh
```

### **Production Deployment (Render)**
1. **Fork/Clone** this repository
2. **Set up GitHub Secrets** for CI/CD
3. **Configure Render** using `render.yaml`
4. **Deploy automatically** via GitHub Actions

### **Infrastructure as Code**
- **Render**: `render.yaml` for service configuration
- **GitHub Actions**: `.github/workflows/deploy.yml` for CI/CD
- **Docker**: Multi-stage production Dockerfile
- **Environment**: Production-ready configuration

## 🔧 Development

### **Available Scripts**
```bash
# Development
npm run dev          # Start development server
npm run start        # Start production server

# Docker
npm run docker:build # Build Docker image
npm run docker:run   # Run Docker container
npm run docker:compose # Start with Docker Compose
npm run docker:stop  # Stop containers
npm run docker:logs  # View container logs

# Deployment
npm run deploy:local # Local deployment setup
npm run quick:start  # Quick local setup
```

### **Code Quality**
- **File size limit**: Maximum 150 lines per file
- **Modular architecture**: Separation of concerns
- **Error handling**: Centralized error management
- **Logging**: Structured JSON logging
- **Validation**: Input validation middleware

### **Testing**
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suites
npm run test:unit
npm run test:integration
```

## 📱 Mobile App Integration

### **Push Notifications**
- **FCM Integration**: Ready for iOS/Android apps
- **Device Registration**: Automatic token management
- **Smart Routing**: Notifications based on relationships
- **Real-time Delivery**: Instant push notifications

### **API Consumption**
- **RESTful Design**: Standard HTTP methods
- **JWT Authentication**: Secure API access
- **Pagination**: Efficient data loading
- **Search**: User discovery features

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt.js with salt
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin request handling
- **Rate Limiting**: Abuse prevention
- **Environment Variables**: Secure configuration management

## 📊 Monitoring & Logging

### **Structured Logging**
- **JSON Format**: Machine-readable logs
- **Request Context**: Request ID tracking
- **Performance Metrics**: Response time monitoring
- **Error Tracking**: Detailed error information
- **Sensitive Data**: Automatic redaction

### **Health Monitoring**
- **Health Endpoint**: `/api/health`
- **Uptime Tracking**: Server performance metrics
- **Environment Info**: Configuration validation
- **Database Status**: Connection monitoring

## 🌟 Key Benefits

### **For Developers**
- **Clean Architecture**: Easy to understand and extend
- **Comprehensive Docs**: Self-service API documentation
- **Docker Ready**: Consistent development environments
- **CI/CD Pipeline**: Automated testing and deployment

### **For Users**
- **Real-time Updates**: Instant notifications
- **Social Features**: Friends, groups, and newsflashes
- **Cross-platform**: Works on any device
- **Scalable**: Handles growth automatically

### **For Business**
- **Cost-effective**: Free tier deployment options
- **Scalable**: Auto-scaling infrastructure
- **Maintainable**: Clean, modular codebase
- **Extensible**: Easy to add new features

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### **Development Guidelines**
- Keep files under 150 lines
- Follow modular architecture
- Add tests for new features
- Update documentation
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Live API Docs](https://friend-lines-server.onrender.com/)
- **Issues**: [GitHub Issues](https://github.com/OmerEfron/friend-lines-server/issues)
- **Discussions**: [GitHub Discussions](https://github.com/OmerEfron/friend-lines-server/discussions)

## 🚀 Roadmap

### **Planned Features**
- [ ] **Real-time Chat**: WebSocket-based messaging
- [ ] **File Uploads**: Image and document sharing
- [ ] **Advanced Search**: Elasticsearch integration
- [ ] **Analytics**: User engagement metrics
- [ ] **Mobile SDK**: Native mobile libraries

### **Performance Improvements**
- [ ] **Caching**: Redis integration
- [ ] **CDN**: Static asset optimization
- [ ] **Database**: Query optimization
- [ ] **Load Balancing**: Multiple server instances

---

**Built with ❤️ using Express.js, MongoDB, and Firebase**

*Friend Lines - Connecting friends through meaningful interactions*
