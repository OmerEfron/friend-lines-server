# Friend Lines - Express.js App

A lightweight Express.js application with a modular structure following best practices.

## Project Structure

```
├── app.js                 # Main application file
├── routes/               # Route definitions
│   └── healthRoutes.js
├── controllers/          # Request handlers
│   └── healthController.js
├── services/            # Business logic
│   └── healthService.js
├── middlewares/         # Custom middleware
│   └── errorHandler.js
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

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (default: development)
- `JWT_SECRET` - JWT secret key (default: 'your-secret-key')
