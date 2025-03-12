import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface ProductInfoProps {
  product: {
    description: string;
    specifications: Array<{
      label: string;
      value: string;
    }>;
    highlights: string[];
    shipping: {
      methods: string[];
      estimatedDays: number;
    };
  };
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'shipping'>('details');

  const handleTabPress = (tab: typeof activeTab) => {
    Haptics.selectionAsync();
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.description}>{product.description}</Text>
            
            <View style={styles.highlights}>
              <Text style={styles.sectionTitle}>Highlights</Text>
              {product.highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#52c41a" />
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'specs':
        return (
          <View style={styles.contentContainer}>
            {product.specifications.map((spec, index) => (
              <View key={index} style={styles.specItem}>
                <Text style={styles.specLabel}>{spec.label}</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </View>
            ))}
          </View>
        );

      case 'shipping':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.shippingEstimate}>
              Estimated delivery: {product.shipping.estimatedDays} days
            </Text>
            
            <Text style={styles.sectionTitle}>Shipping Methods</Text>
            {product.shipping.methods.map((method, index) => (
              <View key={index} style={styles.shippingMethod}>
                <Ionicons name="airplane-outline" size={20} color="#666" />
                <Text style={styles.methodText}>{method}</Text>
              </View>
            ))}
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TabButton 
          title="Details"
          isActive={activeTab === 'details'}
          onPress={() => handleTabPress('details')}
        />
        <TabButton 
          title="Specifications"
          isActive={activeTab === 'specs'}
          onPress={() => handleTabPress('specs')}
        />
        <TabButton 
          title="Shipping"
          isActive={activeTab === 'shipping'}
          onPress={() => handleTabPress('shipping')}
        />
      </View>

      <Animated.View style={styles.content}>
        {renderContent()}
      </Animated.View>
    </View>
  );
};

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton = ({ title, isActive, onPress }: TabButtonProps) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{
      scale: withSpring(isActive ? 1 : 0.95)
    }],
    backgroundColor: withTiming(
      isActive ? '#FF4D4F' : '#FFF',
      { duration: 200 }
    ),
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.tab, animatedStyle]}>
        <Text style={[
          styles.tabText,
          { color: isActive ? '#FFF' : '#666' }
        ]}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 0,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    minHeight: 200,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  highlights: {
    gap: 8,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  highlightText: {
    fontSize: 14,
    color: '#333',
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  specLabel: {
    fontSize: 14,
    color: '#666',
  },
  specValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  shippingEstimate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#52c41a',
  },
  shippingMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  methodText: {
    fontSize: 14,
    color: '#333',
  },
});