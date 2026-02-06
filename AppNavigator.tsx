import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import DashboardScreen from './src/components/pages/DashboardScreen';
import InventoryScreen from './src/components/pages/InventoryScreen';
import OrdersScreen from './src/components/pages/OrdersScreen';
import AnalyticsScreen from './src/components/pages/AnalyticsScreen';
import SettingsScreen from './src/components/pages/SettingsScreen';
import StartPage from './src/components/pages/StartPage';
import LoginPage from './src/components/pages/authScreen';

import { useThemeStore } from './src/stores/useThemeStore';
import { useAuthStore, selectIsAuthenticated, selectIsInitialized } from './src/stores/useAuthStore';
import { COLORS, SHADOWS, SPACING } from './src/utils/constants';

// ============================================
// Navigation Types
// ============================================

export type RootTabParamList = {
    Dashboard: undefined;
    Inventory: undefined;
    AddAction: undefined;
    Analytics: undefined;
    Settings: undefined;
};

export type RootStackParamList = {
    Start: undefined;
    Login: undefined;
    MainTabs: undefined;
    // Add more stack screens here
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();



// ============================================
// Tab Navigator
// ============================================

import CustomTabBar from './src/components/ui/CustomTabBar';

// ============================================
// Tab Navigator
// ============================================

const TabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ tabBarLabel: 'Home' }}
            />
            <Tab.Screen
                name="Inventory"
                component={InventoryScreen}
                options={{ tabBarLabel: 'Stock' }}
            />
            <Tab.Screen
                name="AddAction"
                component={DashboardScreen}
                options={{
                    tabBarLabel: '',
                }}
            />
            <Tab.Screen
                name="Analytics"
                component={AnalyticsScreen}
                options={{ tabBarLabel: 'Stats' }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ tabBarLabel: 'More' }}
            />
        </Tab.Navigator>
    );
};

// ============================================
// Main Navigator
// ============================================

const AppNavigator: React.FC = () => {
    const { colors } = useThemeStore();
    
    // Auth state - determines which screens to show
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const isInitialized = useAuthStore(selectIsInitialized);
    const initialize = useAuthStore((state) => state.initialize);

    // Initialize auth state on mount
    useEffect(() => {
        initialize();
    }, [initialize]);

    // Show loading while checking auth state
    if (!isInitialized) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color="#CBFB5E" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.background },
                }}
            >
                {isAuthenticated ? (
                    // Authenticated - Show Main App
                    <Stack.Screen name="MainTabs" component={TabNavigator} />
                ) : (
                    // Not Authenticated - Show Auth Screens
                    <>
                        <Stack.Screen name="Start" component={StartPage} />
                        <Stack.Screen name="Login" component={LoginPage} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AppNavigator;
