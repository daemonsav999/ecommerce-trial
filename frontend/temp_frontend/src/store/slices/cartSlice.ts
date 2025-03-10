import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storage } from '../../services/storage';
import type { CartItem, Product } from '../../types';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  lastSynced: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  lastSynced: null,
};

export const syncCart = createAsyncThunk(
  'cart/sync',
  async (_, { getState }) => {
    const { cart, user } = getState() as any;
    
    if (!user.token) {
      // Store cart locally if not logged in
      await storage.setItem('cart', JSON.stringify(cart.items));
      return cart.items;
    }

    // Sync with server if logged in
    const response = await fetch('/api/cart/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify({ items: cart.items }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    return data.items;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => item.productId === action.payload.productId
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        item => item.productId !== action.payload
      );
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(
        item => item.productId === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.lastSynced = new Date().toISOString();
        state.loading = false;
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;