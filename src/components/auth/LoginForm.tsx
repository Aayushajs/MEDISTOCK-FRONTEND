import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions, TextInput } from 'react-native';
import { Check } from 'lucide-react-native';
import { FormInput } from '../ui/FormInput';
import { useAuthStore, selectIsLoading, selectAuthError } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';

import { EmailSuggestionSheet } from './EmailSuggestionSheet';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const { width } = Dimensions.get('window');

export default function LoginForm() {
    const { colors, isDark } = useThemeStore();
    
    // Optimized selectors - minimal re-renders
    const login = useAuthStore((state) => state.login);
    const clearError = useAuthStore((state) => state.clearError);
    const isLoading = useAuthStore(selectIsLoading);
    const error = useAuthStore(selectAuthError);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);

    // OTP State
    const [isOtpMode, setIsOtpMode] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const otpRefs = useRef<Array<TextInput | null>>([]);

    // Google One Tap State
    const [showEmailSuggestion, setShowEmailSuggestion] = useState(false);
    const [suggestedEmail, setSuggestedEmail] = useState('');

    // Show email suggestion popup on mount
    React.useEffect(() => {
        const checkGoogleAccount = async () => {
            try {
                // Configure Google Sign-In with webClientId from google-services.json
                GoogleSignin.configure({
                    webClientId: '297795283418-hbcjk2cj1bo1tsggp3ltmfhe7bjs4phs.apps.googleusercontent.com',
                    offlineAccess: false,
                    forceCodeForRefreshToken: false,
                });

                // Check if Play Services available
                await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

                // Step 1: Try silent sign-in first (no UI, checks if already logged in)
                try {
                    const userInfo = await GoogleSignin.signInSilently();
                    if (userInfo?.data?.user?.email) {
                        // Show bottom sheet with suggested email
                        setSuggestedEmail(userInfo.data.user.email);
                        setShowEmailSuggestion(true);
                        return;
                    }
                } catch (silentError: any) {
                    if (__DEV__) {
                        console.log('Silent sign-in not available:', silentError.code);
                    }
                }

                // Step 2: If silent fails, show account picker
                // User selects account → email goes to input (NO Google login)
                // Note: Don't signOut after this, so next time signInSilently will work!
                try {
                    const userInfo = await GoogleSignin.signIn();
                    if (userInfo?.data?.user?.email) {
                        // Just put email in input field - NOT Google login
                        setEmail(userInfo.data.user.email);
                        // Don't sign out - so silent check works next time
                    }
                } catch (signInError: any) {
                    if (__DEV__) {
                        console.log('Google Sign-In cancelled/error:', signInError.code);
                    }
                }
            } catch (error: any) {
                if (__DEV__) {
                    console.warn('Google Sign-In setup error:', error.message);
                }
            }
        };

        const timer = setTimeout(checkGoogleAccount, 500);
        return () => clearTimeout(timer);
    }, []);

    // Clear error when mode changes
    React.useEffect(() => {
        clearError();
    }, [clearError, isOtpMode]);

    const handleSuggestionContinue = () => {
        setEmail(suggestedEmail);
        setShowEmailSuggestion(false);
    };

    const handleLogin = async () => {
        // Validate inputs
        if (!email.trim()) {
            return;
        }
        if (!isOtpMode && !password.trim()) {
            return;
        }
        
        // Call login API with proper credentials object
        const success = await login({
            email: email.trim(),
            password: isOtpMode ? otp.join('') : password,
        });
        
        // Navigation will be handled by auth state change
        if (success) {
            console.log('Login successful!');
        }
    };

    const handleOtpChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus next input
        if (text && index < 3) {
            otpRefs.current[index + 1]?.focus();
        }
        // Handle backspace (move to prev) - logic usually requires onKeyPress
    };

    const handleOtpKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>

            <FormInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="example@gmail.com"
                colors={colors}
            />

            <View style={styles.inputContainer}>
                {/* Text Label + Toggle */}
                <View style={styles.passwordHeader}>
                    <TouchableOpacity onPress={() => setIsOtpMode(false)}>
                        <Text style={[
                            styles.inputLabel,
                            { color: !isOtpMode ? (isDark ? '#CBFB5E' : colors.success) : colors.textSecondary, fontWeight: !isOtpMode ? 'bold' : '500' }
                        ]}>
                            Password
                        </Text>
                    </TouchableOpacity>
                    <Text style={{ color: colors.border, marginHorizontal: 8 }}>|</Text>
                    <TouchableOpacity onPress={() => setIsOtpMode(true)}>
                        <Text style={[
                            styles.inputLabel,
                            { color: isOtpMode ? (isDark ? '#CBFB5E' : colors.success) : colors.textSecondary, fontWeight: isOtpMode ? 'bold' : '500' }
                        ]}>
                            OTP
                        </Text>
                    </TouchableOpacity>
                </View>

                {isOtpMode ? (
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(el) => { otpRefs.current[index] = el; }}
                                style={[
                                    styles.otpBox,
                                    {
                                        color: colors.text,
                                        backgroundColor: colors.card,
                                        borderColor: digit ? (isDark ? '#CBFB5E' : colors.success) : colors.border
                                    }
                                ]}
                                value={digit}
                                onChangeText={(text) => handleOtpChange(text, index)}
                                onKeyPress={(e) => handleOtpKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                textAlign="center"
                            />
                        ))}
                    </View>
                ) : (
                    <FormInput
                        label=""
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••••••"
                        secureTextEntry={secureTextEntry}
                        colors={colors}
                        isPassword
                        onTogglePassword={() => setSecureTextEntry(!secureTextEntry)}
                    />
                )}
            </View>

            {/* If FormInput requires label prop but we want to customize it, we might need to adjust FormInput or wrapper logic. 
                Wait, FormInput handles label internaly. 
                If I pass empty string, it renders empty Text.
                I will refactor FormInput usage below to be cleaner.
            */}
            {!isOtpMode && (
                <View style={{ marginTop: -20 }}>
                    {/* Negative margin to pull up since I moved label out, OR better: don't use FormInput for password, render manually to match structure */}
                </View>
            )}


            <View style={styles.optionsRow}>
                <TouchableOpacity
                    style={styles.rememberRow}
                    onPress={() => setRememberMe(!rememberMe)}
                >
                    <View style={[styles.checkbox, { borderColor: colors.border, backgroundColor: rememberMe ? colors.primary : 'transparent' }]}>
                        {rememberMe && <Check size={12} color="#FFF" />}
                    </View>
                    <Text style={[styles.rememberText, { color: colors.text }]}>Remember Me</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.forgotText}>Forgot Password</Text>
                </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            {/* Main Button */}
            <TouchableOpacity
                style={[styles.mainBtn, { backgroundColor: '#CBFB5E' }]}
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <Text style={styles.mainBtnText}>
                        {isOtpMode ? 'Verify & Login' : 'Login'}
                    </Text>
                )}
            </TouchableOpacity>

            <EmailSuggestionSheet
                visible={showEmailSuggestion}
                email={suggestedEmail}
                onContinue={handleSuggestionContinue}
                onClose={() => setShowEmailSuggestion(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 20,
    },
    inputContainer: {
        marginBottom: 4,
    },
    passwordHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputLabel: {
        fontSize: 14,
    },
    otpContainer: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
    },
    otpBox: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 80,
        height: 80,
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
    }
});
