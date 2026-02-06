import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    RefreshControl,
    Text
} from 'react-native';
import { Box, ArrowRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../ui/Header';
import { useThemeStore } from '../../stores/useThemeStore';
import { useAuthStore } from '../../stores/useAuthStore';
import GlassCard from '../common/GlassCard';
import MetricCarousel, { MetricItem } from '../dashboard/MetricCarousel';
import ActivityChart from '../dashboard/ActivityChart';
import QuickActions from '../dashboard/QuickActions';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';
import { formatPrice, formatTime } from '../../utils/formatters';

const DashboardScreen: React.FC = () => {
    const { colors, isDark } = useThemeStore();
    const { user } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // Mock Metric Data linked to Cards
    const metrics: MetricItem[] = [
        {
            id: '1',
            title: '% Sales',
            value: '$ 24,575',
            trend: '+ 23%',
            color: '#F9D976', // Original Yellow
            chartColor: '#D97706', // Darker Amber
            chartData: [10, 20, 15, 30, 25, 40, 35, 20, 45, 30]
        },
        {
            id: '2',
            title: 'Revenue',
            value: '$ 42,300',
            trend: '+ 12%',
            color: '#A0E4B0', // Original Green
            chartColor: '#059669', // Darker Emerald
            chartData: [15, 25, 20, 35, 30, 50, 40, 30, 55, 45]
        },
        {
            id: '3',
            title: 'Orders',
            value: '1,240',
            trend: '+ 5%',
            color: '#C3B1E1', // Original Purple
            chartColor: '#7C3AED', // Darker Violet
            chartData: [5, 10, 8, 15, 12, 20, 18, 10, 25, 20]
        },
        {
            id: '4',
            title: 'Rating',
            value: '4.8',
            trend: '+ 0.2',
            color: '#A7C7E7', // Original Blue
            chartColor: '#2563EB', // Darker Blue
            chartData: [4.5, 4.6, 4.5, 4.7, 4.8, 4.8, 4.9, 4.7, 4.8, 4.9]
        }
    ];

    // Mock Chart Data for each metric (7 days)
    const chartDataSets = [
        // Sales
        [
            { label: 'Mon', value: 15000, fullValue: 40000 },
            { label: 'Tue', value: 25000, fullValue: 40000 },
            { label: 'Wed', value: 33567, fullValue: 40000 },
            { label: 'Thu', value: 20000, fullValue: 40000 },
            { label: 'Fri', value: 5000, fullValue: 40000 },
            { label: 'Sat', value: 22000, fullValue: 40000 },
            { label: 'Sun', value: 18000, fullValue: 40000 },
        ],
        // Revenue
        [
            { label: 'Mon', value: 20000, fullValue: 50000 },
            { label: 'Tue', value: 30000, fullValue: 50000 },
            { label: 'Wed', value: 45000, fullValue: 50000 },
            { label: 'Thu', value: 35000, fullValue: 50000 },
            { label: 'Fri', value: 15000, fullValue: 50000 },
            { label: 'Sat', value: 28000, fullValue: 50000 },
            { label: 'Sun', value: 25000, fullValue: 50000 },
        ],
        // Orders
        [
            { label: 'Mon', value: 100, fullValue: 300 },
            { label: 'Tue', value: 150, fullValue: 300 },
            { label: 'Wed', value: 200, fullValue: 300 },
            { label: 'Thu', value: 180, fullValue: 300 },
            { label: 'Fri', value: 90, fullValue: 300 },
            { label: 'Sat', value: 120, fullValue: 300 },
            { label: 'Sun', value: 140, fullValue: 300 },
        ],
        // Rating
        [
            { label: 'Mon', value: 40, fullValue: 50 },
            { label: 'Tue', value: 30, fullValue: 50 },
            { label: 'Wed', value: 48, fullValue: 50 },
            { label: 'Thu', value: 45, fullValue: 50 },
            { label: 'Fri', value: 35, fullValue: 50 },
            { label: 'Sat', value: 42, fullValue: 50 },
            { label: 'Sun', value: 46, fullValue: 50 },
        ]
    ];

    const currentChartData = chartDataSets[activeIndex];
    const currentGrowth = activeIndex === 0 ? '+ 3,2%' : activeIndex === 1 ? '+ 5,4%' : '+ 1,8%';
    const currentTitle = activeIndex === 0 ? 'User in The Last Week' : metrics[activeIndex].title + ' Trends';

    const recentOrders = [
        { id: 'ORD-1234', customer: 'Rahul Sharma', amount: 890, items: 2, status: 'delivered', time: new Date().toISOString() },
        { id: 'ORD-1233', customer: 'Priya Kapoor', amount: 2340, items: 5, status: 'pending', time: new Date().toISOString() },
        { id: 'ORD-1232', customer: 'Amit Jain', amount: 560, items: 3, status: 'processing', time: new Date().toISOString() },
    ];

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return COLORS.success;
            case 'pending': return COLORS.warning;
            case 'processing': return COLORS.primary;
            case 'cancelled': return COLORS.danger;
            default: return colors.textSecondary;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />

            {/* Background Decorator */}
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient
                    colors={isDark ? ['#1a1f35', '#121212', '#0d0d0d'] : ['#f8f9fa', '#ffffff']}
                    style={{ flex: 1 }}
                />
            </View>

            {/* Header */}
            <Header
                subtitle="Welcome back,"
                title={user?.name || 'Medical Store'}
                showProfile
                showNotification
                showSearch
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                contentContainerStyle={styles.scrollContent}
            >
                {/* Horizontal Metric Carousel */}
                <MetricCarousel
                    data={metrics}
                    onIndexChange={setActiveIndex}
                />

                {/* Activity / Growth Chart */}
                <ActivityChart
                    title={currentTitle}
                    growth={currentGrowth}
                    data={currentChartData}
                    // Light Mode: Use darker chartColor for visibility
                    // Dark Mode: Use same color as Card (pastel/bright)
                    chartColor={isDark ? metrics[activeIndex].color : metrics[activeIndex].chartColor}
                />

                {/* Quick Actions (Integrated Here) */}
                <QuickActions />

                {/* Recent Orders */}
                <View style={[styles.section, { marginTop: SPACING.md, marginBottom: 40 }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Orders</Text>
                        <TouchableOpacity style={styles.viewAllButton}>
                            <Text style={styles.viewAllText}>View All</Text>
                            <ArrowRight size={14} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>

                    {recentOrders.map((order, index) => (
                        <TouchableOpacity key={order.id} activeOpacity={0.7}>
                            <GlassCard
                                style={[
                                    styles.orderItem,
                                    index !== recentOrders.length - 1 && { marginBottom: SPACING.sm }
                                ]}
                                padding="medium"
                                elevation="small"
                            >
                                <View style={styles.orderRow}>
                                    <View style={[styles.orderIconBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f7' }]}>
                                        <Box size={20} color={colors.textSecondary} />
                                    </View>
                                    <View style={styles.orderContent}>
                                        <View style={styles.orderHeader}>
                                            <Text style={[styles.customerName, { color: colors.text }]}>{order.customer}</Text>
                                            <Text style={[styles.orderAmount, { color: COLORS.primary }]}>{formatPrice(order.amount)}</Text>
                                        </View>
                                        <View style={styles.orderFooter}>
                                            <Text style={[styles.orderMeta, { color: colors.textSecondary }]}>
                                                {order.items} items • {formatTime(order.time)}
                                            </Text>
                                            <View style={[styles.statusTag, { backgroundColor: getStatusColor(order.status) + '15' }]}>
                                                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                                                    {order.status}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </GlassCard>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    section: {

    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.8,
    },
    viewAllText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: '600',
        marginRight: 4,
    },
    orderItem: {
        marginHorizontal: SPACING.md,
    },
    orderRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderIconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    orderContent: {
        flex: 1,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    customerName: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
    orderAmount: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderMeta: {
        fontSize: FONT_SIZES.xs,
        opacity: 0.7,
    },
    statusTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'capitalize',
    }
});

export default DashboardScreen;
