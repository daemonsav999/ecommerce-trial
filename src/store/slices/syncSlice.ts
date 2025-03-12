import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SyncState {
  offlineQueue: any[];
  isSyncing: boolean;
  lastSyncTimestamp: number | null;
}

const initialState: SyncState = {
  offlineQueue: [],
  isSyncing: false,
  lastSyncTimestamp: null,
};

export const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    queueAction: (state, action: PayloadAction<any>) => {
      state.offlineQueue.push(action.payload);
    },
    startSync: (state) => {
      state.isSyncing = true;
    },
    syncComplete: (state) => {
      state.isSyncing = false;
      state.lastSyncTimestamp = Date.now();
      state.offlineQueue = [];
    },
    syncFailed: (state) => {
      state.isSyncing = false;
    },
  },
});

export const { queueAction, startSync, syncComplete, syncFailed } = syncSlice.actions;
export default syncSlice.reducer;