import { Platform } from 'react-native';

export const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    text: '#000000',
    error: '#FF3B30',
    success: '#34C759',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: Platform.select({
      web: {
        fontSize: 32,
        lineHeight: '40px',
      },
      default: {
        fontSize: 32,
        lineHeight: 40,
      },
    }),
    body: Platform.select({
      web: {
        fontSize: 16,
        lineHeight: '24px',
      },
      default: {
        fontSize: 16,
        lineHeight: 24,
      },
    }),
  },
  // Platform-specific shadows
  shadows: Platform.select({
    web: {
      small: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px',
      medium: 'rgba(0, 0, 0, 0.15) 0px 2px 6px 0px',
      large: 'rgba(0, 0, 0, 0.2) 0px 4px 12px 0px',
    },
    default: {
      small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
      },
      large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
      },
    },
  }),
};