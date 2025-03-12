import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storage } from '../../services/storage';
import { socketService } from '../../services/SocketService';
import { notificationService } from '../../services/NotificationService';
import type { User, AuthTokens } from '../../types';

interface UserState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const initializeAuth = createAsyncThunk(
  'user/initializeAuth',
  async (_, { dispatch }) => {
    const tokens = await storage.getItem('auth_tokens');
    if (tokens) {
      const parsedTokens: AuthTokens = JSON.parse(tokens);
      return parsedTokens;
    }
    return null;
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }, { dispatch }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }

      // Store tokens
      await storage.setItem('auth_tokens', JSON.stringify({
        token: data.token,
        refreshToken: data.refreshToken,
      }));

      // Initialize services
      socketService.connect(data.token);
      await notificationService.registerDevice();

      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    await storage.removeItem('auth_tokens');
    socketService.disconnect();
    dispatch(api.util.resetApiState());
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
        }
        state.loading = false;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(logout.fulfilled, (state) => {
        return initialState;
      });
  },
});

export const { updateUserProfile } = userSlice.actions;
export const userReducer = userSlice.reducer;