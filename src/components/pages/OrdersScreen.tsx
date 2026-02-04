import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../common/GlassCard';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, ORDER_STATUS_COLORS } from '../../utils/constants';
import { formatPrice, formatDateTime } from '../../utils/formatters';

// ============================================
// Orders Screen
// ============================================

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';

interface Order {
    id: string;
    customerName: string;
    phone: string;
    items: number;
    amount: number;
    status: OrderStatus;
    createdAt: string;
}

const mockOrders: Order[] = [
    { id: 'ORD-1234', customerName: 'Rahul Sharma', phone: '+91 9876543210', items: 2, amount: 890, status: 'delivered', createdAt: new Date().toISOString() },
    { id: 'ORD-1233', customerName: 'Priya Kumari', phone: '+91 8765432109', items: 5, amount: 2340, status: 'pending', createdAt: new Date().toISOString() },
    { id: 'ORD-1232', customerName: 'Amit Joshi', phone: '+91 7654321098', items: 3, amount: 560, status: 'processing', createdAt: new Date().toISOString() },
    { id: 'ORD-1231', customerName: 'Sneha Patel', phone: '+91 6543210987', items: 1, amount: 180, status: 'confirmed', createdAt: new Date().toISOString() },
    { id: 'ORD-1230', customerName: 'Vikram Singh', phone: '+91 5432109876', items: 4, amount: 1560, status: 'cancelled', createdAt: new Date().toISOString() },
];

const tabs: { key: OrderStatus | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: 156 },
    { key: 'pending', label: 'Pending', count: 23 },
    { key: 'delivered', label: 'Done', count: 128 },
    { key: 'cancelled', label: 'Cancelled', count: 5 },
];

const OrdersScreen: React.FC = () => {
    const { colors, isDark } = useTheme();
    const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');

    const filteredOrders = activeTab === 'all'
        ? mockOrders
        : mockOrders.filter(order => order.status === activeTab);

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case 'delivered': return 'checkmark-circle';
            case 'pending': return 'time';
            case 'processing': return 'sync';
            case 'confirmed': return 'checkmark';
            case 'cancelled': return 'close-circle';
        }
    };

    const renderOrder = ({ item }: { item: Order }) => (
        <GlassCard style={styles.orderCard}>
            {/* Header */}
            <View style={styles.orderHeader}>
                <View style={[styles.statusDot, { backgroundColor: ORDER_STATUS_COLORS[item.status] }]} />
                <Text style={[styles.orderId, { color: colors.text }]}>#{item.id}</Text>
                <View style={{ flex: 1 }} />
                <Text style={[styles.orderAmount, { color: colors.text }]}>{formatPrice(item.amount)}</Text>
            </View>

            {/* Customer Info */}
            <View style={styles.customerRow}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{item.customerName.charAt(0)}</Text>
                </View>
                <View style={styles.customerInfo}>
                    <Text style={[styles.customerName, { color: colors.text }]}>{item.customerName}</Text>
                    <Text style={[styles.customerPhone, { color: colors.textSecondary }]}>📞 {item.phone}</Text>
                </View>
                <TouchableOpacity>
                    <Text style={{ color: COLORS.primary, fontWeight: '600' }}>View →</Text>
                </TouchableOpacity>
            </View>

            {/* Items & Time */}
            <View style={styles.orderMeta}>
                <Text style={[styles.itemCount, { color: colors.textSecondary }]}>
                    💊 {item.items} items
                </Text>
                <Text style={[styles.orderTime, { color: colors.textSecondary }]}>
                    {formatDateTime(item.createdAt)}
                </Text>
            </View>

            {/* Actions */}
            {item.status === 'pending' && (
                <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.actionBtn, { borderColor: COLORS.primary }]}>
                        <Icon name="call" size={16} color={COLORS.primary} />
                        <Text style={{ color: COLORS.primary, marginLeft: 4, fontWeight: '500' }}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.actionBtnFilled]}>
                        <Icon name="checkmark" size={16} color="#fff" />
                        <Text style={{ color: '#fff', marginLeft: 4, fontWeight: '500' }}>Complete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </GlassCard>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <Text style={[styles.title, { color: colors.text }]}>🛒 Orders</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Icon name="calendar-outline" size={22} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Icon name="search-outline" size={22} color={colors.text} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[
                            styles.tab,
                            activeTab === tab.key && styles.tabActive,
                        ]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text style={[
                            styles.tabLabel,
                            { color: activeTab === tab.key ? COLORS.primary : colors.textSecondary }
                        ]}>
                            {tab.label}
                        </Text>
                        <View style={[
                            styles.tabBadge,
                            { backgroundColor: activeTab === tab.key ? COLORS.primary : colors.border }
                        ]}>
                            <Text style={[
                                styles.tabBadgeText,
                                { color: activeTab === tab.key ? '#fff' : colors.textSecondary }
                            ]}>
                                {tab.count}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Order List */}
            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={renderOrder}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* FAB */}
            <TouchableOpacity style={styles.fab}>
                <Icon name="add" size={28} color="#fff" />
            </TouchableOpacity>
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
    headerActions: { flexDirection: 'row' },
    iconBtn: { marginLeft: SPACING.md },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        gap: SPACING.xs,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: COLORS.primary,
    },
    tabLabel: { fontSize: FONT_SIZES.sm, fontWeight: '500' },
    tabBadge: {
        marginTop: 4,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.full,
    },
    tabBadgeText: { fontSize: FONT_SIZES.xs, fontWeight: '600' },
    listContent: { padding: SPACING.md, paddingBottom: 100 },
    orderCard: { marginBottom: SPACING.sm, padding: SPACING.md },
    orderHeader: { flexDirection: 'row', alignItems: 'center' },
    statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: SPACING.sm },
    orderId: { fontSize: FONT_SIZES.md, fontWeight: '600' },
    orderAmount: { fontSize: FONT_SIZES.lg, fontWeight: '700' },
    customerRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.md },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: { color: COLORS.primary, fontSize: FONT_SIZES.lg, fontWeight: '600' },
    customerInfo: { flex: 1, marginLeft: SPACING.sm },
    customerName: { fontSize: FONT_SIZES.md, fontWeight: '500' },
    customerPhone: { fontSize: FONT_SIZES.sm },
    orderMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.sm,
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    itemCount: { fontSize: FONT_SIZES.sm },
    orderTime: { fontSize: FONT_SIZES.xs },
    actionRow: {
        flexDirection: 'row',
        marginTop: SPACING.md,
        gap: SPACING.sm,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    actionBtnFilled: {
        backgroundColor: COLORS.success,
        borderColor: COLORS.success,
    },
    fab: {
        position: 'absolute',
        bottom: 90,
        right: SPACING.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.large,
    },
});

export default OrdersScreen;
