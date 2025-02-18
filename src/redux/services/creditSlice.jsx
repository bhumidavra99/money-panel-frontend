import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "./axiosApi";
import authHeader from "./authHeader";

export const getCredits = createAsyncThunk(
  "credit/getCredits",
  async ({ startDate, endDate, search } = {}, { rejectWithValue }) => {
    try {
      let url = `/credits/all`;
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

export const getSingleCredit = createAsyncThunk(
  "credit/getSingleCredit",
  async (creditId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/credit/${creditId}`, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addCredit = createAsyncThunk(
  "credit/addCredit",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/credit/add`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editCredit = createAsyncThunk(
  "credit/editCredit",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/credit/edit`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCredit = createAsyncThunk(
  "credit/deleteCredit",
  async (selectedId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.delete(`/credit/delete/${selectedId}`, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  creditData: [],
  singleCreditData: null,
};
const creditSlice = createSlice({
  name: "creditSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCredits.fulfilled, (state, action) => {
        state.creditData = action.payload.data;
      })
      .addCase(getSingleCredit.fulfilled, (state, action) => {
        state.singleCreditData = action.payload.data;
      });
  },
});

export default creditSlice.reducer;
