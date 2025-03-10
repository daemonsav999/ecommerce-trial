import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

// You'll need to create these actions
import { setNotificationToken } from '../store/slices/notificationsSlice';

export const NotificationHandler: React.FC = () => {
  const navigationRef = useRef(useNavigation());
  const dispatch = useDispatch();

  useEffect(() => {
    registerForPushNotifications();
    setupNotificationHandler();
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Replace with your Expo project ID
      });
      
      dispatch(setNotificationToken(token.data));

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (error) {
      console.log('Error getting push token:', error);
    }
  };

  const setupNotificationHandler = () => {
    Notifications.addNotificationReceivedListener((notification) => {
      // Handle received notification
      console.log('Notification received:', notification);
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
      const {
        notification: {
          request: {
            content: { data },
          },
        },
      } = response;

      // Handle notification click
      if (data && data.screen) {
        navigationRef.current?.navigate(data.screen, data.params);
      }
    });
  };

  return null;
};