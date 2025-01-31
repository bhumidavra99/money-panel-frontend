import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "./axiosApi";
import authHeader from "./authHeader";

export const getReports = createAsyncThunk(
  "report/reports",
  async (
    { page, limit, startDate, endDate, search, statusFilter },
    { rejectWithValue }
  ) => {
    try {
      let url = `/customers/all?page=${page}&limit=${limit}`;
      if (startDate || endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      if (search) {
        url += `&search=${search}`;
      }
      if (statusFilter) {
        url += `&statusFilter=${statusFilter}`;
      }
      const response = await apiInstance.get(url, { headers: authHeader() });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getSingleReport = createAsyncThunk(
  "report/singleReport",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/customer/${customerId}`, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const addReport = createAsyncThunk(
  "report/addReport",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/customer/add`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editReport = createAsyncThunk(
  "report/editReport",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/customer/edit`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteReport = createAsyncThunk(
  "report/deleteReport",
  async (selectedId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.delete(
        `/customer/delete/${selectedId}`,
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
  customersData: [],
  singleCustomerData: [],
};

const reportSlice = createSlice({
  name: "reportSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getReports.fulfilled, (state, action) => {
      state.customersData = action.payload.data;
    });
    builder.addCase(getSingleReport.fulfilled, (state, action) => {
      state.singleCustomerData = action.payload.data;
    });
  },
});
export default reportSlice.reducer;
