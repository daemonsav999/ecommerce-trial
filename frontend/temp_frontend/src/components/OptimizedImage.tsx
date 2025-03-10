import React, { useState, useEffect, useRef } from 'react';
import { Image, View, StyleSheet, Platform } from 'react-native';
import { BlurHash } from 'react-blurhash';

interface OptimizedImageProps {
  uri: string;
  width: number;
  height: number;
  blurhash?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  uri,
  width,
  height,
  blurhash,
  priority = false,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imageRef = useRef<Image>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && !priority) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadImage();
            observerRef.current?.disconnect();
          }
        },
        { rootMargin: '50px' }
      );

      if (imageRef.current) {
        observerRef.current.observe(imageRef.current);
      }

      return () => {
        observerRef.current?.disconnect();
      };
    } else {
      loadImage();
    }
  }, [uri]);

  const loadImage = () => {
    const img = new Image();
    img.src = getOptimizedImageUrl(uri, width, height);
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
  };

  const getOptimizedImageUrl = (url: string, width: number, height: number): string => {
    // Use next-gen formats like WebP with fallback
    const format = supportsWebP ? 'webp' : 'jpeg';
    
    // Add CDN optimization parameters
    return `${url}?w=${width}&h=${height}&fmt=${format}&q=${calculateQuality()}&fit=crop`;
  };

  const calculateQuality = (): number => {
    // Adjust quality based on network conditions and device capabilities
    const connection = (navigator as any).connection;
    if (connection) {
      if (connection.saveData) return 60;
      if (connection.effectiveType === '4g') return 85;
      return 75;
    }
    return 80;
  };

  return (
    <View style={[styles.container, { width, height }]}>
      {blurhash && !loaded && (
        <BlurHash
          hash={blurhash}
          width={width}
          height={height}
          resizeMode="cover"
        />
      )}
      
      <Image
        ref={imageRef}
        source={{ uri: getOptimizedImageUrl(uri, width, height) }}
        style={[
          styles.image,
          { opacity: loaded ? 1 : 0 },
          { width, height },
        ]}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});