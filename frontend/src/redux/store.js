import { configureStore } from '@reduxjs/toolkit';
import salesOrderReducer from './slices/salesOrderSlice';
import referenceDataReducer from './slices/referenceDataSlice';

export const store = configureStore({
  reducer: {
    salesOrders: salesOrderReducer,
    referenceData: referenceDataReducer,
  },
});
