import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useTeamFormation } from '../../hooks/useTeamFormation';
import { TeamMemberCard } from './TeamMemberCard';
import { TeamProgress } from './TeamProgress';
import { Button } from '../../components/ui/Button';
import { ShareCard } from '../social/ShareCard';
import { useAnalytics } from '../../hooks/useAnalytics';

interface TeamFormationProps {
  productId: string;
  groupBuyId: string;
  targetMembers: number;
  deadline: string;
  price: number;
  teamPrice: number;
}

export const TeamFormation = ({
  productId,
  groupBuyId,
  targetMembers,
  deadline,
  price,
  teamPrice,
}: TeamFormationProps) => {
  const {
    teamMembers,
    isLeader,
    loading,
    joinTeam,
    inviteMember,
    checkTeamStatus,
  } = useTeamFormation(groupBuyId);

  const analytics = useAnalytics();
  const [inviteLink, setInviteLink] = useState<string>('');

  useEffect(() => {
    const generateInviteLink = async () => {
      const link = await DynamicLinks.createDynamicLink({
        link: `https://your-app.com/team/${groupBuyId}`,
        domainUriPrefix: 'https://yourapp.page.link',
        android: {
          packageName: 'com.yourapp.android',
        },
        ios: {
          bundleId: 'com.yourapp.ios',
          appStoreId: 'your-app-store-id',
        },
        social: {
          title: `Join my team and save ${((price - teamPrice) / price * 100).toFixed(0)}%!`,
          descriptionText: `Only ${targetMembers - teamMembers.length} spots left! Ends in ${getTimeLeft(deadline)}`,
          imageUrl: `https://your-cdn.com/products/${productId}/share-image.jpg`,
        },
      });
      setInviteLink(link);
    };

    generateInviteLink();
  }, [groupBuyId, teamMembers.length]);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Join my team and get an amazing deal! Only ${targetMembers - teamMembers.length} spots left!`,
        url: inviteLink,
      });

      if (result.action === Share.sharedAction) {
        analytics.track('Team_Invite_Shared', {
          groupBuyId,
          productId,
          platform: result.activityType,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TeamProgress 
        current={teamMembers.length}
        target={targetMembers}
        deadline={deadline}
        style={styles.progress}
      />

      <View style={styles.priceSection}>
        <Text style={styles.originalPrice}>¥{price}</Text>
        <Text style={styles.teamPrice}>¥{teamPrice}</Text>
        <Text style={styles.discount}>
          {((price - teamPrice) / price * 100).toFixed(0)}% OFF
        </Text>
      </View>

      <FlatList
        data={teamMembers}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TeamMemberCard
            member={item}
            isLeader={item.isLeader}
            style={styles.memberCard}
          />
        )}
        ListFooterComponent={() => (
          Array(targetMembers - teamMembers.length).fill(0).map((_, i) => (
            <View key={i} style={styles.emptySlot}>
              <Text style={styles.emptySlotText}>?</Text>
            </View>
          ))
        )}
        style={styles.memberList}
      />

      <ShareCard
        title="Invite friends to join your team!"
        description={`Get ${teamPrice}¥ when ${targetMembers} people join`}
        image={require('../../assets/invite-friends.png')}
        onShare={handleShare}
        style={styles.shareCard}
      />

      {!isLeader && (
        <Button
          title="Join Team"
          onPress={() => joinTeam()}
          loading={loading}
          style={styles.joinButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    gap: 16,
  },
  progress: {
    marginBottom: 16,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  teamPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4D4F',
  },
  discount: {
    fontSize: 16,
    color: '#FF4D4F',
  },
  memberList: {
    marginVertical: 16,
  },
  memberCard: {
    marginRight: 12,
  },
  emptySlot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emptySlotText: {
    fontSize: 20,
    color: '#999',
  },
  shareCard: {
    marginTop: 16,
  },
  joinButton: {
    marginTop: 16,
  },
});