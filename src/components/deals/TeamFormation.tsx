import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { TeamMemberAvatar } from './TeamMemberAvatar';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

interface TeamFormationProps {
  currentMembers: TeamMember[];
  requiredMembers: number;
  teamLeader: TeamMember;
  onInvite?: () => void;
}

export const TeamFormation = ({ 
  currentMembers,
  requiredMembers,
  teamLeader,
  onInvite 
}: TeamFormationProps) => {
  const remainingSlots = requiredMembers - currentMembers.length;
  const progress = (currentMembers.length / requiredMembers) * 100;

  const handleInvite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onInvite?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Team Members</Text>
        <Text style={styles.subtitle}>
          {remainingSlots} more needed
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${progress}%` }]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentMembers.length}/{requiredMembers} joined
        </Text>
      </View>

      <View style={styles.membersContainer}>
        <View style={styles.leaderSection}>
          <TeamMemberAvatar 
            member={teamLeader}
            isLeader
          />
          <View style={styles.leaderInfo}>
            <Text style={styles.leaderName}>{teamLeader.name}</Text>
            <Text style={styles.leaderLabel}>Team Leader</Text>
          </View>
        </View>

        <View style={styles.membersList}>
          {currentMembers.map((member) => (
            <TeamMemberAvatar 
              key={member.id}
              member={member}
            />
          ))}

          {Array(remainingSlots).fill(0).map((_, index) => (
            <View 
              key={`empty-${index}`} 
              style={styles.emptySlot}
            >
              <Text style={styles.emptySlotText}>?</Text>
            </View>
          ))}
        </View>
      </View>

      <Pressable 
        style={styles.inviteButton}
        onPress={handleInvite}
      >
        <Text style={styles.inviteButtonText}>
          Invite Friends
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#FF4D4F',
  },
  progressContainer: {
    gap: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF4D4F',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  membersContainer: {
    gap: 16,
  },
  leaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leaderInfo: {
    flex: 1,
  },
  leaderName: {
    fontSize: 16,
    fontWeight: '500',
  },
  leaderLabel: {
    fontSize: 12,
    color: '#FF4D4F',
  },
  membersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emptySlot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
  },
  emptySlotText: {
    fontSize: 16,
    color: '#999',
  },
  inviteButton: {
    backgroundColor: '#FFF0F0',
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#FF4D4F',
    fontSize: 16,
    fontWeight: '500',
  },
});