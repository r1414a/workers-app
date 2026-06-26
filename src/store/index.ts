import { configureStore } from "@reduxjs/toolkit";

import attendanceReducer from "@/store/slice/attendanceSlice";
import authReducer from "@/store/slice/authSlice";
import deviceReducer from "@/store/slice/deviceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    device: deviceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
