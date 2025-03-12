import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { I18nextProvider } from 'react-i18next';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Local imports
import { store, persistor } from './store';
import Navigation from './navigation';
import { theme } from './theme';
import i18n from './i18n';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineNotice } from './components/OfflineNotice';
import { NotificationHandler } from './components/NotificationHandler';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { CartProvider } from './contexts/CartContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make API calls, etc.
        await Promise.all([
          // Add your asset loading here
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();

    // Subscribe to network status updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <PaperProvider theme={theme}>
            <I18nextProvider i18n={i18n}>
              <SafeAreaProvider>
                <NavigationContainer>
                  <StripeProvider
                    publishableKey="your-publishable-key"
                    merchantIdentifier="your-merchant-identifier"
                  >
                    <WebSocketProvider>
                      <CartProvider>
                        {!isConnected && <OfflineNotice />}
                        <NotificationHandler />
                        <Navigation />
                      </CartProvider>
                    </WebSocketProvider>
                  </StripeProvider>
                </NavigationContainer>
              </SafeAreaProvider>
            </I18nextProvider>
          </PaperProvider>
        </PersistGate>
      </ReduxProvider>
    </ErrorBoundary>
  );
}