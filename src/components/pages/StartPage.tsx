import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Animated, StatusBar, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useThemeStore } from '../../stores/useThemeStore';

const { width, height } = Dimensions.get('window');

// ============================================
// Data
// ============================================

const ONBOARDING_DATA = [
    {
        id: '1',
        title: 'Your Trusted\nOnline Pharmacy',
        description: 'Order genuine medicines and healthcare products from the comfort of your home.',
        image: 'https://static.vecteezy.com/system/resources/thumbnails/057/178/893/small_2x/happy-young-asian-man-giving-a-thumbs-up-while-holding-multiple-packages-in-a-bright-indoor-setting-happy-young-asian-man-thumb-up-and-holding-package-parcel-boxs-isolated-on-transparent-background-free-png.png',
        bgParams: { circle1: '#4facfe', circle2: '#00f2fe' }, // Blue theme
        dimensions: { width: width * 0.9, height: width * 0.9, marginBottom: 100 }
    },
    {
        id: '2',
        title: 'Super Fast\nDelivery',
        description: 'Get your medicines delivered to your doorstep in minutes. Real-time tracking available.',
        image: 'https://static.vecteezy.com/system/resources/thumbnails/010/916/188/small/3d-delivery-van-and-cardboard-boxes-product-goods-shipping-transport-fast-service-truck-png.png',
        bgParams: { circle1: '#43e97b', circle2: '#38f9d7' }, // Green theme
        dimensions: { width: width * 1, height: width * 1, marginBottom: 10 }
    },
    {
        id: '3',
        title: 'Track Health &\nSave Money',
        description: 'Monitor your refill dates and get exclusive discounts on monthly subscriptions.',
        image: 'https://static.vecteezy.com/system/resources/thumbnails/010/916/350/small/3d-mobile-phone-delivery-truck-online-shopping-fast-delivery-service-png.png',
        bgParams: { circle1: '#fa709a', circle2: '#fee140' }, // Orange/Pink theme
        dimensions: { width: width * 1.2, height: width * 1.2, marginBottom: 10, }
    }
];

// ============================================
// Circular Progress Button
// ============================================

