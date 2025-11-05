Momentum React Native Home Assignment
This repository contains the solution for the Momentum React Native home assignment. The project is a mobile application built with React Native (Expo) that guides a user through a multi-step funnel, demonstrating clean architecture, local state persistence, and a dynamic offer flow.

The app simulates how subscription apps onboard users, collect information, present a time-sensitive offer, and handle a mock checkout process.

🚀 Features

User Info Collection: Captures and validates user email and name across two screens.

Dynamic Pricing: Generates a unique, time-sensitive discount code ([name]\_[month][year]).

Countdown Timer: A 5-minute timer controls the pricing. The discounted price is shown while active, and the full price is shown when it expires.

State Persistence: All user data (name, email) and the discount timer's state are persisted locally using Redux Persist and AsyncStorage. The app state is restored after restarts.

Mock Checkout: A simulated Stripe checkout screen that charges the final price (discounted or full) based on the timer's status.

End-to-End Offline: The entire funnel works locally without any backend dependencies.

🛠️ Tech Stack

Framework: React Native (with Expo SDK )

Language: TypeScript

State Management: Redux Toolkit (with Redux Persist)

Navigation: (Custom navigation logic in App.tsx)

Payments: @stripe/stripe-react-native (for UI and mock checkout )

Storage: AsyncStorage (via redux-persist)

🚦 Getting Started
Follow these instructions to run the application locally on your machine or mobile device.

Prerequisites
Node.js (LTS version recommended)

npm or yarn

Expo Go app installed on your physical iOS or Android device.

1. Installation
   Clone the repository and install the dependencies:

Bash

# Clone the repository (if you haven't)

git clone <your-repo-url>
cd <project-directory>

# Install dependencies

npm install 2. Running the App
Once the dependencies are installed, you can start the Expo development server:

Bash

npx expo start
This will open the Expo developer tools in your browser. You can then:

On a physical device: Scan the QR code with the Expo Go app (or the Camera app on iOS).

On a simulator:

Press i to run on the iOS Simulator.

Press a to run on the Android Emulator.

📁 Project Structure
The project code is organized with a clear folder structure to separate concerns:

.
├── src/
│ ├── components/ # Reusable components (e.g., BottomButton, PricingCard)
│ ├── hooks/ # Custom hooks (e.g., useRedux)
│ ├── screens/ # All app screens (EmailScreen, NameScreen, etc.)
│ ├── store/ # Redux store, slices (userSlice), and persistence config
│ ├── types/ # TypeScript type definitions (ScreenTypes, ProductTypes)
│ └── utils/ # Helper functions (validation, date formatting)
├── assets/ # Static assets (images, fonts)
├── App.tsx # Main app entry point, navigation logic
└── README.md # This file
