import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { PackagePlus, FileText, Users, Box } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../utils/constants';
import { useThemeStore } from '../../stores/useThemeStore';

const actions = [
    {
        id: '1',
        label: 'Add Product',
        icon: PackagePlus,
        color: '#F59E0B', // Emerald 500
        bgLight: 'rgba(16, 185, 129, 0.1)',
        bgDark: 'rgba(16, 185, 129, 0.2)',
    },
    {
        id: '2',
        label: 'New Bill',
        icon: FileText,
        color: '#10B981', // Blue 500
        bgLight: 'rgba(59, 130, 246, 0.1)',
        bgDark: 'rgba(59, 130, 246, 0.2)',
    },
    {
        id: '3',
        label: 'Customers',
        icon: Users,
        color: '#8B5CF6', // Violet 500
        bgLight: 'rgba(139, 92, 246, 0.1)',
        bgDark: 'rgba(139, 92, 246, 0.2)',
    },
    {
        id: '4',
        label: 'Stock',
        icon: Box,
        color: '#8B5CF6', // Amber 500
        bgLight: 'rgba(245, 158, 11, 0.1)',
        bgDark: 'rgba(245, 158, 11, 0.2)',
    },
];

const QuickActions: React.FC = () => {
    const { colors, isDark } = useThemeStore();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Quick Actions</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {actions.map((action) => (
                    <TouchableOpacity
                        key={action.id}
                        style={styles.actionItem}
                        activeOpacity={0.7}
                    >
                        <View style={[
                            styles.iconBox,
                            {
                                backgroundColor: isDark ? action.bgDark : action.bgLight,
                                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'transparent',
                                borderWidth: isDark ? 1 : 0,
                            }
                        ]}>
                            <action.icon size={24} color={action.color} strokeWidth={2.5} />
                        </View>
                        <Text style={[styles.label, { color: colors.text }]}>{action.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
    },
    header: {
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    scrollContent: {
        paddingHorizontal: SPACING.md,
    },
    actionItem: {
        alignItems: 'center',
        marginRight: SPACING.lg,
        width: 72,
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 30, // Squircle for professional look
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xs + 2,
    },
    label: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default QuickActions;
