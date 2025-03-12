import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  Product, 
  Category,
  User,
  Cart,
  Order,
  GroupBuy,
  Team,
  Reward,
  ChatMessage,
  LiveStream,
  Review,
  Address,
  PaymentMethod,
  Notification
} from '../types';

// Define base types for API responses
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      // Get token from state
      const token = (getState() as any).auth.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
    credentials: 'include', // Include credentials for cross-origin requests
  }),
  tagTypes: [
    'Products',
    'Categories',
    'Cart',
    'Orders',
    'GroupBuys',
    'Teams',
    'User',
    'Rewards',
    'Chat',
    'LiveStreams',
    'Reviews',
    'Notifications'
  ],
  endpoints: (builder) => ({
    // Product endpoints
    getProducts: builder.query<PaginatedResponse<Product>, {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }>({
      query: (params) => ({
        url: 'products',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Products' as const, id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),

    getProduct: builder.query<Product, string>({
      query: (id) => `products/${id}`,
      providesTags: (_, __, id) => [{ type: 'Products', id }],
    }),

    // Category endpoints
    getCategories: builder.query<Category[], void>({
      query: () => 'categories',
      providesTags: ['Categories'],
    }),

    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (body) => ({
        url: 'categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),

    updateCategory: builder.mutation<Category, { id: string; body: Partial<Category> }>({
      query: ({ id, body }) => ({
        url: `categories/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),

    // Cart endpoints
    getCart: builder.query<Cart, void>({
      query: () => 'cart',
      providesTags: ['Cart'],
    }),

    updateCart: builder.mutation<Cart, { productId: string; quantity: number }>({
      query: (body) => ({
        url: 'cart/update',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),

    // Order endpoints
    createOrder: builder.mutation<Order, {
      items: { productId: string; quantity: number }[];
      addressId: string;
      paymentMethodId: string;
      groupBuyId?: string;
    }>({
      query: (body) => ({
        url: 'orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Orders', 'Cart'],
    }),

    getOrders: builder.query<PaginatedResponse<Order>, { page?: number; limit?: number }>({
      query: (params) => ({
        url: 'orders',
        params,
      }),
      providesTags: ['Orders'],
    }),

    // Group Buy endpoints
    getGroupBuys: builder.query<PaginatedResponse<GroupBuy>, {
      page?: number;
      limit?: number;
      status?: 'active' | 'completed' | 'upcoming';
    }>({
      query: (params) => ({
        url: 'group-buys',
        params,
      }),
      providesTags: ['GroupBuys'],
    }),

    createGroupBuy: builder.mutation<GroupBuy, {
      productId: string;
      minParticipants: number;
      expiresAt: string;
      discount: number;
    }>({
      query: (body) => ({
        url: 'group-buys',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['GroupBuys'],
    }),

    // Team endpoints
    createTeam: builder.mutation<Team, {
      groupBuyId: string;
      name?: string;
    }>({
      query: (body) => ({
        url: 'teams',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Teams', 'GroupBuys'],
    }),

    joinTeam: builder.mutation<void, {
      teamId: string;
      inviteCode?: string;
    }>({
      query: (body) => ({
        url: 'teams/join',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Teams', 'GroupBuys'],
    }),

    // User endpoints
    getCurrentUser: builder.query<User, void>({
      query: () => 'users/me',
      providesTags: ['User'],
    }),

    updateUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: 'users/me',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // Address endpoints
    getUserAddresses: builder.query<Address[], void>({
      query: () => 'addresses',
      providesTags: ['User'],
    }),

    addAddress: builder.mutation<Address, Partial<Address>>({
      query: (body) => ({
        url: 'addresses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // Payment endpoints
    getUserPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => 'payment-methods',
      providesTags: ['User'],
    }),

    addPaymentMethod: builder.mutation<PaymentMethod, {
      type: 'card' | 'alipay' | 'wechat';
      details: any;
    }>({
      query: (body) => ({
        url: 'payment-methods',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // Review endpoints
    getProductReviews: builder.query<Review[], string>({
      query: (productId) => `products/${productId}/reviews`,
      providesTags: ['Reviews'],
    }),

    createReview: builder.mutation<Review, {
      productId: string;
      rating: number;
      comment: string;
      images?: string[];
    }>({
      query: (body) => ({
        url: 'reviews',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reviews'],
    }),

    // Chat endpoints
    getTeamChat: builder.query<ChatMessage[], string>({
      query: (teamId) => `teams/${teamId}/chat`,
      providesTags: ['Chat'],
    }),

    sendChatMessage: builder.mutation<ChatMessage, {
      teamId: string;
      message: string;
    }>({
      query: (body) => ({
        url: `teams/${body.teamId}/chat`,
        method: 'POST',
        body: { message: body.message },
      }),
      invalidatesTags: ['Chat'],
    }),

    // Live Stream endpoints
    getLiveStreams: builder.query<LiveStream[], void>({
      query: () => 'live-streams',
      providesTags: ['LiveStreams'],
    }),

    createLiveStream: builder.mutation<LiveStream, {
      title: string;
      description?: string;
      scheduledFor?: string;
      products: string[];
    }>({
      query: (body) => ({
        url: 'live-streams',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['LiveStreams'],
    }),

    // Notification endpoints
    getNotifications: builder.query<Notification[], void>({
      query: () => 'notifications',
      providesTags: ['Notifications'],
    }),

    markNotificationRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetCartQuery,
  useUpdateCartMutation,
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetGroupBuysQuery,
  useCreateGroupBuyMutation,
  useCreateTeamMutation,
  useJoinTeamMutation,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useGetUserAddressesQuery,
  useAddAddressMutation,
  useGetUserPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useGetTeamChatQuery,
  useSendChatMessageMutation,
  useGetLiveStreamsQuery,
  useCreateLiveStreamMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} = api;

export default api;