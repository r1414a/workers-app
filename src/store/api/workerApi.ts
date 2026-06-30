import type {
  ApiResponse,
  AttendanceHistoryData,
  AttendanceHistoryParams,
  VerifyWorkerData,
  VerifyWorkerRequest,
  WorkerLoginData,
  WorkerLoginRequest,
  WorkerMeData,
} from "@/types/api.types";

import { baseApi } from "./baseApi";

export const workerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyWorker: builder.mutation<ApiResponse<VerifyWorkerData>, VerifyWorkerRequest>(
      {
        query: (body) => {
          console.log("verifyWorker");
          
          return({
          url: "/worker/verify",
          method: "POST",
          body,
        })}
      },
    ),
    loginWorker: builder.mutation<ApiResponse<WorkerLoginData>, WorkerLoginRequest>(
      {
        query: (body) => {
          console.log("loginWorker");
          return({
          url: "/worker/login",
          method: "POST",
          body,
        })}
      },
    ),
    getWorkerMe: builder.query<ApiResponse<WorkerMeData>, void>({
      query: () => {
        console.log("me");
        
        return("/worker/me")
      },
    }),
    getAttendanceHistory: builder.query<
      ApiResponse<AttendanceHistoryData>,
      AttendanceHistoryParams
    >({
      query: ({ year, month }) => {
        console.log(year, month);
        
        return(`/worker/atttendance?year=${year}&month=${month}`)
      }
    }),
  }),
});

export const {
  useVerifyWorkerMutation,
  useLoginWorkerMutation,
  useGetWorkerMeQuery,
  useLazyGetWorkerMeQuery,
  useGetAttendanceHistoryQuery,
} = workerApi;