const ProgressButton = ({ percentage, onPress, isDark }: { percentage: number, onPress: () => void, isDark: boolean }) => {
    const size = 64;
    const strokeWidth = 3;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;

    const progressAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progressAnimation, {
            toValue: percentage,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    }, [percentage]);

    const strokeDashoffset = circumference - (circumference * percentage) / 100;

    return (
        <View style={styles.buttonContainer}>
            <Svg width={size} height={size}>
                <Circle
                    stroke={isDark ? "rgba(255,255,255,0.1)" : "#E0E0E0"}
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <Circle
                    stroke={COLORS.primary}
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </Svg>
            <TouchableOpacity onPress={onPress} style={styles.buttonFab} activeOpacity={0.8}>
                <ArrowRight size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

// ============================================
// Back Button
// ============================================

const BackButton = ({ onPress, isDark }: { onPress: () => void, isDark: boolean }) => {
    const size = 64;
    const strokeWidth = 3;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;

    return (
        <View style={styles.buttonContainer}>
            {/* Static Ring for symmetry */}
            <Svg width={size} height={size}>
                <Circle
                    stroke={isDark ? "rgba(255,255,255,0.1)" : "#E0E0E0"}
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
            </Svg>
            {/* FAB with same style as Next button but potentially different color if desired, currently keeping primary for 'same' look */}
            <TouchableOpacity onPress={onPress} style={styles.buttonFab} activeOpacity={0.8}>
                <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

// ============================================
// Optimized Start Page Component
// ============================================

const StartPage = () => {
    const navigation = useNavigation<any>();
    const { colors, isDark } = useThemeStore();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Animation Value: 0 to N-1 (scroll position proxy)
    // We use a single Animated.Value to drive everything
    const scrollX = useRef(new Animated.Value(0)).current;

    const scrollToNext = () => {
        if (currentIndex < ONBOARDING_DATA.length - 1) {
            animateToSlide(currentIndex + 1);
        } else {
            navigation.navigate('Login');
        }
    };

    const scrollToPrev = () => {
        if (currentIndex > 0) {
            animateToSlide(currentIndex - 1);
        }
    };

    const skip = () => {
        navigation.navigate('Login');
    };

    const animateToSlide = (nextIndex: number) => {
        Animated.timing(scrollX, {
            toValue: nextIndex,
            duration: 400, // Slightly faster feel
            useNativeDriver: true, // Key for smoothness
            easing: Easing.out(Easing.cubic), // Cubic feels snappier than ease
        }).start(() => {
            setCurrentIndex(nextIndex);
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />

            {/* 1. Background Layers (Cross-fading) */}
            {ONBOARDING_DATA.map((item, index) => {
                const opacity = scrollX.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [0, 1, 0],
                    extrapolate: 'clamp',
                });

                // Background Color
                const bgColor = isDark ? '#121212' : '#ffffff';

                return (
                    <Animated.View
                        key={`bg-${index}`}
                        style={[
                            StyleSheet.absoluteFillObject,
                            { opacity, backgroundColor: bgColor }
                        ]}
                    >
                        {/* Blobs for this slide */}
                        <View style={[
                            styles.blob,
                            {
                                backgroundColor: item.bgParams.circle1,
                                top: -width * 0.2,
                                right: -width * 0.2,
                                width: width * 0.8,
                                height: width * 0.8,
                                opacity: isDark ? 0.15 : 0.3
                            }
                        ]} />
                        <View style={[
                            styles.blob,
                            {
                                backgroundColor: item.bgParams.circle2,
                                top: height * 0.35,
                                left: -width * 0.25,
                                width: width * 0.6,
                                height: width * 0.6,
                                opacity: isDark ? 0.15 : 0.2
                            }
                        ]} />
                    </Animated.View>
                )
            })}

            {/* Skip Button */}
            <TouchableOpacity style={styles.skipButton} onPress={skip}>
                <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
            </TouchableOpacity>

            {/* 2. Content Slides (Stacked & Animated) */}
            <View style={styles.contentWrapper}>
                {ONBOARDING_DATA.map((item, index) => {
                    const opacity = scrollX.interpolate({
                        inputRange: [index - 0.5, index, index + 0.5],
                        outputRange: [0, 1, 0],
                        extrapolate: 'clamp',
                    });

                    const translateX = scrollX.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [50, 0, -50], // Slide effect
                        extrapolate: 'clamp',
                    });

                    const pointerEvents = index === currentIndex ? 'auto' : 'none';

                    return (
                        <Animated.View
                            key={`slide-${index}`}
                            pointerEvents={pointerEvents}
                            style={[
                                styles.slideContent,
                                StyleSheet.absoluteFillObject, // Stack them
                                {
                                    opacity,
                                    transform: [{ translateX }]
                                }
                            ]}
                        >
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={[
                                        styles.image,
                                        {
                                            width: item.dimensions?.width || width * 0.8,
                                            height: item.dimensions?.height || width * 0.8,
                                            marginBottom: item.dimensions?.marginBottom || 0
                                        }
                                    ]}
                                    resizeMode="contain"
                                />
                            </View>

                            <View style={styles.textContainer}>
                                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                                <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>
                            </View>
                        </Animated.View>
                    );
                })}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                {/* Back Button */}
                <View style={styles.leftButtonContainer}>
                    {currentIndex > 0 ? (
                        <BackButton onPress={scrollToPrev} isDark={isDark} />
                    ) : (
                        <View style={{ width: 64, height: 64 }} />
                    )}
                </View>

                {/* Progress Button */}
                <ProgressButton
                    percentage={(currentIndex + 1) * (100 / ONBOARDING_DATA.length)}
                    onPress={scrollToNext}
                    isDark={isDark}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // Updated Content Wrapper to hold stacked slides properly centrally
    contentWrapper: {
        marginTop: 60, // Space for Skip button / Status bar
        flex: 1,
        width: width,
        position: 'relative',
    },
    slideContent: {
        width: width,
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        justifyContent: 'center', // Center content vertically within the slide view
    },
    imageContainer: {
        // Fixed container size to ensure images align well generally, 
        // but flex is flexible.
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -80,
    },
    image: {
        // Base dimensions overridden inline
    },
    blob: {
        position: 'absolute',
        borderRadius: 999,
    },
    textContainer: {
        alignItems: 'center',
        marginTop: -90,
    },
    title: {
        fontSize: 30,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: SPACING.sm,
        lineHeight: 38,
    },
    description: {
        fontSize: FONT_SIZES.md,
        textAlign: 'center',
        paddingHorizontal: SPACING.xl,
        lineHeight: 22,
        maxWidth: '90%',
    },
    skipButton: {
        position: 'absolute',
        top: SPACING.xl + 20,
        right: SPACING.lg,
        zIndex: 50,
        padding: SPACING.sm,
    },
    skipText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        zIndex: 50,
    },
    buttonContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonFab: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    leftButtonContainer: {
        height: 64, // Matched size to ProgressButton container (64x64)
        width: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default StartPage;
