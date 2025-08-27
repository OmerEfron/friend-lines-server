# Friend Lines API Reference

## Overview
Friend Lines is a social networking API that enables user management, friendships, groups, newsflashes, and push notifications.

**Base URL**: `https://friend-lines-server.onrender.com`
**Authentication**: JWT Bearer Token
**Content-Type**: `application/json`

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Health Check
- **GET** `/api/health`
  - **Description**: Check server health and status
  - **Auth Required**: No
  - **Response**: Server status, uptime, environment info

### User Management
- **POST** `/api/users/register`
  - **Description**: Create new user account
  - **Auth Required**: No
  - **Body**: `{ username, fullName, email, password }`
  - **Validation**: username (3-30 chars, alphanumeric + underscore), email (valid format), password (min 6 chars)

- **GET** `/api/users/search?q=<query>&page=<page>&limit=<limit>`
  - **Description**: Search users by username, full name, or email
  - **Auth Required**: Yes
  - **Query Params**: q (required), page (default: 1), limit (default: 20, max: 100)
  - **Response**: User list with pagination

### Authentication
- **POST** `/api/auth/login`
  - **Description**: User login to get JWT token
  - **Auth Required**: No
  - **Body**: `{ username, password }`
  - **Response**: User data and JWT token

### Friendships
- **POST** `/api/friendships/request`
  - **Description**: Send friend request to another user
  - **Auth Required**: Yes
  - **Body**: `{ friendId }`
  - **Response**: Success confirmation

- **POST** `/api/friendships/accept`
  - **Description**: Accept pending friend request
  - **Auth Required**: Yes
  - **Body**: `{ friendId }`
  - **Response**: Success confirmation

- **GET** `/api/friendships/list?page=<page>&limit=<limit>`
  - **Description**: Get list of current friends
  - **Auth Required**: Yes
  - **Query Params**: page (default: 1), limit (default: 20, max: 100)
  - **Response**: Friends list with pagination

- **GET** `/api/friendships/requests?page=<page>&limit=<limit>`
  - **Description**: Get pending friend requests
  - **Auth Required**: Yes
  - **Query Params**: page (default: 1), limit (default: 20, max: 100)
  - **Response**: Pending requests with pagination

- **DELETE** `/api/friendships/:friendId`
  - **Description**: Delete friendship
  - **Auth Required**: Yes
  - **Response**: Success confirmation

### Groups
- **POST** `/api/groups/create`
  - **Description**: Create new group
  - **Auth Required**: Yes
  - **Body**: `{ name, description? }`
  - **Validation**: name (required, max 100 chars), description (optional, max 500 chars)

- **POST** `/api/groups/invite`
  - **Description**: Invite user to group
  - **Auth Required**: Yes
  - **Body**: `{ groupId, invitedUserId }`
  - **Response**: Success confirmation

- **POST** `/api/groups/join`
  - **Description**: Accept group invitation
  - **Auth Required**: Yes
  - **Body**: `{ groupId }`
  - **Response**: Success confirmation

- **GET** `/api/groups/my-groups?page=<page>&limit=<limit>`
  - **Description**: Get user's groups
  - **Auth Required**: Yes
  - **Query Params**: page (default: 1), limit (default: 20, max: 100)
  - **Response**: Groups list with pagination

- **GET** `/api/groups/invitations?page=<page>&limit=<limit>`
  - **Description**: Get pending group invitations
  - **Auth Required**: Yes
  - **Query Params**: page (default: 1), limit (default: 20, max: 100)
  - **Response**: Pending invitations with pagination

- **GET** `/api/groups/:groupId/members?page=<page>&limit=<limit>`
  - **Description**: Get group members
  - **Auth Required**: Yes
  - **Query Params**: page (default: 1), limit (default: 20, max: 100)
  - **Response**: Members list with pagination

- **DELETE** `/api/groups/:groupId/leave`
  - **Description**: Leave group
  - **Auth Required**: Yes
  - **Response**: Success confirmation

### Newsflashes
- **POST** `/api/newsflashes/create`
  - **Description**: Create new newsflash
  - **Auth Required**: Yes
  - **Body**: `{ content, targetType, targetId? }`
  - **Validation**: content (required, max 100 chars), targetType (friends|group), targetId (required if targetType is group)

- **GET** `/api/newsflashes/my-feed?page=<page>&limit=<limit>`
  - **Description**: Get user's personalized newsflash feed
  - **Auth Required**: Yes
  - **Query Params**: page (default: 1), limit (default: 20, max: 100)
  - **Response**: Newsflashes with pagination

