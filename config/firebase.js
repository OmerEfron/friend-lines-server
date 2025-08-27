const admin = require('firebase-admin');

// Initialize Firebase Admin
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  // Production: Use base64 encoded service account from environment
  try {
    const serviceAccountJson = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString();
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch (error) {
    console.error('Failed to parse Firebase service account from environment:', error.message);
    process.exit(1);
  }
} else {
  // Development: Use local file
  try {
    serviceAccount = require('../firebase-service-account.json');
  } catch (error) {
    console.warn('Firebase service account not found. Firebase features will be disabled.');
    return;
  }
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || 'friend-lines-notifications'
  });
}

module.exports = admin;
