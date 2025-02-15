import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "./axiosApi";
import authHeader from "./authHeader";

export const getTotalBalance = createAsyncThunk(
  "balance/totalBalance",
  async (_, { rejectWithValue }) => {
    try {
      let url = `/total-balance`;
    
      const response = await apiInstance.get(url, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  balanceData: [],
};

const balanceSlice = createSlice({
  name: "balanceSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTotalBalance.fulfilled, (state, action) => {
      state.balanceData = action.payload.data;
    });
  },
});
export default balanceSlice.reducer;
