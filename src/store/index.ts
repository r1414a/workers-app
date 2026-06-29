import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "@/store/api/baseApi";
import attendanceReducer from "@/store/slice/attendanceSlice";
import authReducer from "@/store/slice/authSlice";
import deviceReducer from "@/store/slice/deviceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    device: deviceReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
