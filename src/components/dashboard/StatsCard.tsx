import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowUp, ArrowDown } from 'lucide-react-native';
import { BORDER_RADIUS, SHADOWS, SPACING, FONT_SIZES } from '../../utils/constants';
import { formatNumber, formatPrice, formatPercentage } from '../../utils/formatters';

// ============================================
// StatsCard Types
// ============================================

interface StatsCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    gradient: string[];
    isPrice?: boolean;
    change?: number; // percentage change
    suffix?: string;
}

// ============================================
// StatsCard Component - Premium Redesign
// ============================================

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    gradient,
    isPrice = false,
    change,
    suffix = '',
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [displayValue, setDisplayValue] = React.useState(0);

    // Count-up animation
    useEffect(() => {
        animatedValue.setValue(0);

        Animated.timing(animatedValue, {
            toValue: value,
            duration: 1200,
            useNativeDriver: false,
        }).start();

        const listener = animatedValue.addListener(({ value: v }) => {
            setDisplayValue(Math.floor(v));
        });

        return () => {
            animatedValue.removeListener(listener);
        };
    }, [value]);

    const formattedValue = isPrice
        ? formatPrice(displayValue)
        : formatNumber(displayValue) + suffix;

    return (
        <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.topRow}>
                <View style={styles.iconContainer}>
                    {icon}
                </View>
                {change !== undefined && (
                    <View style={styles.changeBadge}>
                        {change >= 0 ? <ArrowUp size={10} color="#fff" /> : <ArrowDown size={10} color="#fff" />}
                        <Text style={styles.changeText}>{formatPercentage(Math.abs(change))}</Text>
                    </View>
                )}
            </View>

            <View style={styles.bottomContent}>
                <Text style={styles.value}>{formattedValue}</Text>
                <Text style={styles.title}>{title}</Text>
            </View>

            {/* Decorator Circles */}
            <View style={styles.decorator1} />
            <View style={styles.decorator2} />
        </LinearGradient>
    );
};

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.xl,
        minHeight: 140,
        ...SHADOWS.medium,
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        zIndex: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    changeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#fff',
        marginLeft: 2,
    },
    bottomContent: {
        zIndex: 2,
    },
    value: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 2,
        letterSpacing: -0.5,
    },
    title: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
    decorator1: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        zIndex: 1,
    },
    decorator2: {
        position: 'absolute',
        bottom: -30,
        left: -10,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        zIndex: 1,
    }
});

export default React.memo(StatsCard);
