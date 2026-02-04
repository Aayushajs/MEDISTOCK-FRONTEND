import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Platform, Image } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../stores/useThemeStore';
import { Package, Plus, BarChart2, Settings } from 'lucide-react-native';
import { COLORS, SHADOWS, SPACING } from '../../utils/constants';
import HomeIcon from '../../assets/image/Homeicon.png';

const { width } = Dimensions.get('window');

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const { colors } = useThemeStore();
    const insets = useSafeAreaInsets();

    // Dynamic height calculation
    const TAB_BAR_HEIGHT = 60;
    const paddingBottom = insets.bottom > 0 ? insets.bottom : 10;
    const height = TAB_BAR_HEIGHT + paddingBottom;

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: colors.card,
                borderTopColor: colors.border,
                height: height,
                paddingBottom: paddingBottom
            }
        ]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                // Render different icon based on route
                const getIcon = () => {
                    const color = isFocused ? COLORS.primary : colors.textSecondary;
                    const size = 24;

                    switch (route.name) {
                        case 'Dashboard':
                            return (
                                <Image
                                    source={HomeIcon}
                                    style={{
                                        width: size,
                                        height: size,
                                        tintColor: color
                                    }}
                                    resizeMode="contain"
                                />
                            );
                        case 'Inventory': return <Package size={size} color={color} />;
                        case 'AddAction': return <Plus size={32} color="#fff" />;
                        case 'Analytics': return <BarChart2 size={size} color={color} />;
                        case 'Settings': return <Settings size={size} color={color} />;
                        default:
                            return (
                                <Image
                                    source={HomeIcon}
                                    style={{
                                        width: size,
                                        height: size,
                                        tintColor: color
                                    }}
                                    resizeMode="contain"
                                />
                            );
                    }
                };

                const isAddButton = route.name === 'AddAction';

                if (isAddButton) {
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.addButtonWrapper}
                            activeOpacity={0.9}
                        >
                            <View style={[styles.addButton, { backgroundColor: COLORS.primary }]}>
                                {getIcon()}
                            </View>
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID} // corrected property name
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabItem}
                        activeOpacity={0.8}
                    >
                        {getIcon()}
                        <Text style={[
                            styles.label,
                            { color: isFocused ? COLORS.primary : colors.textSecondary, fontWeight: isFocused ? '600' : '500' }
                        ]}>
                            {label as string}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        ...SHADOWS.large,
        elevation: 10, // Explicit elevation for Android
        borderTopWidth: 0.5,
        paddingTop: 10,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 10,
        marginTop: 4,
    },
    addButtonWrapper: {
        top: -25, // Floating effect
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
    },
    addButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.large,
        elevation: 8,
    },
});

export default React.memo(CustomTabBar);
