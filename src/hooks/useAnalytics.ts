import { useEffect } from 'react';
import Analytics from '@segment/analytics-react-native';
import { useAuth } from './useAuth';
import { Platform } from 'react-native';
import Config from 'react-native-config';

const analytics = new Analytics(Config.SEGMENT_WRITE_KEY);

export const useAnalytics = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      analytics.identify(user.id, {
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        platform: Platform.OS,
        appVersion: Config.APP_VERSION
      });
    }
  }, [user]);

  const track = (event: string, properties?: Record<string, any>) => {
    analytics.track(event, {
      ...properties,
      platform: Platform.OS,
      appVersion: Config.APP_VERSION,
      timestamp: new Date().toISOString()
    });
  };

  const screen = (name: string, properties?: Record<string, any>) => {
    analytics.screen(name, {
      ...properties,
      platform: Platform.OS,
      appVersion: Config.APP_VERSION
    });
  };

  return { track, screen };
};