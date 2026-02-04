import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    ImageBackground,
    Platform
} from 'react-native';
import {
    Plus,
    ShoppingCart,
    ScanLine,
    FileBarChart,
    CheckCircle2,
    Clock,
    RefreshCcw,
    XCircle,
    Wallet,
    AlertTriangle,
    Star,
    Box,
    ArrowRight
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../ui/Header';
import { useThemeStore } from '../../stores/useThemeStore';
import { useAuthStore } from '../../stores/useAuthStore';
import StatsCard from '../dashboard/StatsCard';
import GlassCard from '../common/GlassCard';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../utils/constants';
import { formatPrice, formatTime } from '../../utils/formatters';

const { width } = Dimensions.get('window');

// ============================================
// Dashboard Screen - Premium Redesign
// ============================================

const DashboardScreen: React.FC = () => {
    const { colors, isDark } = useThemeStore();
    const { user } = useAuthStore();
    const [refreshing, setRefreshing] = React.useState(false);

    // Mock data
    const stats = {
        revenue: 45230,
        orders: 127,
        lowStock: 23,
        rating: 4.8,
    };

    const recentOrders = [
        { id: 'ORD-1234', customer: 'Rahul Sharma', amount: 890, items: 2, status: 'delivered', time: new Date().toISOString() },
        { id: 'ORD-1233', customer: 'Priya Kapoor', amount: 2340, items: 5, status: 'pending', time: new Date().toISOString() },
        { id: 'ORD-1232', customer: 'Amit Jain', amount: 560, items: 3, status: 'processing', time: new Date().toISOString() },
        { id: 'ORD-1231', customer: 'Sneha Gupta', amount: 1200, items: 1, status: 'delivered', time: new Date(Date.now() - 86400000).toISOString() },
    ];

    const quickActions = [
        { icon: <Plus size={24} color="#fff" />, label: 'Add Product', color: COLORS.primary },
        { icon: <ShoppingCart size={24} color="#fff" />, label: 'New Order', color: COLORS.secondary },
        { icon: <ScanLine size={24} color="#fff" />, label: 'Scan', color: COLORS.success },
        { icon: <FileBarChart size={24} color="#fff" />, label: 'Reports', color: '#8e44ad' },
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

            {/* Background Decorator Gradient */}
            <View style={StyleSheet.absoluteFill}>
                {!isDark && (
                    <LinearGradient
                        colors={['#f0f4ff', '#fff', '#fdfbf7']}
                        style={{ flex: 1 }}
                    />
                )}
                {isDark && (
                    <LinearGradient
                        colors={['#1a1f35', '#121212', '#0d0d0d']}
                        style={{ flex: 1 }}
                    />
                )}
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
                {/* Stats Cards - Staggered Layout */}
                <View style={styles.statsContainer}>
                    <View style={styles.column}>
                        <StatsCard
                            title="Total Revenue"
                            value={stats.revenue}
                            icon={<Wallet size={20} color="#fff" />}
                            gradient={COLORS.gradientBlue}
                            isPrice
                            change={12.5}
                        />
                        <View style={{ height: SPACING.md }} />
                        <StatsCard
                            title="Low Stock Items"
                            value={stats.lowStock}
                            icon={<AlertTriangle size={20} color="#fff" />}
                            gradient={['#FF416C', '#FF4B2B']}
                            change={-5.3}
                        />
                    </View>
                    <View style={styles.column}>
                        <StatsCard
                            title="Orders Today"
                            value={stats.orders}
                            icon={<Box size={20} color="#fff" />}
                            gradient={COLORS.gradientOrange}
                            change={8.2}
                        />
                        <View style={{ height: SPACING.md }} />
                        <StatsCard
                            title="Store Rating"
                            value={stats.rating}
                            icon={<Star size={20} color="#fff" />}
                            gradient={COLORS.gradientGreen}
                            suffix="★"
                        />
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={[styles.section, { marginTop: SPACING.xl }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.actionsScrollContent}
                    >
                        {quickActions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.actionWrapper, { marginRight: SPACING.md }]}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.actionIcon,
                                    {
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#fff',
                                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                        borderWidth: 1
                                    }
                                ]}>
                                    <View style={[styles.iconCircle, { backgroundColor: action.color + '20' }]}>
                                        {React.cloneElement(action.icon as React.ReactElement<any>, { color: action.color, size: 24 })}
                                    </View>
                                </View>
                                <Text style={[styles.actionLabel, { color: colors.text }]}>{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                        {/* Spacer for right padding */}
                        <View style={{ width: SPACING.md }} />
                    </ScrollView>
                </View>

                {/* Recent Orders */}
                <View style={[styles.section, { marginTop: SPACING.xl, marginBottom: 40 }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Orders</Text>
                        <TouchableOpacity style={styles.viewAllButton}>
                            <Text style={styles.viewAllText}>View All</Text>
                            <ArrowRight size={14} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>

                    {recentOrders.map((order, index) => (
                        <TouchableOpacity
                            key={order.id}
                            activeOpacity={0.7}
                        >
                            <GlassCard
                                style={[
                                    styles.orderItem,
                                    index !== recentOrders.length - 1 && { marginBottom: SPACING.sm }
                                ]}
                                padding="medium"
                                elevation="small"
                            >
                                <View style={styles.orderRow}>
                                    {/* Icon Box */}
                                    <View style={[styles.orderIconBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f7' }]}>
                                        <Box size={20} color={colors.textSecondary} />
                                    </View>

                                    {/* Content */}
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
        paddingBottom: 100, // Space for Bottom Tab
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    column: {
        flex: 1,
    },
    section: {
        // paddingHorizontal: SPACING.md, // Removed because Quick Actions ScrollView needs full width
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
        paddingHorizontal: SPACING.md, // Added padding for title
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
    actionsScrollContent: {
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.sm, // space for shadow
    },
    actionWrapper: {
        alignItems: 'center',
        width: 70,
    },
    actionIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xs,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionLabel: {
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 4,
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
