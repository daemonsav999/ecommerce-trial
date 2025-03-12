import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  language: string;
  isOffline: boolean;
  modals: {
    [key: string]: boolean;
  };
  alerts: {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }[];
  navigationState: {
    previousRoute: string | null;
    currentRoute: string | null;
  };
}

const initialState: UIState = {
  theme: 'light',
  language: 'en',
  isOffline: false,
  modals: {},
  alerts: [],
  navigationState: {
    previousRoute: null,
    currentRoute: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setOfflineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    showModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true;
    },
    hideModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false;
    },
    addAlert: (state, action: PayloadAction<Omit<UIState['alerts'][0], 'id'>>) => {
      state.alerts.push({
        ...action.payload,
        id: Date.now().toString(),
      });
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    updateNavigationState: (state, action: PayloadAction<{ route: string }>) => {
      state.navigationState.previousRoute = state.navigationState.currentRoute;
      state.navigationState.currentRoute = action.payload.route;
    },
  },
});

export const {
  setTheme,
  setLanguage,
  setOfflineStatus,
  showModal,
  hideModal,
  addAlert,
  removeAlert,
  updateNavigationState,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;