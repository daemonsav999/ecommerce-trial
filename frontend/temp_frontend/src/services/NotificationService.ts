import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { api } from './api';

class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    this.initialize();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('User notification permissions denied');
      }
    }

    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Handle quit state messages
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('Quit state notification:', remoteMessage);
      }
    });
  }

  async registerDevice() {
    try {
      const token = await messaging().getToken();
      await api.post('/notifications/register', { token });
      return token;
    } catch (error) {
      console.error('Failed to register device:', error);
      throw error;
    }
  }

  async subscribeToTopic(topic: string) {
    try {
      await messaging().subscribeToTopic(topic);
    } catch (error) {
      console.error(`Failed to subscribe to topic ${topic}:`, error);
      throw error;
    }
  }

  async unsubscribeFromTopic(topic: string) {
    try {
      await messaging().unsubscribeFromTopic(topic);
    } catch (error) {
      console.error(`Failed to unsubscribe from topic ${topic}:`, error);
      throw error;
    }
  }
}

export const notificationService = NotificationService.getInstance();