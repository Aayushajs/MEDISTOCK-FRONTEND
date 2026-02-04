import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../common/GlassCard';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../utils/constants';

// ============================================
// Settings Screen
// ============================================

const SettingsScreen: React.FC = () => {
    const { colors, isDark, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

    const settingsGroups = [
        {
            title: 'Store Settings',
            items: [
                { icon: 'storefront', label: 'Store Profile', screen: 'StoreProfile' },
                { icon: 'location', label: 'Address', screen: 'Address' },
                { icon: 'document-text', label: 'GST Details', screen: 'GSTDetails' },
            ],
        },
        {
            title: 'App Settings',
            items: [
                { icon: 'notifications', label: 'Notifications', toggle: true, value: notificationsEnabled, onToggle: setNotificationsEnabled },
                { icon: 'moon', label: 'Dark Mode', toggle: true, value: isDark, onToggle: toggleTheme },
                { icon: 'language', label: 'Language', value: 'English', screen: 'Language' },
            ],
        },
        {
            title: 'Support',
            items: [
                { icon: 'help-circle', label: 'Help & FAQ', screen: 'Help' },
                { icon: 'chatbubbles', label: 'Contact Support', screen: 'Support' },
                { icon: 'star', label: 'Rate App', screen: 'Rate' },
            ],
        },
        {
            title: 'Legal',
            items: [
                { icon: 'shield-checkmark', label: 'Privacy Policy', screen: 'Privacy' },
                { icon: 'document', label: 'Terms of Service', screen: 'Terms' },
            ],
        },
    ];

    interface SettingItem {
        icon: string;
        label: string;
        screen?: string;
        toggle?: boolean;
        value?: boolean | string;
        onToggle?: (value: boolean) => void;
    }

    const renderSettingItem = (item: SettingItem, isLast: boolean) => (
        <TouchableOpacity
            key={item.label}
            style={[styles.settingItem, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
            disabled={item.toggle}
        >
            <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '15' }]}>
                <Icon name={item.icon} size={20} color={COLORS.primary} />
            </View>
            <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>

            {item.toggle ? (
                <Switch
                    value={item.value as boolean}
                    onValueChange={item.onToggle}
                    trackColor={{ false: colors.border, true: COLORS.primary + '60' }}
                    thumbColor={item.value ? COLORS.primary : '#f4f3f4'}
                />
            ) : (
                <View style={styles.settingRight}>
                    {typeof item.value === 'string' && (
                        <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{item.value}</Text>
                    )}
                    <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card }]}>
                <Text style={[styles.title, { color: colors.text }]}>⚙️ Settings</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Profile Card */}
                <GlassCard style={styles.profileCard}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarText}>🏪</Text>
                    </View>
                    <Text style={[styles.storeName, { color: colors.text }]}>
                        {user?.storeName || 'MediCare Pharmacy'}
                    </Text>
                    <View style={styles.ratingRow}>
                        <Icon name="star" size={16} color="#FFD700" />
                        <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                            4.8 (234 reviews)
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                        <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Edit Profile</Text>
                    </TouchableOpacity>
                </GlassCard>

                {/* Settings Groups */}
                {settingsGroups.map((group, index) => (
                    <View key={group.title} style={styles.settingsGroup}>
                        <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>{group.title}</Text>
                        <GlassCard padding="none">
                            {group.items.map((item, idx) => renderSettingItem(item, idx === group.items.length - 1))}
                        </GlassCard>
                    </View>
                ))}

                {/* App Version */}
                <Text style={[styles.version, { color: colors.textSecondary }]}>
                    MediStore Pro v1.0.0
                </Text>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Icon name="log-out-outline" size={20} color={COLORS.danger} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        padding: SPACING.md,
        paddingTop: SPACING.xl,
        ...SHADOWS.small,
    },
    title: { fontSize: FONT_SIZES.xl, fontWeight: '700' },
    content: { padding: SPACING.md, paddingBottom: 100 },
    profileCard: {
        alignItems: 'center',
        padding: SPACING.lg,
        marginBottom: SPACING.md,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    avatarText: { fontSize: 36 },
    storeName: { fontSize: FONT_SIZES.xl, fontWeight: '700' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.xs },
    ratingText: { marginLeft: 4, fontSize: FONT_SIZES.sm },
    editButton: {
        marginTop: SPACING.md,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    settingsGroup: { marginBottom: SPACING.md },
    groupTitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        marginBottom: SPACING.sm,
        marginLeft: SPACING.xs,
        textTransform: 'uppercase',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingLabel: { flex: 1, marginLeft: SPACING.md, fontSize: FONT_SIZES.md },
    settingRight: { flexDirection: 'row', alignItems: 'center' },
    settingValue: { fontSize: FONT_SIZES.sm, marginRight: SPACING.xs },
    version: {
        textAlign: 'center',
        fontSize: FONT_SIZES.sm,
        marginVertical: SPACING.md,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.danger,
        marginBottom: SPACING.xl,
    },
    logoutText: { color: COLORS.danger, fontWeight: '600', marginLeft: SPACING.xs },
});

export default SettingsScreen;
