import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ImageGallery } from '../../components/products/ImageGallery';
import { PriceSection } from '../../components/products/PriceSection';
import { GroupBuyingTimer } from '../../components/deals/GroupBuyingTimer';
import { TeamFormation } from '../../components/deals/TeamFormation';
import { ProductInfo } from '../../components/products/ProductInfo';
import { SocialShare } from '../../components/social/SocialShare';
import { BuyButtons } from './components/BuyButtons';
import { useProduct } from '../../hooks/useProduct';
import { ProductDetailSkeleton } from './components/ProductDetailSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';

type ProductDetailRouteProp = RouteProp<{
  ProductDetail: { productId: string };
}, 'ProductDetail'>;

export const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { productId } = route.params;
  
  const { 
    product, 
    groupBuyingDetails,
    isLoading,
    error 
  } = useProduct(productId);

  if (isLoading) return <ProductDetailSkeleton />;
  if (error) return <ErrorState error={error} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <ImageGallery images={product.images} />

        <View style={styles.detailsContainer}>
          <ProductInfo product={product} />
          
          <PriceSection 
            regularPrice={product.price}
            groupPrice={product.groupPrice}
            teamPrice={product.teamPrice}
          />

          {groupBuyingDetails && (
            <>
              <GroupBuyingTimer 
                deadline={groupBuyingDetails.deadline}
                onExpire={() => {/* Handle expiry */}}
              />
              
              <TeamFormation 
                currentMembers={groupBuyingDetails.currentMembers}
                requiredMembers={groupBuyingDetails.requiredMembers}
                teamLeader={groupBuyingDetails.teamLeader}
              />
            </>
          )}

          <SocialShare 
            product={product}
            groupBuyingDetails={groupBuyingDetails}
          />

          <BuyButtons 
            product={product}
            groupBuyingDetails={groupBuyingDetails}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  detailsContainer: {
    padding: 16,
    gap: 16,
  }
});