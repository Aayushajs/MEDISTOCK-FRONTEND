import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS, FONT_SIZES, SPACING, SHADOWS, BORDER_RADIUS } from '../../utils/constants';
import { useThemeStore } from '../../stores/useThemeStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.90;

interface MetricCardProps {
    title: string;
    value: string;
    trend: string;
    color: string;
    chartData: number[];
    isActive?: boolean;
    style?: any;
    cardWidth?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    trend,
    color,
    chartData,
    isActive = true,
    style,
    cardWidth = width * 0.90 // Default fallback
}) => {
    const { isDark } = useThemeStore();

    // Generate Path
    const generatePath = (data: number[], width: number, height: number, close: boolean = false) => {
        if (data.length === 0) return "";
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        const stepX = width / (data.length - 1);

        let path = data.map((val, index) => {
            const x = index * stepX;
            const normalizedY = (val - min) / range;
            const y = height - (normalizedY * height);
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        if (close) {
            path += ` L ${width} ${height} L 0 ${height} Z`;
        }

        return path;
    };

    const graphWidth = cardWidth - (SPACING.xl * 2);
    const graphHeight = 50; // Slightly taller graph
    const strokePath = generatePath(chartData, graphWidth, graphHeight);
    const fillPath = generatePath(chartData, graphWidth, graphHeight, true); // Closed path for gradient


    const textColor = '#1A1A1A';

    return (
        <View style={[styles.cardContainer, { backgroundColor: color, width: cardWidth }, style]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.iconPlaceholder}>
                    <Text style={styles.iconText}>{title.includes('%') ? '%' : '$'}</Text>
                </View>
                <Text style={[styles.title, { color: textColor }]}>{title}</Text>
                <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                    <Text style={[styles.badgeText, { color: textColor }]}>{trend}</Text>
                </View>
            </View>

            {/* Value */}
            <Text style={[styles.value, { color: textColor }]}>{value}</Text>

            {/* Graph with Gradient */}
            <View style={styles.graphContainer}>
                <Svg width={graphWidth} height={graphHeight}>
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="rgba(0,0,0,0.2)" stopOpacity="0.5" />
                            <Stop offset="1" stopColor="rgba(0,0,0,0)" stopOpacity="0" />
                        </LinearGradient>
                    </Defs>
                    {/* Fill */}
                    <Path d={fillPath} fill="url(#grad)" />
                    {/* Stroke */}
                    <Path
                        d={strokePath}
                        fill="none"
                        stroke="rgba(0,0,0,0.6)" // Darker for better visibility
                        strokeWidth="6" // Thicker line
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        width: CARD_WIDTH,
        height: 170, // Reduced height as requested
        borderRadius: 32,
        padding: SPACING.xl,
        marginRight: SPACING.md,
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 6,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    iconText: {
        fontSize: 14,
        fontWeight: 'bold',
        opacity: 0.5,
        color: '#000',
    },
    title: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        flex: 1,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
    value: {
        fontSize: 34,
        fontWeight: '800',
        letterSpacing: -1,
        marginTop: SPACING.xs,
    },
    graphContainer: {
        height: 60,
        justifyContent: 'flex-end',
        overflow: 'hidden', // Clip gradient
        borderRadius: 8,
    },
});

export default MetricCard;
