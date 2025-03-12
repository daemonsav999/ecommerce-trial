import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface GroupBuyingTimerProps {
  deadline: string;
  onExpire: () => void;
}

export const GroupBuyingTimer = ({ deadline, onExpire }: GroupBuyingTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const pulseAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withRepeat(
          withSequence(
            withTiming(1.2, { duration: 500 }),
            withTiming(1, { duration: 500 })
          ),
          -1
        ),
      },
    ],
  }));

  useEffect(() => {
    const deadlineDate = new Date(deadline).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = deadlineDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        onExpire();
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline, onExpire]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, pulseAnimation]}>
        <Ionicons name="time-outline" size={24} color="#FF4D4F" />
      </Animated.View>

      <View style={styles.timerContainer}>
        <Text style={styles.label}>Ends in:</Text>
        <View style={styles.timeUnits}>
          <TimeUnit value={timeLeft.hours} unit="hours" />
          <Text style={styles.separator}>:</Text>
          <TimeUnit value={timeLeft.minutes} unit="min" />
          <Text style={styles.separator}>:</Text>
          <TimeUnit value={timeLeft.seconds} unit="sec" />
        </View>
      </View>
    </View>
  );
};

const TimeUnit = ({ value, unit }: { value: number; unit: string }) => (
  <View style={styles.timeUnit}>
    <Text style={styles.timeValue}>{value.toString().padStart(2, '0')}</Text>
    <Text style={styles.timeLabel}>{unit}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    padding: 12,
    borderRadius: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  timerContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timeUnits: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeUnit: {
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4D4F',
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
  },
  separator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4D4F',
    marginHorizontal: 4,
  },
});