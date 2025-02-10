import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "./axiosApi";
import authHeader from "./authHeader";

export const getDebits = createAsyncThunk(
  "debit/getDebits",
  async ({ startDate, endDate, search}, { rejectWithValue }) => {
    try {
        let url = `/debits/all`;
        if (startDate || endDate) {
          url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        if (search) {
          url += `&search=${search}`;
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

export const getSingleDebit = createAsyncThunk(
  "debit/getSingleDebit",
  async (debitId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/debit/${debitId}`, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addDebit = createAsyncThunk(
  "debit/addDebit",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/debit/add`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editDebit = createAsyncThunk(
  "debit/editDebit",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/debit/edit`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDebit = createAsyncThunk(
  "debit/deleteDebit",
  async (selectedId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.delete(`/debit/delete/${selectedId}`, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  debitData: [],
  singleDebitData: null,
};

const debitSlice = createSlice({
  name: "debitSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDebits.fulfilled, (state, action) => {
        state.debitData = action.payload.data;
      })
      .addCase(getSingleDebit.fulfilled, (state, action) => {
        state.singleDebitData = action.payload.data;
      });
  },
});

export default debitSlice.reducer;
