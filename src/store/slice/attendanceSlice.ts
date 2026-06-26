// store/slices/attendanceSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AttendanceRecord } from "@/types/attendance.types";

interface AttendanceState {
  todayRecord: AttendanceRecord | null;

  selfieUri: string | null;

  checkInStep: number;

  history: AttendanceRecord[];
}

const initialState: AttendanceState = {
  todayRecord: null,
  selfieUri: null,
  checkInStep: 1,
  history: [],
};

const attendanceSlice = createSlice({
  name: "attendance",

  initialState,

  reducers: {
    setTodayRecord(state, action: PayloadAction<AttendanceRecord | null>) {
      state.todayRecord = action.payload;
    },

    setSelfie(state, action: PayloadAction<string | null>) {
      state.selfieUri = action.payload;
    },

    setCheckInStep(state, action: PayloadAction<number>) {
      state.checkInStep = action.payload;
    },

    addAttendanceRecord(state, action: PayloadAction<AttendanceRecord>) {
      state.history.unshift(action.payload);
    },

    updateAttendanceRecord(state, action: PayloadAction<AttendanceRecord>) {
      const index = state.history.findIndex(
        (record) => record.id === action.payload.id,
      );

      if (index !== -1) {
        state.history[index] = action.payload;
      }

      if (state.todayRecord?.id === action.payload.id) {
        state.todayRecord = action.payload;
      }
    },

    clearAttendance(state) {
      state.todayRecord = null;
      state.selfieUri = null;
      state.checkInStep = 1;
      state.history = [];
    },
  },

  selectors: {
    selectAttendance: (state) => state,

    selectTodayRecord: (state) => state.todayRecord,

    selectHistory: (state) => state.history,

    selectCheckInStep: (state) => state.checkInStep,

    selectSelfieUri: (state) => state.selfieUri,
  },
});

export const {
  setTodayRecord,
  setSelfie,
  setCheckInStep,
  addAttendanceRecord,
  updateAttendanceRecord,
  clearAttendance,
} = attendanceSlice.actions;

export const {
  selectAttendance,
  selectTodayRecord,
  selectHistory,
  selectCheckInStep,
  selectSelfieUri,
} = attendanceSlice.selectors;

export default attendanceSlice.reducer;
