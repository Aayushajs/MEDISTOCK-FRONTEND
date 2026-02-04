import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING, FONT_SIZES } from '../../utils/constants';

// ============================================
// Button Types
// ============================================

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
}

// ============================================
// Gradient Colors by Variant
// ============================================

const GRADIENTS: Record<ButtonVariant, string[]> = {
    primary: ['#667eea', '#764ba2'],
    secondary: ['#f093fb', '#f5576c'],
    outline: ['transparent', 'transparent'],
    danger: ['#ff5f6d', '#ffc371'],
    success: ['#11998e', '#38ef7d'],
};

// ============================================
// GradientButton Component
// ============================================

const GradientButton: React.FC<GradientButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon,
    style,
}) => {
    const isOutline = variant === 'outline';

    const sizeStyles: Record<ButtonSize, ViewStyle> = {
        small: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md },
        medium: { paddingVertical: SPACING.sm + 4, paddingHorizontal: SPACING.lg },
        large: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl },
    };

    const fontSizes: Record<ButtonSize, number> = {
        small: FONT_SIZES.sm,
        medium: FONT_SIZES.md,
        large: FONT_SIZES.lg,
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.container,
                fullWidth && styles.fullWidth,
                disabled && styles.disabled,
                style,
            ]}
        >
            <LinearGradient
                colors={disabled ? ['#999', '#777'] : GRADIENTS[variant]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                    styles.gradient,
                    sizeStyles[size],
                    isOutline && styles.outline,
                ]}
            >
                {loading ? (
                    <ActivityIndicator color={isOutline ? COLORS.primary : '#fff'} size="small" />
                ) : (
                    <>
                        {icon && <>{icon}</>}
                        <Text
                            style={[
                                styles.text,
                                { fontSize: fontSizes[size] },
                                isOutline && styles.outlineText,
                                icon ? styles.textWithIcon : null,
                            ]}
                        >
                            {title}
                        </Text>
                    </>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        ...SHADOWS.medium,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.6,
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BORDER_RADIUS.md,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    text: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
    outlineText: {
        color: COLORS.primary,
    },
    textWithIcon: {
        marginLeft: SPACING.xs,
    },
});

export default GradientButton;
