import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../stores/useThemeStore';
import { Bell, User, Search, Menu } from 'lucide-react-native';
import { SPACING, FONT_SIZES, SHADOWS, COLORS, BORDER_RADIUS } from '../../utils/constants';

interface HeaderProps {
    title?: string;
    subtitle?: string;
    showNotification?: boolean;
    showProfile?: boolean;
    showSearch?: boolean;
    onNotification?: () => void;
    onProfile?: () => void;
    onSearch?: () => void;
    style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
    title,
    subtitle,
    showNotification = true,
    showProfile = true,
    showSearch = false,
    onNotification,
    onProfile,
    onSearch,
    style,
}) => {
    const { colors, isDark } = useThemeStore();
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.container,
            {
                paddingTop: insets.top + SPACING.sm,
            },
            style
        ]}>
            <View style={styles.contentContainer}>
                {/* Title Section */}
                <View style={styles.leftContainer}>
                    {subtitle && (
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            {subtitle}
                        </Text>
                    )}
                    {title && (
                        <Text style={[styles.title, { color: colors.text }]}>
                            {title}
                        </Text>
                    )}
                </View>

                {/* Actions Section */}
                <View style={styles.rightContainer}>
                    {showSearch && (
                        <TouchableOpacity
                            onPress={onSearch}
                            style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                        >
                            <Search size={22} color={colors.text} />
                        </TouchableOpacity>
                    )}

                    {showNotification && (
                        <TouchableOpacity
                            onPress={onNotification}
                            style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                        >
                            <Bell size={22} color={colors.text} />
                            <View style={styles.badge} />
                        </TouchableOpacity>
                    )}

                    {showProfile && (
                        <TouchableOpacity
                            onPress={onProfile}
                            style={[
                                styles.profileButton,
                                { borderColor: colors.border }
                            ]}
                        >
                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>U</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '500',
        marginBottom: 2,
        opacity: 0.8,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.danger,
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    profileButton: {
        marginLeft: SPACING.xs,
        padding: 2,
        borderRadius: 20,
        borderWidth: 1,
    }
});

export default React.memo(Header);
