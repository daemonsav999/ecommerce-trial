import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

// Custom transform to optimize stored data size
const optimizeTransform = createTransform(
  // Transform state on its way to being serialized and persisted
  (inboundState, key) => {
    switch (key) {
      case 'products':
        // Only store essential product data
        return {
          ...inboundState,
          items: inboundState.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            thumbnail: item.thumbnail,
          })),
        };
      case 'cart':
        // Remove unnecessary metadata
        return {
          items: inboundState.items,
          totalItems: inboundState.totalItems,
          totalPrice: inboundState.totalPrice,
        };
      default:
        return inboundState;
    }
  },
  // Transform state being rehydrated
  (outboundState, key) => {
    return outboundState;
  }
);

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  transforms: [optimizeTransform],
  whitelist: ['cart', 'user', 'products'], // Only persist necessary slices
  throttle: 1000, // Throttle storage updates
};

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    // ... other reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false, // Disable in production
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Enable background optimization
if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
  window.requestIdleCallback(() => {
    store.dispatch({ type: 'OPTIMIZE_STORE' });
  });
}

setupListeners(store.dispatch);