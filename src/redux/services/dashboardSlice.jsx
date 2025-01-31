import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "./axiosApi";
import authHeader from "./authHeader";

export const getDashboardData = createAsyncThunk(
  "dashboard/getDashboardData",
  async ({ startDate = null, endDate = null } = {}, { rejectWithValue }) => {
    const params = {};

    if (startDate) {
      params.startDate = startDate;
    }
    if (endDate) {
      params.endDate = endDate;
    }

    try {
      const response = await apiInstance.get("/dashboard", {
        headers: authHeader(),
        params: Object.keys(params).length ? params : undefined,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

const initialState = {
  dashboardData: [],
};

const dashboardSlice = createSlice({
  name: "dashboardSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDashboardData.fulfilled, (state, action) => {
      state.dashboardData = action.payload.data;
    });
  },
});
export default dashboardSlice.reducer;
