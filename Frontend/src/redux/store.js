// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist/es/constants';
import authReducer from './slices/authSlice';
import { authApiSlice } from './api/authApiSlice';
import { profileApiSlice } from './api/profileApiSlice';
import { jobApiSlice } from './api/jobsApiSlice';
import { vehicleApiSlice } from './api/vehicleApiSlice';
import { notificationApiSlice } from './api/notificationApiSlice';
import { recommendationApiSlice } from './api/recommendationApiSlice';
import { pdfApiSlice } from './api/pdfApiSlice';
import { contractorApiSlice } from './api/contractorApiSlice';
import { ownerApiSlice } from './api/ownerApiSlice';
import { workerApiSlice } from './api/workerApiSlice';
const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'userType', 'token'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [profileApiSlice.reducerPath]: profileApiSlice.reducer,
    [jobApiSlice.reducerPath]: jobApiSlice.reducer,
    [vehicleApiSlice.reducerPath]: vehicleApiSlice.reducer,
    [notificationApiSlice.reducerPath]: notificationApiSlice.reducer,
    [recommendationApiSlice.reducerPath]: recommendationApiSlice.reducer,
    [pdfApiSlice.reducerPath]: pdfApiSlice.reducer,
    [contractorApiSlice.reducerPath]: contractorApiSlice.reducer,
    [ownerApiSlice.reducerPath]: ownerApiSlice.reducer,
    [workerApiSlice.reducerPath]: workerApiSlice.reducer,
    },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApiSlice.middleware,
      profileApiSlice.middleware,
      jobApiSlice.middleware,
      vehicleApiSlice.middleware,
      notificationApiSlice.middleware,
      recommendationApiSlice.middleware,
      pdfApiSlice.middleware,
      contractorApiSlice.middleware,
      ownerApiSlice.middleware,
      workerApiSlice.middleware,
    ),
  });
  
  export const persistor = persistStore(store);
  