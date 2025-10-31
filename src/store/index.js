import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import themeSlice from './slices/themeSlice';
import scamSlice from './slices/scamSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
    scam: scamSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
