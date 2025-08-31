# 📱 Push Notifications Setup Guide for Mobile Apps

## Overview

This guide explains how to implement push notifications in your mobile app using the Friend Lines API. The system uses **Firebase Cloud Messaging (FCM)** to deliver notifications to iOS and Android devices.

## 🏗️ System Architecture

```
Mobile App → FCM → Friend Lines API → FCM → Recipient Devices
```

1. **Mobile App** registers device token with the API
2. **API** stores device token in database
3. **API** sends notifications via FCM when events occur
4. **FCM** delivers notifications to recipient devices

## 📋 Prerequisites

### For iOS
- **Apple Developer Account** ($99/year)
- **APNs Authentication Key** or **APNs Certificate**
- **Bundle ID** configured in Apple Developer Console
- **Push Notifications** capability enabled in Xcode

### For Android
- **Google Play Console** account
- **Firebase project** with Android app configured
- **google-services.json** file in your Android project

### For Both Platforms
- **Firebase project** with FCM enabled
- **Server Key** from Firebase Console

## 🔧 Backend Setup (Already Done)

The Friend Lines API is already configured with:
- ✅ Firebase Admin SDK integration
- ✅ Device token management
- ✅ Automatic notification sending
- ✅ Platform detection (iOS/Android/Web)

## 📱 Mobile App Implementation

### 1. Install Required Dependencies

#### Expo (Managed Workflow & Dev Builds)
```bash
npx expo install expo-notifications
npx expo install expo-device
npx expo install expo-constants
```

#### React Native CLI (Only if not using Expo)
```bash
npm install @react-native-firebase/app
npm install @react-native-firebase/messaging
npm install react-native-push-notification
```

### 2. Configure Firebase

#### Add Firebase Configuration

Create `firebase.config.js`:
```javascript
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

#### For Expo Dev Builds (Production-Like Setup)

**To make dev build act like production, you need Firebase configuration:**

1. **Install Firebase dependencies**
   ```bash
   npx expo install @react-native-firebase/app
   npx expo install @react-native-firebase/messaging
   ```

2. **Configure app.json/app.config.js**
   ```json
   {
     "expo": {
       "name": "Friend Lines",
       "slug": "friend-lines-mobile",
       "version": "1.0.0",
       "platforms": ["ios", "android"],
       "plugins": [
         [
           "expo-notifications",
           {
             "icon": "./assets/notification-icon.png",
             "color": "#000000"
           }
         ],
         "@react-native-firebase/app",
         "@react-native-firebase/messaging"
       ]
     }
   }
   ```

3. **Create eas.json for custom builds**
   ```json
   {
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal",
         "ios": {
           "resourceClass": "m-medium"
         },
         "android": {
           "buildType": "apk"
         }
       }
     }
   }
   ```

#### For Production Builds & Production-Like Dev Builds

**You need Firebase configuration for both:**

1. **Set up Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project or use existing one
   - Enable Cloud Messaging

2. **iOS Configuration**
   - **APNs Authentication Key**: Go to Apple Developer Console → Keys → Create new key
   - **Upload to Firebase**: Firebase Console → Project Settings → Cloud Messaging → Upload APNs key
   - **Download**: `GoogleService-Info.plist` from Firebase

3. **Android Configuration**
   - **Add Android app**: Firebase Console → Add app → Android
   - **Download**: `google-services.json` from Firebase
   - **Place file**: In your project root (will be copied during build)

4. **Update build.gradle files**
   ```gradle
   // android/build.gradle
   buildscript {
     dependencies {
       classpath 'com.google.gms:google-services:4.3.15'
     }
   }
   
   // android/app/build.gradle
   apply plugin: 'com.google.gms.google-services'
   ```

5. **Enable Push Notifications**
   - **iOS**: Xcode → Target → Signing & Capabilities → Add "Push Notifications"
   - **Android**: Automatically handled by Firebase plugin

### 3. Request Notification Permissions

```javascript
// src/services/notificationService.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export class NotificationService {
  constructor() {
    this.setupNotificationHandler();
  }

  setupNotificationHandler() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }

  async requestPermissions() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
      }
      
      return true;
    } else {
      console.log('Must use physical device for Push Notifications');
      return false;
    }
  }

  async getExpoPushToken() {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  async getExpoPushToken() {
    // For Expo managed workflow (not needed for production-like dev builds)
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      return token.data;
    } catch (error) {
      console.error('Error getting Expo push token:', error);
      return null;
    }
  }

  async getFCMToken() {
    // For production-like dev builds with Firebase
    try {
      const token = await messaging().getToken();
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }
}
```

### 4. Register Device with API

```javascript
// src/services/apiService.js
import { apiClient } from './apiClient';

export class NotificationAPIService {
  async registerDevice(deviceToken, platform) {
    try {
      const response = await apiClient.post('/api/notifications/register-device', {
        deviceToken,
        platform
      });
      
      if (response.data.success) {
        console.log('Device registered successfully');
        return response.data.data;
      } else {
        throw new Error('Failed to register device');
      }
    } catch (error) {
      console.error('Error registering device:', error);
      throw error;
    }
  }

