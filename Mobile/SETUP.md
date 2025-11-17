# Mobile App Setup Guide

## Important Configuration Notes

### 1. Backend CORS Configuration

The backend server currently only allows requests from `http://localhost:5173`. For the mobile app to work, you need to update the CORS configuration in `Backend/server.js`:

```javascript
const corsOptions = {
    origin: ['http://localhost:5173', 'http://YOUR_IP_ADDRESS:3000'], // Add your IP
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
};
```

Or for development, you can temporarily allow all origins:

```javascript
const corsOptions = {
    origin: '*', // Allow all origins (development only!)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
};
```

### 2. API Base URL Configuration

For physical devices or emulators, update `environments/environment.js`:

**For iOS Simulator/Android Emulator:**
```javascript
export const baseUrl = 'http://localhost:3000/api/v1';
```

**For Physical Devices:**
```javascript
export const baseUrl = 'http://YOUR_COMPUTER_IP:3000/api/v1';
```

To find your computer's IP address:
- **macOS/Linux**: Run `ifconfig` or `ip addr`
- **Windows**: Run `ipconfig`

### 3. Image Picker Permissions

The app uses `react-native-image-picker` which requires permissions:

**iOS (Info.plist):**
Add these keys to `ios/YourApp/Info.plist`:
```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photo library to select images for posts</string>
<key>NSCameraUsageDescription</key>
<string>We need access to your camera to take photos for posts</string>
```

**Android (AndroidManifest.xml):**
Add these permissions to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### 4. Running on Physical Device

1. Make sure your computer and device are on the same WiFi network
2. Update the base URL in `environments/environment.js` with your computer's IP
3. Update backend CORS to allow your device's requests
4. Run the app: `npm run ios` or `npm run android`

### 5. Troubleshooting

**Connection Issues:**
- Verify backend server is running on port 3000
- Check firewall settings
- Ensure device and computer are on same network
- Try using `10.0.2.2` for Android emulator instead of `localhost`

**Image Upload Issues:**
- Check image picker permissions are set correctly
- Verify FormData is being sent correctly
- Check backend upload middleware configuration

**Navigation Issues:**
- Clear app data and restart if navigation seems stuck
- Check AsyncStorage is working correctly