- **GET** `/api/newsflashes/author/:authorId?page=<page>&limit=<limit>`
  - **Description**: Get newsflashes by specific author
  - **Auth Required**: Yes
  - **Query Params**: page (default: 1), limit (default: 20, max: 100)
  - **Response**: Author's newsflashes with pagination

- **GET** `/api/newsflashes/group/:groupId?page=<page>&limit=<limit>`
  - **Description**: Get newsflashes from specific group
  - **Auth Required**: Yes
  - **Query Params**: page (default: 1), limit (default: 20, max: 100)
  - **Response**: Group newsflashes with pagination

- **DELETE** `/api/newsflashes/:newsflashId`
  - **Description**: Delete newsflash
  - **Auth Required**: Yes
  - **Response**: Success confirmation

### Notifications
- **POST** `/api/notifications/register-device`
  - **Description**: Register device for push notifications
  - **Auth Required**: Yes
  - **Body**: `{ deviceToken, platform? }`
  - **Validation**: deviceToken (required), platform (ios|android|web, default: android)

- **GET** `/api/notifications/history`
  - **Description**: Get notification history
  - **Auth Required**: Yes
  - **Response**: Notifications list

## Data Models

### User
```json
{
  "uuid": "string (UUID)",
  "username": "string (3-30 chars, alphanumeric + underscore)",
  "fullName": "string (max 100 chars)",
  "email": "string (valid email format)",
  "createdAt": "string (ISO date-time)",
  "updatedAt": "string (ISO date-time)"
}
```

### Group
```json
{
  "_id": "string (MongoDB ObjectId)",
  "name": "string (max 100 chars)",
  "description": "string (max 500 chars, optional)",
  "creatorId": "string (UUID)",
  "members": ["string (UUID)"],
  "createdAt": "string (ISO date-time)",
  "updatedAt": "string (ISO date-time)"
}
```

### Newsflash
```json
{
  "_id": "string (MongoDB ObjectId)",
  "authorId": "string (UUID)",
  "content": "string (max 100 chars)",
  "targetType": "string (friends|group)",
  "targetId": "string (UUID, optional for friends)",
  "isDeleted": "boolean",
  "createdAt": "string (ISO date-time)",
  "updatedAt": "string (ISO date-time)"
}
```

### Friendship Request
```json
{
  "_id": "string (MongoDB ObjectId)",
  "user1Id": "string (UUID, sender)",
  "user2Id": "string (UUID, recipient)",
  "status": "string (pending|accepted|rejected)",
  "createdAt": "string (ISO date-time)",
  "updatedAt": "string (ISO date-time)"
}
```

### Pagination
```json
{
  "page": "integer (current page)",
  "limit": "integer (items per page)",
  "total": "integer (total items)",
  "totalPages": "integer (total pages)"
}
```

### Success Response
```json
{
  "success": "boolean (true)",
  "data": "object (response data)",
  "message": "string (optional success message)"
}
```

### Error Response
```json
{
  "success": "boolean (false)",
  "message": "string (error message)",
  "error": "string (error type, optional)",
  "statusCode": "integer (HTTP status code, optional)"
}
```

## Common Response Codes
- **200**: Success
- **400**: Bad Request (validation error, invalid data)
- **401**: Unauthorized (authentication required, invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource not found)
- **500**: Internal Server Error (server error)

## Pagination
All list endpoints support pagination with query parameters:
- `page`: Page number (default: 1, minimum: 1)
- `limit`: Items per page (default: 20, minimum: 1, maximum: 100)

## Rate Limiting
API calls are rate-limited to prevent abuse. Implement exponential backoff for retries.

## Examples

### Register User
```bash
curl -X POST "https://friend-lines-server.onrender.com/api/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "password": "securepass123"
  }'
```

### Login
```bash
curl -X POST "https://friend-lines-server.onrender.com/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "securepass123"
  }'
```

### Search Users (with auth)
```bash
curl -X GET "https://friend-lines-server.onrender.com/api/users/search?q=john&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Newsflash
```bash
curl -X POST "https://friend-lines-server.onrender.com/api/newsflashes/create" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello friends! This is my newsflash.",
    "targetType": "friends"
  }'
```

## Notes for AI Agents
- All UUIDs are in standard UUID v4 format
- Timestamps are in ISO 8601 format (UTC)
- Authentication tokens expire after 24 hours
- Maximum content length for newsflashes is 100 characters
- Pagination limits are enforced server-side
- Error responses include descriptive messages
- All endpoints return consistent response formats
