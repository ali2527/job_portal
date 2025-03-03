import { createSlice } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    savedJobs: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      const jobExists = state.savedJobs.some(job => job.id === action.payload.id);
      if (!jobExists) {
        state.savedJobs.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.savedJobs = state.savedJobs.filter(job => job.id !== action.payload);
    },
  },
});

const persistConfig = {
  key: 'favorites',
  storage,
};

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default persistReducer(persistConfig, favoritesSlice.reducer);
