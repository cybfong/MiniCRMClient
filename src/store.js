import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';

import authReducer from './features/login/authSlice';
import customerReducer from './features/customer/customerSlice';

const sessionStorageAdapter = storageSession?.default ?? storageSession;

const rootReducer = combineReducers({
  auth: authReducer,
  customer: customerReducer,
});

const persistConfig = {
  key: 'root',
  storage: sessionStorageAdapter,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
export const persistor = persistStore(store);
