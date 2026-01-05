# React-Native Mobile App Boilerplate

A comprehensive React Native mobile application for class management, featuring class scheduling, course enrollment, payment processing, and student management.

## Features

- **User Authentication**: Firebase-based authentication with email/password and Google Sign-In
- **Class Management**: Browse and enroll in fitness classes
- **Course System**: Access structured fitness courses with outlines
- **Schedule Management**: View personal schedule and class timetables
- **Payment Integration**: Secure payment processing for enrollments
- **News & Updates**: Latest news and announcements
- **Profile Management**: User account and settings
- **Responsive Design**: Optimized for both iOS and Android

## Tech Stack

### Frontend (Mobile App)
- **React Native** 0.81.4
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Firebase** for authentication and backend services
- **NativeWind** for styling (Tailwind CSS)
- **Gluestack UI** for component library
- **Axios** for API calls
- **React Native Vector Icons** for icons

### Backend API
- **Express.js** with TypeScript
- **RDS PostgreSQL** database
- **Firebase Admin SDK** for authentication
- **JWT** token verification
- **Security middleware** (Helmet, CORS, Rate limiting)

## Prerequisites

Before running this project, make sure you have the following installed:

### Core Requirements
- **Node.js** (>= 18)
- **Yarn** package manager
- **React Native CLI**
- **Git** for version control

### iOS Development Requirements
- **Xcode** (latest version from App Store)
- **iOS Simulator** (iPhone 15+ recommended)
- **CocoaPods** (`sudo gem install cocoapods`)

### Android Development Requirements
- **Java JDK 17**
- **Android Studio** (latest version)
- **Android SDK** with the following platforms:
  - Android 16.0 (API Level 36)
  - Android 15.0 (API Level 35) 
  - Android 14.0 (API Level 34)
- **Android SDK Build Tools**:
  - 36.1.0 RC1
  - 36.00
  - 35.00
  - 34.00
- **Android NDK** (Native Development Kit):
  - Version 27.1
  - Version 26.1
- **Android SDK Command Line Tools**
- **CMake** 3.22.1
- **Android Emulator** (AVD Manager)

### System Requirements
- **RAM**: Minimum 8GB, Recommended 16GB
- **Storage**: At least 20GB free space
- **CPU**: 
  - **Apple Silicon**: Recommended for iOS development
  - **Intel/AMD**: Recomended atleast Intel Core i5 8400 or AMD Ryzen 5 3600x

### Important Notes
- **Hypervisor**: For Android development, ensure hypervisor is enabled on your system
- **Emulator Drivers**: Some CPUs require Android Emulator Hypervisor Driver to be installed
- **Environment Variables**: Set `ANDROID_HOME` and `JAVA_HOME` environment variables
- **Network**: Stable internet connection for downloading dependencies


## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/StudioMate-app.git
cd StudioMate-app
```

### 2. Install Dependencies

```bash
# Install npm dependencies
yarn install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..
```

### 3. Environment Setup

1. Create environment file:
```bash
cp .env.example .env
```

2. Configure your `.env` file with:
   - API Base URL
   - APP Envirnoment

3. Clone and setup express backend:
```bash
git clone https://github.com/xgenlabsmel/StudioMate-app-backend.git
```

## Running the App

### iOS

```bash
# Start Metro bundler & Build Process
yarn ios

# Start only Metro Bundler.
yarn start
```

### Android

```bash
# Start only Metro Bundler
yarn start

# Start Metro bundler & Build Process 
npm run android
```

**Android SDK Setup:**
If you encounter Android SDK issues, create `android/local.properties`:

```bash
cd android
mkdir -p local.properties
echo "sdk.dir=/Users/$(whoami)/Library/Android/sdk" > local.properties
cd ..
```

## Development Scripts

### Mobile App Scripts
```bash
yarn start              # Start Metro bundler
yarn ios                # Run on iOS simulator
yarn android            # Run on Android emulator
yarn lint               # Run ESLint
yarn prettier           # Format code with Prettier
yarn type-check         # TypeScript type checking
yarn clean:android      # Clean Android build
yarn release:android    # Build Android release
```

### Backend Scripts
```bash
yarn dev                # Start development server
yarn build              # Build TypeScript
yarn start              # Start production server
yarn lint               # Run ESLint
yarn test               # Run tests
```

## Project Structure

```
StudioMate-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── navigation/     # Navigation configuration
│   ├── services/       # API services
│   ├── shared/         # Shared utilities and constants
│   └── utils/          # Helper functions
├── android/           # Android-specific code
├── ios/               # iOS-specific code
└── assets/            # Images, fonts, and other assets

StudioMate-app-backend/
├── src/
│   ├── controllers/   # Route controllers
│   ├── services/      # Business logic
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── types/         # TypeScript type definitions
└── dist/              # Compiled JavaScript
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test -- --coverage
```

## Building for Production

### Android
```bash
# Build release APK
yarn release:android

# Build release bundle for Play Store
yarn release:play
```

### iOS
1. Open `ios/StudioMate.xcworkspace` in Xcode
2. Select your target device/simulator
3. Choose "Product" → "Archive" for App Store distribution

## Troubleshooting

### Common Issues

#### Metro Bundler Issues
```bash
# Clear Metro cache
yarn start -- --reset-cache
```

#### iOS Build Issues
```bash
# Clean and reinstall pods
cd ios && pod install && cd ..

# Clean Xcode build folder
# In Xcode: Product → Clean Build Folder

# Reset iOS simulator
# In Simulator: Device → Erase All Content and Settings
```

#### Android Build Issues
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Clear Android cache
cd android && ./gradlew cleanBuildCache && cd ..

# Reset Android emulator
# In Android Studio: Tools → AVD Manager → Wipe Data
```

---