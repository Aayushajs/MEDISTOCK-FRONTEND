import React, { useRef, useState, useEffect } from 'react';
import { View, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent, StyleSheet, Vibration } from 'react-native';
import MetricCard from './MetricCard';
import { SPACING } from '../../utils/constants';

const { width } = Dimensions.get('window');
// Card width is screen width minus outer padding. 
// User wants strict centering for all cards.
const CARD_WIDTH = width - (SPACING.md * 1.7);

const CARD_SPACING = SPACING.md;
const SNAP_INTERVAL = CARD_WIDTH + SPACING.md;

export interface MetricItem {
    id: string;
    title: string;
    value: string;
    trend: string;
    color: string;
    chartData: number[]; // For card sparkline
    chartColor?: string; // Darker color for ActivityChart
}

interface MetricCarouselProps {
    data: MetricItem[];
    onIndexChange: (index: number) => void;
}

const MetricCarousel: React.FC<MetricCarouselProps> = ({ data, onIndexChange }) => {
    const flatListRef = useRef<FlatList>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        // Calculate index based on offset. 
        // Adding half the interval ensures we switch when majority of card is visible.
        const index = Math.round(contentOffset / SNAP_INTERVAL);

        if (index !== activeIndex && index >= 0 && index < data.length) {
            setActiveIndex(index);
            onIndexChange(index);
            Vibration.vibrate(10); // Light vibration feedback
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={data}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={SNAP_INTERVAL}
                snapToAlignment="center"
                decelerationRate="fast"
                contentContainerStyle={[
                    styles.contentContainer,
                    { paddingHorizontal: SPACING.md }
                ]}
                onScroll={onScroll}
                scrollEventThrottle={16} // High frequency for smooth updates
                renderItem={({ item, index }) => (
                    <MetricCard
                        title={item.title}
                        value={item.value}
                        trend={item.trend}
                        color={item.color}
                        chartData={item.chartData}
                        isActive={index === activeIndex}
                        style={index === data.length - 1 ? { marginRight: 0 } : {}}
                        cardWidth={CARD_WIDTH}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: SPACING.md,
    },
    contentContainer: {
        // Handled inline
    }
});

export default MetricCarousel;
