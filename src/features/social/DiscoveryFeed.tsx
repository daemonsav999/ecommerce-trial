import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { GroupDealCard } from './GroupDealCard';
import { TeamActivityCard } from './TeamActivityCard';
import { FlashSaleTimer } from './FlashSaleTimer';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from '../../hooks/useLocation';

export const DiscoveryFeed = () => {
  const { user } = useAuth();
  const { location } = useLocation();
  const [activeTab, setActiveTab] = useState<'trending' | 'nearby' | 'friends'>('trending');

  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    refetch
  } = useInfiniteQuery({
    queryKey: ['discovery-feed', activeTab, location],
    queryFn: ({ pageParam = 1 }) => api.get(`/discovery/${activeTab}`, {
      params: {
        page: pageParam,
        lat: location?.latitude,
        lng: location?.longitude,
        userId: user?.id
      }
    }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'groupDeal':
        return <GroupDealCard deal={item} />;
      case 'teamActivity':
        return <TeamActivityCard activity={item} />;
      case 'flashSale':
        return (
          <>
            <FlashSaleTimer endsAt={item.endsAt} />
            <GroupDealCard deal={item} isFlashSale />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <TabBar
        tabs={['trending', 'nearby', 'friends']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <FlatList
        data={data?.pages.flatMap(page => page.items) ?? []}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        contentContainerStyle={styles.content}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    gap: 16,
  },
});