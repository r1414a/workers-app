// src/store/slices/device-slice.ts

import { DeviceFingerprint } from "@/types/device.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeviceState {
  fingerprint: DeviceFingerprint | null;
  registered: boolean;
}

const initialState: DeviceState = {
  fingerprint: null,
  registered: false,
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    registerDevice(state, action: PayloadAction<DeviceFingerprint>) {
      state.fingerprint = action.payload;
      state.registered = true;
    },

    clearDevice(state) {
      state.fingerprint = null;
      state.registered = false;
    },
  },
  selectors: {
    selectDevice: (state) => state,
  },
});

export const { selectDevice } = deviceSlice.selectors;

export const { registerDevice, clearDevice } = deviceSlice.actions;

export default deviceSlice.reducer;
