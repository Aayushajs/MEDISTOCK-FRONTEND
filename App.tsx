import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import AppNavigator from './AppNavigator';
import { useThemeStore } from './src/stores/useThemeStore';
import { ThemeProvider } from './src/context/ThemeContext';

// Ignore specific warnings
LogBox.ignoreLogs(['ViewPropTypes will be removed']);

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// ============================================
// App Content with Theme
// ============================================

const AppContent: React.FC = () => {
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <AppNavigator />
      <Toast />
    </>
  );
};

// ============================================
// Main App Component
// ============================================

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default App;
