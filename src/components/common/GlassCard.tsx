import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { BORDER_RADIUS, SHADOWS, SPACING } from '../../utils/constants';

// ============================================
// GlassCard Props
// ============================================

interface GlassCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    padding?: 'small' | 'medium' | 'large' | 'none';
    elevation?: 'none' | 'small' | 'medium' | 'large';
}

// ============================================
// GlassCard Component
// ============================================

const GlassCard: React.FC<GlassCardProps> = ({
    children,
    style,
    padding = 'medium',
    elevation = 'medium',
}) => {
    const { colors, isDark } = useTheme();

    const paddingStyles: Record<string, number> = {
        none: 0,
        small: SPACING.sm,
        medium: SPACING.md,
        large: SPACING.lg,
    };

    const shadowStyles: Record<string, ViewStyle> = {
        none: {},
        small: SHADOWS.small,
        medium: SHADOWS.medium,
        large: SHADOWS.large,
    };

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.95)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    padding: paddingStyles[padding],
                },
                shadowStyles[elevation],
                style,
            ]}
        >
            {children}
        </View>
    );
};

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        overflow: 'hidden',
    },
});

export default GlassCard;
