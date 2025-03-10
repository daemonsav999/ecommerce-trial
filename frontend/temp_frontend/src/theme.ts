import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

const fontConfig = {
  // Add custom fonts here
};

export const theme = {
  ...MD3LightTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    error: '#FF4B4B',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
    background: '#F5F5F5',
    surface: '#FFFFFF',
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 8,
};