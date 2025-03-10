import FastImage from 'react-native-fast-image';
import { PerformanceOptimizer } from '@/utils/performance';

export const OptimizedImage = ({ url, width, height, ...props }) => {
  const optimizedUrl = PerformanceOptimizer.getOptimizedImageURL(url, width, height);
  
  return (
    <FastImage
      source={{ uri: optimizedUrl }}
      resizeMode="cover"
      cacheControl="immutable"
      priority={FastImage.priority.normal}
      {...props}
    />
  );
};