  async getNotificationHistory() {
    try {
      const response = await apiClient.get('/api/notifications/history');
      return response.data.data.notifications;
    } catch (error) {
      console.error('Error getting notification history:', error);
      return [];
    }
  }
}
```

### 5. Initialize Notifications in App

```javascript
// src/App.js or App.tsx
import React, { useEffect, useRef } from 'react';
import { NotificationService } from './services/notificationService';
import { NotificationAPIService } from './services/apiService';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    initializeNotifications();
    
    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for notification responses (user taps notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      handleNotificationResponse(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const initializeNotifications = async () => {
    const notificationService = new NotificationService();
    const apiService = new NotificationAPIService();
    
    try {
      // Request permissions
      const hasPermission = await notificationService.requestPermissions();
      
      if (hasPermission) {
        // Get device token - use FCM for production-like dev builds
        let deviceToken;
        try {
          // For production-like dev builds, use FCM directly
          deviceToken = await notificationService.getFCMToken();
          console.log('✅ Got FCM token:', deviceToken?.substring(0, 20) + '...');
        } catch (error) {
          console.log('⚠️ FCM token failed, trying Expo as fallback');
          deviceToken = await notificationService.getExpoPushToken();
        }
        
        if (deviceToken) {
          // Register with API
          await apiService.registerDevice(deviceToken, Platform.OS);
          console.log('✅ Device registered for notifications');
        } else {
          console.log('❌ Failed to get device token');
        }
      }
    } catch (error) {
      console.error('❌ Failed to initialize notifications:', error);
    }
  };

  const handleNotificationResponse = (response) => {
    const data = response.notification.request.content.data;
    
    // Handle different notification types
    switch (data.type) {
      case 'newsflash':
        // Navigate to newsflash detail
        navigation.navigate('NewsflashDetail', { id: data.newsflashId });
        break;
      case 'friend_request':
        // Navigate to friends screen
        navigation.navigate('Friends');
        break;
      case 'group_invitation':
        // Navigate to groups screen
        navigation.navigate('Groups');
        break;
      default:
        console.log('Unknown notification type:', data.type);
    }
  };

  return (
    // Your app components
  );
}
```

### 6. Handle Background Notifications

```javascript
// src/services/backgroundNotificationHandler.js
import * as Notifications from 'expo-notifications';

// This function runs when the app is in the background
export async function handleBackgroundNotification(notification) {
  const data = notification.request.content.data;
  
  // You can perform background tasks here
  // For example, update local storage, sync data, etc.
  
  console.log('Background notification received:', data);
  
  // Return a promise to indicate completion
  return Promise.resolve();
}

// Register the background handler
Notifications.setNotificationHandler({
  handleNotification: handleBackgroundNotification,
});
```

## 🔔 Notification Types & Handling

### 1. Newsflash Notifications
```javascript
// When a friend creates a newsflash
{
  "type": "newsflash",
  "authorId": "user-uuid",
  "newsflashId": "newsflash-uuid",
  "content": "Just finished my marathon! 🏃‍♀️"
}
```

## 🚨 **IMPORTANT: Expo Dev Build Setup**

### **Option 1: Production-Like Dev Build (Recommended for You)**

If you want your dev build to act exactly like production:

### 1. **Install Firebase dependencies**
```bash
npx expo install @react-native-firebase/app
npx expo install @react-native-firebase/messaging
```

### 2. **Update your app.json/app.config.js**
```json
{
  "expo": {
    "name": "Friend Lines",
    "slug": "friend-lines-mobile",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#000000"
        }
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/messaging"
    ]
  }
}
```

### 3. **Set up Firebase project**
- Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
- Add iOS and Android apps
- Download `GoogleService-Info.plist` and `google-services.json`
- Place files in project root

### 4. **Rebuild your dev build**
```bash
eas build --profile development --platform all
```

### **Option 2: Expo Managed Dev Build (Simpler but different from production)**

If you want to use Expo's managed service:

### 2. Friend Request Notifications
```javascript
// When someone sends a friend request
{
  "type": "friend_request",
  "senderId": "user-uuid",
  "senderName": "John Doe"
}
```

### 3. Group Invitation Notifications
```javascript
// When invited to a group
{
  "type": "group_invitation",
  "groupId": "group-uuid",
  "groupName": "Family Group",
  "inviterId": "user-uuid"
}
```

## 📱 Platform-Specific Considerations

### iOS
- **Permissions**: Must request explicitly
- **Background Modes**: Configure in Info.plist
- **APNs**: Requires valid certificate/key
- **Silent Notifications**: Support for background processing

### Android
- **Auto-permission**: Granted by default
- **Background Restrictions**: Handle battery optimization
- **Foreground Service**: For persistent notifications
- **Channel Management**: Android 8.0+ notification channels

## 🧪 Testing Notifications

### 1. Test Device Registration
```bash
# Check if device is registered
curl -X GET "https://friend-lines-server.onrender.com/api/notifications/history" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Test Notification Sending
```bash
# Send test notification via Firebase Console
# Go to Firebase Console → Cloud Messaging → Send your first message
```

