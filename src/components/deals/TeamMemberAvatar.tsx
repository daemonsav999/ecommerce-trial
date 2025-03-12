import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

interface TeamMemberAvatarProps {
  member: {
    avatar: string;
    name: string;
  };
  isLeader?: boolean;
  size?: number;
}

export const TeamMemberAvatar = ({ 
  member,
  isLeader,
  size = 40 
}: TeamMemberAvatarProps) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={{ uri: member.avatar }}
        style={[styles.avatar, { width: size, height: size }]}
      />
      {isLeader && (
        <View style={styles.leaderBadge}>
          <Ionicons name="crown" size={12} color="#FFA940" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 20,
  },
  leaderBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});