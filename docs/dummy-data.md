# Friend Lines - Dummy Data & Test Credentials

This document contains all the test data and credentials for the Friend Lines application. Use this data to test all features of the app.

## 🚀 Quick Start

The database has been populated with comprehensive test data. All users have the same password: `password123`

## 👥 Test Users

| Username | Full Name | Email | UUID | Role |
|----------|-----------|-------|------|------|
| `alice_dev` | Alice Johnson | alice@example.com | `d621e6fc-8d30-466e-a7a4-37bb1416e1b5` | Developer |
| `bob_coder` | Bob Smith | bob@example.com | `07f3bf4d-2343-4330-b467-b435cc8afd4c` | Coder |
| `charlie_tech` | Charlie Brown | charlie@example.com | `a189e434-1181-4f89-8ff7-267a7450bbc1` | Tech Enthusiast |
| `diana_eng` | Diana Prince | diana@example.com | `11a32fa4-6177-4a57-a18c-3305a6d72a6e` | Engineer |
| `eve_designer` | Eve Wilson | eve@example.com | `a18cac68-7974-46ab-b1fe-4cb21913c2ef` | Designer |
| `frank_admin` | Frank Miller | frank@example.com | `5bc5cdff-cfdd-4ccb-bc16-18f31e636f5b` | Admin |

**Password for all users:** `password123`

## 🤝 Friendship Network

The following friendships have been created (all are accepted):

- Alice ↔ Bob
- Alice ↔ Charlie  
- Bob ↔ Diana
- Charlie ↔ Eve
- Diana ↔ Frank
- Eve ↔ Alice
- Frank ↔ Bob
- Charlie ↔ Diana
- Eve ↔ Frank

## 👥 Groups

### 1. Tech Enthusiasts
- **ID:** `68b89cdebcde70c24be313c9`
- **Creator:** Alice Johnson (alice_dev)
- **Members:** Alice, Bob, Charlie, Diana
- **Description:** A group for discussing the latest in technology and programming

### 2. Coffee Lovers  
- **ID:** `68b89cdebcde70c24be313cb`
- **Creator:** Bob Smith (bob_coder)
- **Members:** Bob, Alice, Eve, Frank
- **Description:** For people who love coffee and coffee shop discussions

### 3. Book Club
- **ID:** `68b89cdfbcde70c24be313cd`
- **Creator:** Charlie Brown (charlie_tech)
- **Members:** Charlie, Bob, Diana, Eve
- **Description:** Monthly book discussions and recommendations

### 4. Fitness Buddies
- **ID:** `68b89cdfbcde70c24be313cf`
- **Creator:** Diana Prince (diana_eng)
- **Members:** Diana, Alice, Charlie, Frank
- **Description:** Motivation and tips for staying fit and healthy

## 📧 Group Invitations (Pending)

1. **Alice** invited **Eve** to join **Tech Enthusiasts**
2. **Bob** invited **Charlie** to join **Coffee Lovers**

## 📰 Newsflashes

| Author | Content | Target Type | Target |
|--------|---------|-------------|---------|
| Alice | "Just finished reading an amazing book about AI!" | friends | - |
| Bob | "Anyone up for a coffee meetup this weekend?" | friends | - |
| Charlie | "New JavaScript framework looks promising!" | group | Tech Enthusiasts |
| Diana | "Great workout session today!" | friends | - |
| Eve | "Book recommendation: "Clean Code" by Robert Martin" | group | Book Club |
| Frank | "Coffee shop downtown has amazing pastries!" | group | Coffee Lovers |
| Alice | "Morning run completed! 5K in 25 minutes 🏃‍♂️" | group | Fitness Buddies |
| Bob | "Working on a new side project, excited to share soon!" | friends | - |

## 📱 Device Tokens (for Push Notifications)

- **Alice (iOS):** `dummy_fcm_token_alice_123`
- **Bob (Android):** `dummy_fcm_token_bob_456`
- **Charlie (Web):** `dummy_fcm_token_charlie_789`

## 🧪 Testing Scenarios

### Authentication Flow
1. **Login as Alice:** `alice_dev` / `password123`
2. **Login as Bob:** `bob_coder` / `password123`
3. **Test token refresh and logout**

### Friendship Features
1. **View friends list** - Each user has 2-3 friends
2. **Send friend requests** - Try sending requests between non-friends
3. **Accept/decline requests** - Use the pending invitations
4. **Delete friendships** - Test removing friends

### Group Features
1. **View my groups** - Each user is in 2-3 groups
2. **View group members** - Check member lists
3. **Create new groups** - Test group creation
4. **Invite users** - Send group invitations
5. **Accept group invitations** - Use the pending invitations
6. **Leave groups** - Test leaving groups

### Newsflash Features
1. **View my feed** - See friends' newsflashes
2. **View group newsflashes** - Check group-specific content
3. **Create newsflashes** - Post to friends or groups
4. **View by author** - See specific user's posts
5. **Delete newsflashes** - Test deletion (only author can delete)

### Notification Features
1. **Register device tokens** - Test FCM registration
2. **View notification history** - Check notification logs
3. **Test push notifications** - Create content that triggers notifications

## 🔗 API Endpoints to Test

### Authentication
- `POST /api/auth/login` - Login with any user credentials
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/search?q=alice` - Search for users

### Friendships
- `GET /api/friendships/list` - Get friends list
- `GET /api/friendships/requests` - Get pending requests
- `POST /api/friendships/request` - Send friend request
- `POST /api/friendships/accept` - Accept friend request
- `DELETE /api/friendships/:friendId` - Delete friendship

### Groups
- `GET /api/groups/my-groups` - Get user's groups
- `GET /api/groups/invitations` - Get group invitations
- `GET /api/groups/:groupId/members` - Get group members
- `POST /api/groups/create` - Create new group
- `POST /api/groups/invite` - Invite user to group
- `POST /api/groups/join` - Accept group invitation
- `DELETE /api/groups/:groupId/leave` - Leave group

### Newsflashes
- `GET /api/newsflashes/my-feed` - Get user's newsfeed
- `GET /api/newsflashes/author/:authorId` - Get newsflashes by author
- `GET /api/newsflashes/group/:groupId` - Get group newsflashes
- `POST /api/newsflashes/create` - Create newsflash
- `DELETE /api/newsflashes/:newsflashId` - Delete newsflash

### Notifications
- `POST /api/notifications/register` - Register device for notifications
- `GET /api/notifications/history` - Get notification history

## 🎯 Sample API Calls

### Login as Alice
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice_dev", "password": "password123"}'
```

### Get Alice's Friends
```bash
curl -X GET http://localhost:3000/api/friendships/list \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create a Newsflash
```bash
curl -X POST http://localhost:3000/api/newsflashes/create \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Testing the API!", "targetType": "friends"}'
```

### Get Group Newsflashes
```bash
curl -X GET http://localhost:3000/api/newsflashes/group/68b89cdebcde70c24be313c9 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔄 Re-populate Database

To clean and re-populate the database with fresh dummy data:

```bash
export $(cat .env | xargs) && node scripts/populate-dummy-data.js
```

## 📝 Notes

- All users have the same password: `password123`
- The friendship network is designed to test various scenarios
- Groups have overlapping memberships to test complex relationships
- Newsflashes are distributed across different target types
- Device tokens are set up for testing push notifications
- All data is realistic and follows the app's business logic

## 🚨 Security Note

These are test credentials only. Never use these credentials in production or share them publicly. The dummy data is designed for development and testing purposes only.
