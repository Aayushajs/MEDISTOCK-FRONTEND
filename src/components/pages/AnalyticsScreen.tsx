import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../common/GlassCard';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../utils/constants';
import { formatPrice, formatNumber } from '../../utils/formatters';

// ============================================
// Analytics Screen
// ============================================

const { width } = Dimensions.get('window');

const periods = ['Today', 'This Week', 'This Month', 'This Year'];

const topProducts = [
    { rank: 1, name: 'Paracetamol 500mg', sold: 456, revenue: 20520 },
    { rank: 2, name: 'Azithromycin 250mg', sold: 234, revenue: 42120 },
    { rank: 3, name: 'Cough Syrup 100ml', sold: 189, revenue: 22680 },
    { rank: 4, name: 'Vitamin D3 1000IU', sold: 156, revenue: 54600 },
    { rank: 5, name: 'Omeprazole 20mg', sold: 134, revenue: 8710 },
];

const weeklyData = [
    { day: 'Mon', revenue: 12500 },
    { day: 'Tue', revenue: 18200 },
    { day: 'Wed', revenue: 22300 },
    { day: 'Thu', revenue: 15600 },
    { day: 'Fri', revenue: 28400 },
    { day: 'Sat', revenue: 32100 },
    { day: 'Sun', revenue: 16500 },
];

const AnalyticsScreen: React.FC = () => {
    const { colors, isDark } = useTheme();
    const [selectedPeriod, setSelectedPeriod] = useState('This Week');

    const totalRevenue = 145670;
    const revenueChange = 23.5;
    const maxRevenue = Math.max(...weeklyData.map(d => d.revenue));

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1: return '#FFD700'; // Gold
            case 2: return '#C0C0C0'; // Silver
            case 3: return '#CD7F32'; // Bronze
            default: return colors.textSecondary;
        }
    };

    const getRankIcon = (rank: number) => {
        if (rank <= 3) return 'medal';
        return 'ellipse';
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <Text style={[styles.title, { color: colors.text }]}>📊 Analytics</Text>
                <TouchableOpacity style={styles.periodSelector}>
                    <Text style={{ color: COLORS.primary, fontWeight: '600' }}>{selectedPeriod}</Text>
                    <Icon name="chevron-down" size={18} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Revenue Card */}
                <LinearGradient
                    colors={COLORS.gradientBlue}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.revenueCard}
                >
                    <Text style={styles.revenueLabel}>Total Revenue</Text>
                    <Text style={styles.revenueValue}>{formatPrice(totalRevenue)}</Text>
                    <View style={styles.revenueChange}>
                        <Icon name="arrow-up" size={14} color="#4ade80" />
                        <Text style={styles.revenueChangeText}>
                            {revenueChange}% vs last {selectedPeriod.toLowerCase().replace('this ', '')}
                        </Text>
                    </View>
                </LinearGradient>

                {/* Bar Chart */}
                <GlassCard style={styles.chartCard}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>📈 Revenue Chart</Text>
                    <View style={styles.chartContainer}>
                        {weeklyData.map((item, index) => {
                            const barHeight = (item.revenue / maxRevenue) * 120;
                            return (
                                <View key={index} style={styles.barColumn}>
                                    <View style={styles.barWrapper}>
                                        <LinearGradient
                                            colors={['#667eea', '#764ba2']}
                                            style={[styles.bar, { height: barHeight }]}
                                        />
                                    </View>
                                    <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{item.day}</Text>
                                </View>
                            );
                        })}
                    </View>
                </GlassCard>

                {/* Summary Cards */}
                <View style={styles.summaryRow}>
                    <GlassCard style={styles.summaryCard}>
                        <Icon name="cart" size={24} color={COLORS.primary} />
                        <Text style={[styles.summaryValue, { color: colors.text }]}>847</Text>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Orders</Text>
                    </GlassCard>
                    <GlassCard style={styles.summaryCard}>
                        <Icon name="people" size={24} color={COLORS.secondary} />
                        <Text style={[styles.summaryValue, { color: colors.text }]}>234</Text>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Customers</Text>
                    </GlassCard>
                    <GlassCard style={styles.summaryCard}>
                        <Icon name="cube" size={24} color={COLORS.success} />
                        <Text style={[styles.summaryValue, { color: colors.text }]}>1.2K</Text>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Products</Text>
                    </GlassCard>
                </View>

                {/* Top Selling Products */}
                <GlassCard style={styles.topProductsCard}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>🏆 Top Selling</Text>
                        <TouchableOpacity>
                            <Text style={{ color: COLORS.primary, fontWeight: '500' }}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {topProducts.map((product, index) => (
                        <View key={index} style={[styles.productRow, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
                            <View style={[styles.rankBadge, { backgroundColor: getRankColor(product.rank) + '20' }]}>
                                <Text style={[styles.rankText, { color: getRankColor(product.rank) }]}>
                                    {product.rank}
                                </Text>
                            </View>
                            <View style={styles.productInfo}>
                                <Text style={[styles.productName, { color: colors.text }]}>💊 {product.name}</Text>
                                <Text style={[styles.productSold, { color: colors.textSecondary }]}>
                                    {formatNumber(product.sold)} sold
                                </Text>
                            </View>
                            <Text style={[styles.productRevenue, { color: COLORS.success }]}>
                                {formatPrice(product.revenue)}
                            </Text>
                        </View>
                    ))}
                </GlassCard>

                {/* Export Button */}
                <TouchableOpacity style={styles.exportButton}>
                    <Icon name="download-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.exportText}>Export Report</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        paddingTop: SPACING.xl,
        ...SHADOWS.small,
    },
    title: { fontSize: FONT_SIZES.xl, fontWeight: '700' },
    periodSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    content: { padding: SPACING.md, paddingBottom: 100 },
    revenueCard: {
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.medium,
    },
    revenueLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZES.md },
    revenueValue: { color: '#fff', fontSize: 36, fontWeight: '700', marginVertical: SPACING.xs },
    revenueChange: { flexDirection: 'row', alignItems: 'center' },
    revenueChangeText: { color: '#4ade80', fontSize: FONT_SIZES.sm, marginLeft: 4 },
    chartCard: { padding: SPACING.md, marginBottom: SPACING.md },
    sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '600', marginBottom: SPACING.md },
    chartContainer: { flexDirection: 'row', justifyContent: 'space-between', height: 150, alignItems: 'flex-end' },
    barColumn: { alignItems: 'center', flex: 1 },
    barWrapper: { height: 120, justifyContent: 'flex-end' },
    bar: { width: 24, borderRadius: 4 },
    barLabel: { marginTop: SPACING.xs, fontSize: FONT_SIZES.xs },
    summaryRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
    summaryCard: { flex: 1, alignItems: 'center', padding: SPACING.md },
    summaryValue: { fontSize: FONT_SIZES.xl, fontWeight: '700', marginTop: SPACING.xs },
    summaryLabel: { fontSize: FONT_SIZES.xs },
    topProductsCard: { padding: SPACING.md, marginBottom: SPACING.md },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
    productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm },
    rankBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    rankText: { fontSize: FONT_SIZES.sm, fontWeight: '700' },
    productInfo: { flex: 1, marginLeft: SPACING.sm },
    productName: { fontSize: FONT_SIZES.md, fontWeight: '500' },
    productSold: { fontSize: FONT_SIZES.xs },
    productRevenue: { fontSize: FONT_SIZES.md, fontWeight: '600' },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        borderStyle: 'dashed',
    },
    exportText: { color: COLORS.primary, fontWeight: '600', marginLeft: SPACING.xs },
});

export default AnalyticsScreen;
