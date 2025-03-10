import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '../services/api';
import { userReducer } from './slices/userSlice';
import { cartReducer } from './slices/cartSlice';
import { uiReducer } from './slices/uiSlice';

// Add these new imports for additional slices
import { productsReducer } from './slices/productsSlice';
import { groupBuyReducer } from './slices/groupBuySlice';
import { ordersReducer } from './slices/ordersSlice';
import { chatReducer } from './slices/chatSlice';
import { locationReducer } from './slices/locationSlice';
import { notificationsReducer } from './slices/notificationsSlice';

// Create root reducer with persistence configuration
const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  user: userReducer,
  cart: cartReducer,
  ui: uiReducer,
  products: productsReducer,
  groupBuy: groupBuyReducer,
  orders: ordersReducer,
  chat: chatReducer,
  location: locationReducer,
  notifications: notificationsReducer,
});

// Define state type
export type RootState = ReturnType<typeof rootReducer>;

// Custom middleware to handle offline queue
const offlineMiddleware = (store: any) => (next: any) => (action: any) => {
  // Handle offline actions
  if (!navigator.onLine) {
    // Store action in queue if it's not a sync action
    if (!action.meta?.sync) {
      // Implement offline queue logic here
      return store.dispatch({
        type: 'QUEUE_OFFLINE_ACTION',
        payload: action,
      });
    }
  }
  return next(action);
};

// Configure store with enhanced middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types in serializableCheck
        ignoredActions: ['QUEUE_OFFLINE_ACTION', 'FLUSH_OFFLINE_QUEUE'],
        // Ignore these field paths in serializableCheck
        ignoredPaths: ['payload.timestamp'],
      },
    }).concat(api.middleware, offlineMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Export types
export type AppDispatch = typeof store.dispatch;

// Export selector helpers
export const selectCurrentUser = (state: RootState) => state.user;
export const selectCart = (state: RootState) => state.cart;
export const selectUI = (state: RootState) => state.ui;
export const selectProducts = (state: RootState) => state.products;
export const selectGroupBuy = (state: RootState) => state.groupBuy;
export const selectOrders = (state: RootState) => state.orders;
export const selectChat = (state: RootState) => state.chat;
export const selectLocation = (state: RootState) => state.location;
export const selectNotifications = (state: RootState) => state.notifications;

// Export store singleton instance
export default store;