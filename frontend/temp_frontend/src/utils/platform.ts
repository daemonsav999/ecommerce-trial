import { Platform, Dimensions } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

export const getWindowDimensions = () => {
  if (isWeb) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return Dimensions.get('window');
};

export const getPlatformSpecificStyles = (webStyles: any, mobileStyles: any) => {
  return Platform.select({
    web: webStyles,
    default: mobileStyles,
  });
};