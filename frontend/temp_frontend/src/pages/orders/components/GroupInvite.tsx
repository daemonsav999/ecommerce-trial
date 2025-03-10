import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Button } from '../../../components/ui/Button';
import { CountdownTimer } from '../../../components/ui/CountdownTimer';

interface GroupInviteProps {
  groupDetails: {
    id: string;
    deadline: string;
    currentMembers: number;
    requiredMembers: number;
    groupPrice: number;
  };
  onShare: () => void;
  style?: ViewStyle;
}

export const GroupInvite = ({ groupDetails, onShare, style }: GroupInviteProps) => {
  const remainingSlots = groupDetails.requiredMembers - groupDetails.currentMembers;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Group Buy Status</Text>
      
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{remainingSlots}</Text>
          <Text style={styles.statLabel}>Slots Left</Text>
        </View>
        
        <View style={styles.stat}>
          <Text style={styles.statValue}>{groupDetails.currentMembers}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        
        <View style={styles.stat}>
          <Text style={styles.statValue}>¥{groupDetails.groupPrice}</Text>
          <Text style={styles.statLabel}>Each</Text>
        </View>
      </View>

      <View style={styles.timer}>
        <Text style={styles.timerLabel}>Ends in:</Text>
        <CountdownTimer 
          deadline={groupDetails.deadline}
          onExpire={() => {/* Handle expiry */}}
        />
      </View>

      <Button
        title="Invite Friends"
        onPress={onShare}
        leftIcon={<Ionicons name="share-social" size={20} color="#fff" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4D4F',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  timer: {
    alignItems: 'center',
    gap: 8,
  },
  timerLabel: {
    fontSize: 14,
    color: '#666',
  },
});