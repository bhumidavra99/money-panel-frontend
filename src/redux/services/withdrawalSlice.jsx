import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "./axiosApi";
import authHeader from "./authHeader";

export const getWithdrawals = createAsyncThunk(
  "withdrawal/withdrawals",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      let url = `/withdrawal/all`;
      if (startDate || endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await apiInstance.get(url, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSingleWithdrawal = createAsyncThunk(
  "withdrawal/singleWithdrawal",
  async (withdrawalId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/withdrawal/${withdrawalId}`, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addWithdrawal = createAsyncThunk(
  "withdrawal/addWithdrawal",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/withdrawal/add`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editWithdrawal = createAsyncThunk(
  "withdrawal/editWithdrawal",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/withdrawal/edit`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteWithdrawal = createAsyncThunk(
  "withdrawal/deleteWithdrawal",
  async (selectedId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.delete(
        `/withdrawal/delete/${selectedId}`,
        {
          headers: authHeader(),
        }
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  withdrawalData: [],
  singleWithdrawalData: [],
};

const withdrawalSlice = createSlice({
  name: "withdrawalSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getWithdrawals.fulfilled, (state, action) => {
      state.withdrawalData = action.payload.data;
    });
    builder.addCase(getSingleWithdrawal.fulfilled, (state, action) => {
      state.singleWithdrawalData = action.payload.data;
    });
  },
});

export default withdrawalSlice.reducer;
