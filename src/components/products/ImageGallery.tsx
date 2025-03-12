import React, { useState, useRef } from 'react';
import { 
  View, 
  Image, 
  FlatList, 
  Dimensions, 
  StyleSheet, 
  Pressable 
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface ImageGalleryProps {
  images: Array<{
    id: string;
    url: string;
    alt?: string;
  }>;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const THUMBNAIL_SIZE = 64;
const THUMBNAIL_SPACING = 8;

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainListRef = useRef<FlatList>(null);
  const thumbnailListRef = useRef<FlatList>(null);

  const handlePageChange = (index: number) => {
    setActiveIndex(index);
    thumbnailListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
    Haptics.selectionAsync();
  };

  const renderThumbnail = ({ item, index }: { item: any; index: number }) => {
    const isActive = index === activeIndex;
    
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{
          scale: withSpring(isActive ? 1.1 : 1)
        }],
        borderWidth: withSpring(isActive ? 2 : 0)
      };
    });

    return (
      <Pressable
        onPress={() => {
          mainListRef.current?.scrollToIndex({ index, animated: true });
          handlePageChange(index);
        }}
      >
        <Animated.View style={[styles.thumbnail, animatedStyle]}>
          <Image
            source={{ uri: item.url }}
            style={styles.thumbnailImage}
            resizeMode="cover"
          />
          {isActive && (
            <BlurView
              intensity={20}
              style={StyleSheet.absoluteFill}
            />
          )}
        </Animated.View>
      </Pressable>
    );
  };

  const renderImage = ({ item }: { item: any }) => (
    <Image
      source={{ uri: item.url }}
      style={styles.mainImage}
      resizeMode="cover"
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={mainListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderImage}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / SCREEN_WIDTH
          );
          handlePageChange(newIndex);
        }}
      />

      <View style={styles.thumbnailContainer}>
        <FlatList
          ref={thumbnailListRef}
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderThumbnail}
          contentContainerStyle={styles.thumbnailList}
        />
      </View>

      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.activeDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SCREEN_WIDTH,
    backgroundColor: '#fff',
  },
  mainImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    height: THUMBNAIL_SIZE + 16,
  },
  thumbnailList: {
    paddingHorizontal: 16,
    gap: THUMBNAIL_SPACING,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
    borderColor: '#FF4D4F',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: '#FF4D4F',
  },
});