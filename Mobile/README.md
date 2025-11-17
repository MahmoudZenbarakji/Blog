# React Native Mobile App

This is a React Native mobile application that replicates all the functionality from the Frontend React web app.

## Features

- **Authentication**
  - Login screen
  - Register screen
  - Token-based authentication using AsyncStorage

- **Home Screen**
  - View all posts
  - Create new posts with title, body, and image
  - View comments for each post
  - Pull to refresh functionality

- **Profile Screen**
  - View user profile information
  - Logout functionality

- **Navigation**
  - Stack navigation for auth screens
  - Bottom tab navigation for main app screens
  - Automatic navigation based on authentication status

## Prerequisites

- Node.js (v18 or higher)
- React Native development environment set up
  - For iOS: Xcode and CocoaPods
  - For Android: Android Studio and Android SDK
- Backend server running on `http://localhost:3000`

## Installation

1. Navigate to the Mobile directory:
```bash
cd Mobile
```

2. Install dependencies:
```bash
npm install
```

3. For iOS, install CocoaPods:
```bash
cd ios && pod install && cd ..
```

## Running the App

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Start Metro Bundler
```bash
npm start
```

## Configuration

The API base URL is configured in `environments/environment.js`. Make sure it matches your backend server URL.

For physical devices, you'll need to update the base URL to use your computer's IP address instead of `localhost`:

```javascript
export const baseUrl = 'http://YOUR_IP_ADDRESS:3000/api/v1';
```

## Project Structure

```
Mobile/
├── src/
│   └── screens/
│       ├── LoginScreen.js
│       ├── RegisterScreen.js
│       ├── HomeScreen.js
│       └── ProfileScreen.js
├── environments/
│   └── environment.js
├── App.js
├── index.js
├── package.json
└── README.md
```

## Dependencies

- **@react-navigation/native**: Navigation library
- **@react-navigation/native-stack**: Stack navigator
- **@react-navigation/bottom-tabs**: Bottom tab navigator
- **axios**: HTTP client for API calls
- **@react-native-async-storage/async-storage**: Local storage for tokens
- **react-native-image-picker**: Image selection for posts
- **react-native-screens**: Native screen components
- **react-native-safe-area-context**: Safe area handling
- **react-native-gesture-handler**: Gesture handling

## API Endpoints Used

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/signup` - User registration
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/posts` - Get all posts
- `POST /api/v1/posts` - Create a post
- `GET /api/v1/comments/post/:postId` - Get comments for a post

## Notes

- The app uses AsyncStorage instead of localStorage for token persistence
- Image uploads use FormData with multipart/form-data
- Navigation automatically redirects to Login if token is invalid or expired
- All API calls include the Bearer token in the Authorization header

