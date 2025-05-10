# Notes App

A modern React Native application for managing notes across different categories. The app features a beautiful UI with gradient backgrounds, category-based organization, and a summary view of your notes.

## Features

- Create and edit notes with category organization
- Three main categories: Work and Study, Life, and Health
- Beautiful gradient UI with modern design
- Note summary and statistics
- Settings management
- Persistent storage using AsyncStorage

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- React Native development environment set up
- Expo CLI (`npm install -g expo-cli`)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd notes-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

## Running the Application

1. Start the development server:
```bash
npm start
# or
yarn start
```

2. Run on specific platform:
```bash
# For iOS
npm run ios
# or
yarn ios

# For Android
npm run android
# or
yarn android
```

## Project Structure

```
notes-app/
├── assets/              # Image assets
├── src/
│   ├── screens/        # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── NoteScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── SummaryScreen.tsx
│   └── types/          # TypeScript type definitions
│       └── index.ts
├── App.tsx             # Root component
└── package.json
```

## Navigation

The app uses React Navigation with the following routes:
- `Home`: Main screen showing notes by category
- `Note`: Create or edit notes
- `Summary`: View note statistics
- `Settings`: App settings and management