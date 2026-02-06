import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated,
    LayoutAnimation,
    UIManager,
    StatusBar,
    Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../stores/useThemeStore';

import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const { width } = Dimensions.get('window');

export default function AuthScreen() {
    const navigation = useNavigation();
    const { colors, isDark } = useThemeStore();
    const insets = useSafeAreaInsets(); // Get safe area insets

    const [isLogin, setIsLogin] = useState(true);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const scrollViewRef = useRef<any>(null);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // Enable scrolling
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // Disable scrolling

                // Reset scroll position to top
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({ y: 0, animated: true });
                }
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    // Fade Animations
    const fadeHeader = useRef(new Animated.Value(0)).current;
    const fadeToggle = useRef(new Animated.Value(0)).current;
    const fadeForm = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(100, [
            Animated.timing(fadeHeader, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(fadeToggle, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(fadeForm, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]).start();
    }, []);

    const toggleMode = (mode: boolean) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsLogin(mode);
    };

    // Dynamic Styles based on theme
    const themeStyles = useMemo(() => ({
        container: { backgroundColor: colors.background },
        text: { color: colors.text },
        subText: { color: colors.textSecondary },
        inactiveToggleText: { color: colors.textSecondary },
        activeToggleText: { color: '#000' },
        toggleBg: { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' },
    }), [colors, isDark]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[
                styles.container,
                themeStyles.container,
                { paddingTop: insets.top } // Apply padding to container, not ScrollView, to fix overlap
            ]}
        >
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={isDark ? 'light-content' : 'dark-content'}
            />

            <ScrollView
                ref={scrollViewRef}
                scrollEnabled={isKeyboardVisible} // Only scroll when keyboard is open
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 20 } // Keep bottom padding here
                ]}
            >

                {/* Header Section */}
                <Animated.View style={[styles.header, { opacity: fadeHeader, transform: [{ translateY: fadeHeader.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
                    <Text style={[styles.title, themeStyles.text]}>
                        {isLogin ? 'Step Into the Future\nof Shopping' : 'Create an account'}
                    </Text>
                    {!isLogin && (
                        <Text style={[styles.subtitle, themeStyles.subText]}>
                            Already have an account? Log in
                        </Text>
                    )}
                </Animated.View>

                {/* Toggle Section */}
                <Animated.View style={[styles.toggleContainer, themeStyles.toggleBg, { opacity: fadeToggle, transform: [{ translateY: fadeToggle.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, isLogin && styles.activeToggleBtn]}
                        onPress={() => toggleMode(true)}
                    >
                        <Text style={[styles.toggleText, isLogin ? themeStyles.activeToggleText : themeStyles.inactiveToggleText]}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleBtn, !isLogin && styles.activeToggleBtn]}
                        onPress={() => toggleMode(false)}
                    >
                        <Text style={[styles.toggleText, !isLogin ? themeStyles.activeToggleText : themeStyles.inactiveToggleText]}>Register</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Form Section */}
                <Animated.View style={[styles.formContainer, { opacity: fadeForm }]}>
                    {isLogin ? <LoginForm /> : <RegisterForm />}
                </Animated.View>

            </ScrollView>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
    },
    toggleContainer: {
        flexDirection: 'row',
        height: 55,
        borderRadius: 28,
        padding: 4,
        marginBottom: 32,
    },
    toggleBtn: {
        flex: 1,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeToggleBtn: {
        backgroundColor: '#CBFB5E',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
    },
    toggleText: {
        fontSize: 16,
        fontWeight: '600',
    },
    formContainer: {
        gap: 20,
    },
    inputContainer: {
        marginBottom: 4,
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    eyeIcon: {
        padding: 4,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: -10,
    },
    rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rememberText: {
        fontSize: 14,
    },
    forgotText: {
        fontSize: 14,
        color: '#999',
        fontWeight: '600',
    },
    mainBtn: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: "#CBFB5E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    mainBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    errorText: {
        color: '#ff4444',
        textAlign: 'center',
        fontSize: 14,
    },
    footer: {
        marginTop: 40,
        gap: 24,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    divider: {
        flex: 1,
        height: 1,
    },
    orText: {
        fontSize: 14,
    },
    socialRow: {
        flexDirection: 'row',
        gap: 16,
    },
    socialBtn: {
        flex: 1,
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    socialText: {
        fontSize: 16,
        fontWeight: '600',
    }
});