### 3. Test in Different App States
- **Foreground**: App is open and visible
- **Background**: App is minimized
- **Killed**: App is completely closed

## 🚨 Common Issues & Solutions

### Issue: Expo Dev Build - "FirebaseApp is not initialized" ❌
**Problem:** You're trying to use FCM without proper Firebase setup in Expo dev build
**Solutions:**
- ✅ **Install Firebase dependencies**: `@react-native-firebase/app` and `@react-native-firebase/messaging`
- ✅ **Add Firebase plugins** to app.json
- ✅ **Set up Firebase project** and download config files
- ✅ **Rebuild dev build** after configuration changes
- ✅ **Use FCM directly** instead of Expo push tokens

**Your Specific Error Fix (Production-Like Dev Build):**
```javascript
// ✅ CORRECT - For production-like dev builds with Firebase
async getFCMToken() {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

// ✅ CORRECT - Initialize Firebase first
import messaging from '@react-native-firebase/messaging';

// In your App.js, initialize Firebase before using messaging
useEffect(() => {
  // Firebase is auto-initialized by the plugin
  // But you can add custom initialization if needed
  initializeNotifications();
}, []);

// In your initialization, use FCM directly:
let deviceToken;
try {
  // For production-like dev builds, use FCM directly
  deviceToken = await notificationService.getFCMToken();
  console.log('✅ Got FCM token');
} catch (error) {
  console.log('⚠️ FCM token failed, trying Expo as fallback');
  deviceToken = await notificationService.getExpoPushToken();
}
```

### Issue: Notifications not received
**Solutions:**
- Check device token registration
- Verify Expo project configuration
- Ensure permissions are granted
- Check device internet connection

### Issue: iOS notifications not working
**Solutions:**
- Verify APNs configuration (if using custom Firebase)
- Check bundle ID matches
- Ensure push capability is enabled
- Test with physical device (not simulator)

### Issue: Android notifications not showing
**Solutions:**
- Check notification channels
- Verify Expo configuration
- Check battery optimization settings
- Ensure app is not force-stopped

### Issue: Background notifications not working
**Solutions:**
- Configure background modes
- Handle notification responses properly
- Check app state management
- Verify background task permissions

## 📊 Monitoring & Debugging

### 1. Enable Debug Logging
```javascript
// Enable FCM debug logging
if (__DEV__) {
  console.log('FCM Debug Mode Enabled');
  // Add your debug logging here
}
```

### 2. Check Notification Status
```javascript
// Check notification permissions
const permissions = await Notifications.getPermissionsAsync();
console.log('Notification permissions:', permissions);

// Check notification settings
const settings = await Notifications.getNotificationSettingsAsync();
console.log('Notification settings:', settings);
```

### 3. Monitor Token Refresh
```javascript
// Listen for token refresh
messaging().onTokenRefresh(token => {
  console.log('FCM token refreshed:', token);
  // Re-register with your API
  apiService.registerDevice(token, Platform.OS);
});
```

## 🔒 Security Considerations

### 1. Token Validation
- Validate device tokens on the server
- Implement token expiration
- Secure token storage

### 2. User Consent
- Always request permission before sending
- Allow users to opt-out
- Provide clear privacy policy

### 3. Data Privacy
- Minimize data in notifications
- Encrypt sensitive information
- Follow GDPR/CCPA guidelines

## 📚 Additional Resources

### Official Documentation
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [React Native Firebase](https://rnfirebase.io/messaging/usage)

### Testing Tools
- [Firebase Console](https://console.firebase.google.com/)
- [APNs Tester](https://github.com/uniqname/apns-tester)
- [FCM Tester](https://firebase.google.com/docs/cloud-messaging/test-message)

### Best Practices
- [Apple Push Notification Guidelines](https://developer.apple.com/notifications/)
- [Android Notification Guidelines](https://developer.android.com/guide/topics/ui/notifiers/notifications)
- [FCM Best Practices](https://firebase.google.com/docs/cloud-messaging/best-practices)

## 🎯 Next Steps

### For Production-Like Expo Dev Builds (Your Goal)
1. **Install Firebase dependencies** (`@react-native-firebase/app`, `@react-native-firebase/messaging`)
2. **Set up Firebase project** and download config files
3. **Update app.json** with Firebase plugins
4. **Rebuild dev build** with `eas build --profile development`
5. **Use FCM directly** like in production
6. **Test notifications** on physical devices

### For Production
1. **Use the same Firebase setup** (no changes needed)
2. **Install required dependencies** in your mobile app
3. **Implement notification permissions** and token retrieval
4. **Register device** with the Friend Lines API
5. **Handle incoming notifications** in different app states
6. **Test thoroughly** on both iOS and Android devices
7. **Monitor and debug** any issues that arise

## 📞 Support

If you encounter issues:
1. Check the [Firebase Console](https://console.firebase.google.com/) for errors
2. Review the [Friend Lines API documentation](https://friend-lines-server.onrender.com/)
3. Check device logs for detailed error messages
4. Verify all configuration steps are completed correctly

---

**Happy coding! 🚀**

This guide should get you up and running with push notifications in your mobile app using the Friend Lines API.
