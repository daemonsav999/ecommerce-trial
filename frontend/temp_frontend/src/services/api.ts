import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, GroupBuy, User, Team, Reward } from '@/types';

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).user.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['Products', 'GroupBuys', 'Cart', 'Teams', 'Rewards', 'User'],
  endpoints: (builder) => ({
    // Existing endpoints
    getProducts: builder.query<Product[], void>({
      query: () => 'products',
      providesTags: ['Products']
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `products/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Products', id }]
    }),
    getGroupBuys: builder.query<GroupBuy[], void>({
      query: () => 'group-buys',
      providesTags: ['GroupBuys']
    }),
    createGroupBuy: builder.mutation<GroupBuy, Partial<GroupBuy>>({
      query: (body) => ({
        url: 'group-buys',
        method: 'POST',
        body
      }),
      invalidatesTags: ['GroupBuys']
    }),
    joinGroupBuy: builder.mutation<void, string>({
      query: (id) => ({
        url: `group-buys/${id}/join`,
        method: 'POST'
      }),
      invalidatesTags: ['GroupBuys']
    }),

    // New endpoints
    getTeam: builder.query<Team, string>({
      query: (id) => `teams/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Teams', id }]
    }),
    createTeam: builder.mutation<Team, { productId: string; groupBuyId: string }>({
      query: (body) => ({
        url: 'teams',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Teams', 'GroupBuys']
    }),
    joinTeam: builder.mutation<void, { teamId: string; inviteCode?: string }>({
      query: ({ teamId, inviteCode }) => ({
        url: `teams/${teamId}/join`,
        method: 'POST',
        body: { inviteCode }
      }),
      invalidatesTags: ['Teams', 'GroupBuys']
    }),
    getUserRewards: builder.query<Reward[], string>({
      query: (userId) => `users/${userId}/rewards`,
      providesTags: ['Rewards']
    }),
    redeemReward: builder.mutation<void, { rewardId: string }>({
      query: ({ rewardId }) => ({
        url: `rewards/${rewardId}/redeem`,
        method: 'POST'
      }),
      invalidatesTags: ['Rewards', 'User']
    }),
    getTeamRecommendations: builder.query<Team[], void>({
      query: () => 'teams/recommendations',
      providesTags: ['Teams']
    }),
    searchNearbyTeams: builder.query<Team[], { lat: number; lng: number; radius: number }>({
      query: (params) => ({
        url: 'teams/nearby',
        params
      }),
      providesTags: ['Teams']
    }),
    trackSocialShare: builder.mutation<void, { 
      type: string;
      platform: string;
      targetId: string;
    }>({
      query: (body) => ({
        url: 'social/share',
        method: 'POST',
        body
      })
    }),
  })
});

export const {
  // Existing exports
  useGetProductsQuery,
  useGetProductQuery,
  useGetGroupBuysQuery,
  useCreateGroupBuyMutation,
  useJoinGroupBuyMutation,
  // New exports
  useGetTeamQuery,
  useCreateTeamMutation,
  useJoinTeamMutation,
  useGetUserRewardsQuery,
  useRedeemRewardMutation,
  useGetTeamRecommendationsQuery,
  useSearchNearbyTeamsQuery,
  useTrackSocialShareMutation,
} = api;