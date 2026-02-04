import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../common/GlassCard';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../utils/constants';
import { formatPrice } from '../../utils/formatters';

// ============================================
// Inventory Screen
// ============================================

interface Product {
    id: string;
    name: string;
    mrp: number;
    stock: number;
    minStock: number;
    category: string;
}

// Mock data
const mockProducts: Product[] = [
    { id: '1', name: 'Paracetamol 500mg', mrp: 45, stock: 234, minStock: 30, category: 'Pain Relief' },
    { id: '2', name: 'Azithromycin 250mg', mrp: 180, stock: 12, minStock: 20, category: 'Antibiotics' },
    { id: '3', name: 'Cough Syrup 100ml', mrp: 120, stock: 56, minStock: 15, category: 'Cold & Flu' },
    { id: '4', name: 'Vitamin D3 1000IU', mrp: 350, stock: 89, minStock: 25, category: 'Vitamins' },
    { id: '5', name: 'Omeprazole 20mg', mrp: 65, stock: 145, minStock: 30, category: 'Digestive' },
    { id: '6', name: 'Cetirizine 10mg', mrp: 35, stock: 8, minStock: 20, category: 'Allergy' },
];

const InventoryScreen: React.FC = () => {
    const { colors, isDark } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'low' | 'expiring'>('all');

    const filteredProducts = mockProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const isLowStock = product.stock <= product.minStock;

        if (filter === 'low') return matchesSearch && isLowStock;
        return matchesSearch;
    });

    const getStockPercentage = (stock: number, minStock: number) => {
        const maxStock = minStock * 5;
        return Math.min((stock / maxStock) * 100, 100);
    };

    const getStockColor = (stock: number, minStock: number) => {
        if (stock <= minStock) return COLORS.danger;
        if (stock <= minStock * 2) return COLORS.warning;
        return COLORS.success;
    };

    const renderProduct = ({ item }: { item: Product }) => {
        const stockPercentage = getStockPercentage(item.stock, item.minStock);
        const stockColor = getStockColor(item.stock, item.minStock);
        const isLow = item.stock <= item.minStock;

        return (
            <GlassCard style={styles.productCard}>
                <View style={styles.productHeader}>
                    <View style={styles.productInfo}>
                        <Text style={[styles.productName, { color: colors.text }]}>
                            💊 {item.name}
                        </Text>
                        {isLow && (
                            <View style={styles.lowStockBadge}>
                                <Text style={styles.lowStockText}>Low Stock</Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity style={styles.moreButton}>
                        <Icon name="ellipsis-vertical" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.productDetails}>
                    <Text style={[styles.productPrice, { color: colors.textSecondary }]}>
                        MRP: {formatPrice(item.mrp)}
                    </Text>
                    <Text style={[styles.productPrice, { color: colors.textSecondary }]}>
                        Stock: {item.stock}
                    </Text>
                </View>

                {/* Stock Progress Bar */}
                <View style={styles.stockBarContainer}>
                    <View style={[styles.stockBarBg, { backgroundColor: colors.border }]}>
                        <View
                            style={[
                                styles.stockBarFill,
                                { width: `${stockPercentage}%`, backgroundColor: stockColor },
                            ]}
                        />
                    </View>
                    <Text style={[styles.stockPercentage, { color: stockColor }]}>
                        {Math.round(stockPercentage)}%
                    </Text>
                </View>
            </GlassCard>
        );
    };

    const FilterChip = ({ label, value, icon }: { label: string; value: string; icon?: string }) => (
        <TouchableOpacity
            style={[
                styles.filterChip,
                filter === value && { backgroundColor: COLORS.primary },
                filter !== value && { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 },
            ]}
            onPress={() => setFilter(value as any)}
        >
            {icon && <Icon name={icon} size={14} color={filter === value ? '#fff' : colors.text} style={{ marginRight: 4 }} />}
            <Text style={{ color: filter === value ? '#fff' : colors.text, fontWeight: '500' }}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <Text style={[styles.title, { color: colors.text }]}>📦 Inventory</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Icon name="barcode-outline" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.addButton, { backgroundColor: COLORS.primary }]}>
                        <Icon name="add" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Icon name="search" size={20} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Search medicines..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={[styles.searchInput, { color: colors.text }]}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Icon name="close-circle" size={18} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Filter Chips */}
            <View style={styles.filterContainer}>
                <FilterChip label="All" value="all" />
                <FilterChip label="Low Stock" value="low" icon="alert-circle" />
                <FilterChip label="Expiring Soon" value="expiring" icon="time" />
            </View>

            {/* Product List */}
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                renderItem={renderProduct}
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
    headerActions: { flexDirection: 'row', alignItems: 'center' },
    iconBtn: { marginRight: SPACING.sm },
    addButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: { padding: SPACING.md, paddingTop: SPACING.sm },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        height: 48,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
    },
    searchInput: { flex: 1, marginLeft: SPACING.sm, fontSize: FONT_SIZES.md },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.sm,
        gap: SPACING.sm,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs + 2,
        borderRadius: BORDER_RADIUS.full,
    },
    listContent: { padding: SPACING.md, paddingTop: SPACING.xs, paddingBottom: 100 },
    productCard: { marginBottom: SPACING.sm, padding: SPACING.md },
    productHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    productInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
    productName: { fontSize: FONT_SIZES.md, fontWeight: '600', marginRight: SPACING.sm },
    lowStockBadge: {
        backgroundColor: COLORS.danger + '20',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.full,
    },
    lowStockText: { color: COLORS.danger, fontSize: FONT_SIZES.xs, fontWeight: '600' },
    moreButton: { padding: SPACING.xs },
    productDetails: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm },
    productPrice: { fontSize: FONT_SIZES.sm },
    stockBarContainer: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm },
    stockBarBg: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
    stockBarFill: { height: '100%', borderRadius: 3 },
    stockPercentage: { marginLeft: SPACING.sm, fontSize: FONT_SIZES.xs, fontWeight: '600', width: 40 },
    fab: {
        position: 'absolute',
        bottom: 90,
        right: SPACING.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.large,
    },
});

export default InventoryScreen;
