import type { WorkerSession } from "@/services/AuthSessionService";
import type { VerifiedWorker, WorkerSite } from "@/types/api.types";
import { WorkerProfile } from "@/types/worker.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  isDeviceRegistered: boolean;
  token: string | null;
  worker: WorkerProfile | null;
  assignedSite: WorkerSite | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  isDeviceRegistered: false,
  token: null,
  worker: null,
  assignedSite: null,
};

function mapVerifiedWorker(worker: VerifiedWorker): WorkerProfile {
  return {
    fullName: [worker.firstName, worker.lastName].filter(Boolean).join(" "),
    employeeId: worker.id,
    mobileNumber: worker.phone ?? "",
    emergencyContact: "",
    bloodGroup: "",
  };
}

function applyWorkerAuth(
  state: AuthState,
  token: string,
  worker: VerifiedWorker,
) {
  state.isLoggedIn = true;
  state.token = token;
  state.worker = mapVerifiedWorker(worker);
  state.assignedSite = worker.site;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setDeviceRegistered(state, action: PayloadAction<boolean>) {
      state.isDeviceRegistered = action.payload;
    },

    loginSuccess(state, action: PayloadAction<{ token: string; worker: VerifiedWorker }>) {
      applyWorkerAuth(state, action.payload.token, action.payload.worker);
    },

    restoreSession(state, action: PayloadAction<WorkerSession>) {
      state.isLoggedIn = true;
      state.isDeviceRegistered = true;
      state.token = action.payload.token;
      state.worker = action.payload.worker;
      state.assignedSite = action.payload.assignedSite;
    },

    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.worker = null;
      state.assignedSite = null;
    },

    setWorkerProfile: (state, action: PayloadAction<WorkerProfile>) => {
      state.worker = action.payload;
    },

    setAssignedSite: (state, action: PayloadAction<WorkerSite | null>) => {
      state.assignedSite = action.payload;
    },

    updateProfilePhoto: (state, action: PayloadAction<string>) => {
      if (state.worker) {
        state.worker.profilePhoto = action.payload;
      }
    },
  },
  selectors: {
    selectUser: (state) => state,
    selectAssignedSite: (state) => state.assignedSite,
    selectAuthToken: (state) => state.token,
  },
});

export const { selectUser, selectAssignedSite, selectAuthToken } =
  authSlice.selectors;

export const {
  setDeviceRegistered,
  loginSuccess,
  restoreSession,
  logout,
  setWorkerProfile,
  setAssignedSite,
  updateProfilePhoto,
} = authSlice.actions;
export default authSlice.reducer;
