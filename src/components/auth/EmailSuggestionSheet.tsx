import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import { X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface EmailSuggestionSheetProps {
    visible: boolean;
    email: string;
    onContinue: () => void;
    onClose: () => void;
    title?: string;
}

export const EmailSuggestionSheet = ({
    visible,
    email,
    onContinue,
    onClose,
    title = "Continue with"
}: EmailSuggestionSheetProps) => {
    const { colors, isDark } = useThemeStore();
    const animValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(animValue, {
                toValue: 1,
                useNativeDriver: true,
                damping: 15,
                stiffness: 100
            }).start();
        } else {
            Animated.timing(animValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start();
        }
    }, [visible]);

    const translateY = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0]
    });

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View style={[
                            styles.sheet,
                            {
                                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                                transform: [{ translateY }]
                            }
                        ]}>
                            {/* Drag Indicator */}
                            <View style={[styles.dragIndicator, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />

                            {/* Close Button */}
                            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                                <X size={20} color={colors.textSecondary} />
                            </TouchableOpacity>

                            {/* Header */}
                            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

                            {/* Email Card (Zepto Style) */}
                            <TouchableOpacity style={[
                                styles.emailCard,
                                {
                                    backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
                                    borderColor: colors.border
                                }
                            ]} onPress={onContinue}>
                                <View style={styles.emailIconContainer}>
                                    <Image
                                        source={{ uri: 'https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_32dp.png' }}
                                        style={styles.googleIcon}
                                    />
                                </View>
                                <View style={styles.emailInfo}>
                                    <Text style={[styles.emailText, { color: colors.text }]}>{email}</Text>
                                    <Text style={[styles.verifiedText, { color: colors.success }]}>Verified account</Text>
                                </View>
                            </TouchableOpacity>

                            {/* Continue Button */}
                            <TouchableOpacity
                                style={[styles.continueBtn, { backgroundColor: '#CBFB5E' }]}
                                onPress={onContinue}
                            >
                                <Text style={styles.continueText}>Continue</Text>
                            </TouchableOpacity>

                            {/* Footer Options */}
                            <TouchableOpacity style={styles.secondaryOption} onPress={onClose}>
                                <Text style={[styles.secondaryText, { color: colors.primary }]}>Use another email</Text>
                            </TouchableOpacity>

                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingTop: 12,
        minHeight: 320,
        width: '100%',
    },
    dragIndicator: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 8,
    },
    closeBtn: {
        position: 'absolute',
        right: 20,
        top: 20,
        zIndex: 10,
        padding: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    emailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 24,
    },
    emailIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    googleIcon: {
        width: 24,
        height: 24,
    },
    emailInfo: {
        flex: 1,
    },
    emailText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    verifiedText: {
        fontSize: 12,
        fontWeight: '500',
    },
    continueBtn: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: "#CBFB5E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    continueText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    secondaryOption: {
        alignItems: 'center',
        padding: 8,
    },
    secondaryText: {
        fontSize: 16,
        fontWeight: '600',
    }
});
