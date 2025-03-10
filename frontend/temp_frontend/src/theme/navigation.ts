import { Platform } from 'react-native';

export const navigationTheme = {
  headerStyle: Platform.select({
    web: {
      height: 60,
      borderBottom: '1px solid #eee',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    default: {
      height: 60,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
  }),
  // Add other navigation-specific theme options
};