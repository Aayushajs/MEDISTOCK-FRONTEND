# 🏥 Medical Store Dashboard

A powerful, modern, and responsive mobile application for managing medical store operations. Built with **React Native**, ensuring high performance and a premium user experience.

> **Status**: Active Development 🚧

---

## ✨ Features

- **📊 Interactive Dashboard**: Real-time overview of sales, inventory, and pending orders with beautiful glassmorphism UI.
- **📦 Inventory Management**: Track stock levels, add new products, and manage categories efficiently.
- **📈 Analytics**: Visual insights into sales trends and performance metrics.
- **🛍️ Order Management**: Process orders with a seamless flow.
- **🌓 Dynamic Theming**: Fully supported **Dark** and **Light** modes with instant switching.
- **🚀 High Performance**: 
  - **MMKV** for ultra-fast storage.
  - **Zustand** for lightweight global state management.
  - **TanStack Query** for efficient data fetching and caching.
- **🎨 Modern UI/UX**:
  - **Lucide Icons** for a clean look.
  - **Lottie Animations** for engaging interactions.
  - **Animated Transitions** powered by the native driver.
  - **Custom Tab Bar & Header**.

---

## 🛠 Tech Stack

- **Core**: [React Native](https://reactnative.dev) (v0.83+)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [React Navigation v7](https://reactnavigation.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Styling**: [NativeWind (Tailwind CSS)](https://www.nativewind.dev/), Custom Theme System
- **Storage**: [react-native-mmkv](https://github.com/morousg/react-native-mmkv)
- **Networking**: [Axios](https://axios-http.com/)
- **Animation**: [Lottie](https://airbnb.io/lottie/#/react-native)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 18)
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) (Android Studio / Xcode)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aayushajs/MEDISTOCK-FRONTEND.git
   cd MedicalStoreDashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS Pods (Mac only)**
   ```bash
   cd ios && pod install && cd ..
   ```

---

## 🏃‍♂️ Running the App

Start the Metro Bundler:

```bash
npm start
```

Run on a device or emulator:

### Android
```bash
npm run android
```

### iOS (Mac only)
```bash
npm run ios
```

---

## 📁 Project Structure

size
```
src/
├── api/             # API client and configuration (Axios + TanStack Query)
├── assets/          # Images, Fonts, Animations
├── components/      # Reusable UI components
│   ├── common/      # Buttons, Inputs, Cards
│   ├── dashboard/   # Dashboard-specific widgets
│   ├── pages/       # Screen components (Dashboard, Settings, StartPage)
│   └── ui/          # Layout components (Header, TabBar)
├── navigation/      # Navigation configuration
├── stores/          # Global state (Zustand)
├── utils/           # Helpers, Constants, Theme definitions
└── App.tsx          # Entry point
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.
