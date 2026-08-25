import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import courseReducer from './courseSlice';

const middlewares = [];
if (import.meta.env.MODE === 'development') {
  const logger = createLogger({
    collapsed: (getState: any, action: any, logEntry: any) => !logEntry.error,
  });

  middlewares.push(logger as any);
}
const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middlewares),
  devTools: import.meta.env.MODE === 'development',
  reducer: {
    course: courseReducer,

    // Add other store here
  },
});

export default store;
