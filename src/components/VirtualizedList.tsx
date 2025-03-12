import React, { useCallback, useRef, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useWindowDimensions } from 'react-native';

interface VirtualizedListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  itemHeight: number;
  windowSize?: number;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
}

export function VirtualizedList<T>({
  data,
  renderItem,
  itemHeight,
  windowSize = 10,
  onEndReached,
  onEndReachedThreshold = 0.5,
}: VirtualizedListProps<T>) {
  const { height: windowHeight } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const visibleItems = Math.ceil(windowHeight / itemHeight);
  const totalHeight = data.length * itemHeight;
  const bufferSize = Math.floor(windowSize / 2);

  const getVisibleRange = useCallback(() => {
    const start = Math.max(0, Math.floor(scrollPosition / itemHeight) - bufferSize);
    const end = Math.min(
      data.length,
      Math.ceil((scrollPosition + windowHeight) / itemHeight) + bufferSize
    );
    return { start, end };
  }, [scrollPosition, itemHeight, bufferSize, windowHeight, data.length]);

  const handleScroll = useCallback(
    (event) => {
      const { y } = event.nativeEvent.contentOffset;
      setScrollPosition(y);

      if (onEndReached && y + windowHeight >= totalHeight * onEndReachedThreshold) {
        onEndReached();
      }
    },
    [windowHeight, totalHeight, onEndReached, onEndReachedThreshold]
  );

  const { start, end } = getVisibleRange();
  const visibleData = data.slice(start, end);

  return (
    <ScrollView
      ref={scrollRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      removeClippedSubviews={true}
      style={styles.container}
    >
      <View style={{ height: totalHeight }}>
        {visibleData.map((item, index) => (
          <View
            key={start + index}
            style={[
              styles.itemContainer,
              {
                height: itemHeight,
                transform: [{ translateY: (start + index) * itemHeight }],
              },
            ]}
          >
            {renderItem(item, start + index)}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});