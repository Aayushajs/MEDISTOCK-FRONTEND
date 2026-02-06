import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../utils/constants';
import { Calendar } from 'lucide-react-native';
import { useThemeStore } from '../../stores/useThemeStore';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface ChartDataPoint {
    label: string;
    value: number;
    fullValue: number;
}

interface ActivityChartProps {
    title: string;
    growth: string;
    data: ChartDataPoint[];
    chartColor?: string; // Color from the active card
}

const ActivityChart: React.FC<ActivityChartProps> = ({ title, growth, data, chartColor }) => {
    const { colors, isDark } = useThemeStore();
    const maxBarHeight = 130;

    // Theme Colors
    const textColor = colors.text;
    const subTextColor = colors.textSecondary;
    const barBgColor = isDark ? '#333' : '#F0F0F0';
    // Use chartColor if provided, otherwise default fallback
    const activeFillColors = chartColor
        ? [chartColor, chartColor] // Solid color or simple gradient logic
        // If chartColor is bright (like yellow), maybe we need a darker variant for gradient?
        // For now, let's use the provided color as top and bottom.
        : (isDark ? ['#60A5FA', '#3B82F6'] : ['#333', '#000']);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: textColor }]}>{title}</Text>
                    <Text style={[styles.growth, { color: textColor }]}>{growth}</Text>
                </View>

                {/* Calendar Button */}
                <TouchableOpacity style={[
                    styles.calendarBtn,
                    {
                        backgroundColor: isDark ? '#333' : '#fff',
                        borderColor: isDark ? '#444' : '#eee',
                    }
                ]}>
                    <Text style={[styles.calendarText, { color: subTextColor }]}>Weekly</Text>
                    <Calendar size={16} color={colors.primary} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>

            <View style={styles.chartContainer}>
                {data.map((item, index) => {
                    const fillPercentage = Math.min((item.value / item.fullValue) * 100, 100);
                    // Use gradient for fill for "beautiful" look
                    // Gradient varies based on fill height? No, standard top-down.

                    return (
                        <View key={index} style={styles.barWrapper}>
                            {/* Tooltip for index 2 (Demo) or Active State */}
                            {index === 2 && (
                                <View style={[styles.tooltip, { backgroundColor: isDark ? '#444' : '#fff' }]}>
                                    <Text style={[styles.tooltipText, { color: textColor }]}>
                                        ${item.value.toLocaleString()}
                                    </Text>
                                    <View style={[
                                        styles.tooltipArrow,
                                        { borderTopColor: isDark ? '#444' : '#fff' }
                                    ]} />
                                </View>
                            )}

                            {/* Bar Container */}
                            <View style={[styles.barBackground, { height: maxBarHeight, backgroundColor: barBgColor }]}>
                                {/* Filled portion */}
                                <LinearGradient
                                    colors={activeFillColors}
                                    style={[styles.barFill, { height: `${fillPercentage}%` }]}
                                />
                            </View>

                            <Text style={[styles.label, { color: subTextColor }]}>{item.label}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: SPACING.xl,
        paddingHorizontal: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        marginBottom: 4,
    },
    growth: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    calendarBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    calendarText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '500',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 200,
    },
    barWrapper: {
        alignItems: 'center',
        flex: 1,
    },
    barBackground: {
        width: 27,
        borderRadius: 100,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    barFill: {
        width: '100%',
        borderRadius: 100,
    },
    label: {
        marginTop: SPACING.sm,
        fontSize: 12,
    },
    tooltip: {
        position: 'absolute',
        top: -40,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        zIndex: 10,
        minWidth: 80,
        alignItems: 'center',
    },
    tooltipText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    tooltipArrow: {
        position: 'absolute',
        bottom: -5,
        left: '50%',
        marginLeft: -5,
        width: 0,
        height: 0,
        zIndex: 11,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderTopWidth: 5,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
});

export default ActivityChart;
