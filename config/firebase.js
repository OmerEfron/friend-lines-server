const admin = require('firebase-admin');

// Initialize Firebase Admin
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  // Production: Use base64 encoded service account from environment
  try {
    const serviceAccountJson = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString();
    serviceAccount = JSON.parse(serviceAccountJson);
    console.log('Firebase: Using service account from environment variables');
  } catch (error) {
    console.error('Failed to parse Firebase service account from environment:', error.message);
    process.exit(1);
  }
} else {
  // Development: Use local file
  try {
    serviceAccount = require('../firebase-service-account.json');
    console.log('Firebase: Using local service account file');
  } catch (error) {
    console.warn('Firebase service account not found. Firebase features will be disabled.');
    console.error('Error loading Firebase service account:', error.message);
    return;
  }
}

if (serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || 'friend-lines-notifications'
    });
    console.log('Firebase Admin SDK initialized successfully');
    console.log('Project ID:', process.env.FIREBASE_PROJECT_ID || 'friend-lines-notifications');
    
    // Test if messaging is available
    try {
      const messaging = admin.messaging();
      console.log('Firebase Messaging service is available');
    } catch (error) {
      console.error('Firebase Messaging service error:', error.message);
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error.message);
    process.exit(1);
  }
} else {
  console.warn('Firebase Admin SDK not initialized - no service account available');
}

module.exports = admin;
