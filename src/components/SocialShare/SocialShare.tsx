import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Share,
  Platform 
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

interface SocialShareProps {
  product: {
    id: string;
    name: string;
    price: number;
    groupPrice: number;
  };
  groupBuyingDetails?: {
    id: string;
    deadline: string;
  };
}

export const SocialShare = ({ product, groupBuyingDetails }: SocialShareProps) => {
  const [showQR, setShowQR] = useState(false);

  const shareUrl = groupBuyingDetails 
    ? `https://your-app.com/group/${groupBuyingDetails.id}`
    : `https://your-app.com/product/${product.id}`;

  const shareMessage = groupBuyingDetails
    ? `Join my group buy for ${product.name}! Save ${product.price - product.groupPrice}¥ - Ends in ${getTimeLeft(groupBuyingDetails.deadline)}`
    : `Check out ${product.name} on our app!`;

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      await Share.share({
        message: shareMessage,
        url: Platform.select({
          ios: shareUrl,
          android: shareUrl,
        }),
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Clipboard.setStringAsync(shareUrl);
    // Show toast or feedback
  };

  const toggleQR = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowQR(!showQR);
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        <ShareButton
          icon="share-social"
          label="Share"
          onPress={handleShare}
        />
        <ShareButton
          icon="copy"
          label="Copy Link"
          onPress={handleCopyLink}
        />
        <ShareButton
          icon="qr-code"
          label="Show QR"
          onPress={toggleQR}
        />
      </View>

      {showQR && (
        <BlurView intensity={20} style={styles.qrContainer}>
          <QRCode
            value={shareUrl}
            size={200}
            color="#000"
            backgroundColor="#fff"
          />
          <Text style={styles.qrText}>
            Scan to join the group buy
          </Text>
        </BlurView>
      )}
    </View>
  );
};

interface ShareButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

const ShareButton = ({ icon, label, onPress }: ShareButtonProps) => (
  <Pressable 
    style={styles.shareButton}
    onPress={onPress}
  >
    <Ionicons name={icon} size={24} color="#666" />
    <Text style={styles.buttonLabel}>{label}</Text>
  </Pressable>
);

const getTimeLeft = (deadline: string) => {
  const end = new Date(deadline).getTime();
  const now = new Date().getTime();
  const diff = end - now;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours} hours`;
  
  const days = Math.floor(hours / 24);
  return `${days} days`;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shareButton: {
    alignItems: 'center',
    gap: 4,
  },
  buttonLabel: {
    fontSize: 12,
    color: '#666',
  },
  qrContainer: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  qrText: {
    fontSize: 14,
    color: '#666',
  },
});