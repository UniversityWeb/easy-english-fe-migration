import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';

import courseReducer from './courseSlice';

const middlewares = [];
if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({
    collapsed: (getState, action, logEntry) => !logEntry.error,
  });

  middlewares.push(logger);
}
const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middlewares),
  devTools: process.env.NODE_ENV === 'development',
  reducer: {
    course: courseReducer,

    // Add other store here
  },
});

export default store;
