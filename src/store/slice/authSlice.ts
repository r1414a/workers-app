import { WorkerProfile } from "@/types/worker.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  isFirstLogin: boolean;
  token: string | null;
  worker: WorkerProfile | null;
}

const initialState: AuthState = {
  isLoggedIn: true,
  isFirstLogin: false,
  token: "demo-token",
  worker: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },

    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
    },

    setWorkerProfile: (state, action: PayloadAction<WorkerProfile>) => {
      state.worker = action.payload;
    },

    updateProfilePhoto: (state, action: PayloadAction<string>) => {
      if (state.worker) {
        state.worker.profilePhoto = action.payload;
      }
    },
  },
  selectors: {
    selectUser: (state) => state,
  },
});

export const { selectUser } = authSlice.selectors;

export const { login, logout, setWorkerProfile, updateProfilePhoto } =
  authSlice.actions;
export default authSlice.reducer;
