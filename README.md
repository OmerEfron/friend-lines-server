# Friend Lines - Express.js App

A lightweight Express.js application with a modular structure following best practices.

## Project Structure

```
├── app.js                 # Main application file
├── routes/               # Route definitions
│   ├── healthRoutes.js
│   ├── userRoutes.js
│   ├── authRoutes.js
│   ├── friendshipRoutes.js
│   └── groupRoutes.js
├── controllers/          # Request handlers
│   ├── healthController.js
│   ├── userController.js
│   ├── authController.js
│   ├── friendshipController.js
│   └── groupController.js
├── services/            # Business logic
│   ├── healthService.js
│   ├── userService.js
│   ├── authService.js
│   ├── friendshipService.js
│   ├── groupService.js
│   └── validators/      # Input validation
│       ├── userValidator.js
│       ├── friendshipValidator.js
│       └── groupValidator.js
├── middlewares/         # Custom middleware
│   ├── errorHandler.js
│   └── authMiddleware.js
├── package.json
└── README.md
```

## Features

- Modular architecture with separate concerns
- Health check endpoint
- Centralized error handling
- Proper middleware ordering
- Async/await with error handling

## Installation

```bash
npm install
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Returns application health status

### Authentication
- **POST** `/api/auth/login` - User login
- **POST** `/api/users/register` - User registration
- **GET** `/api/users/profile` - Get user profile (protected)

### Friendships
- **POST** `/api/friendships/request` - Send friend request
- **POST** `/api/friendships/accept` - Accept friend request
- **DELETE** `/api/friendships/:friendId` - Delete friendship
- **GET** `/api/friendships/list` - Get friends list
- **GET** `/api/friendships/requests` - Get pending friend requests

### Groups
- **POST** `/api/groups/create` - Create new group
- **POST** `/api/groups/invite` - Invite user to group
- **POST** `/api/groups/join` - Accept group invitation
- **DELETE** `/api/groups/:groupId/leave` - Leave group
- **GET** `/api/groups/:groupId/members` - Get group members
- **GET** `/api/groups/my-groups` - Get user's groups
- **GET** `/api/groups/invitations` - Get pending group invitations

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (default: development)
- `JWT_SECRET` - JWT secret key (default: 'your-secret-key')
