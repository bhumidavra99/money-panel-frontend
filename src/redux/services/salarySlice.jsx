import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiInstance } from "./axiosApi";
import authHeader from "./authHeader";

export const getSalaries = createAsyncThunk(
  "salary/salaries",
  async ({ startDate, endDate}, { rejectWithValue }) => {
    try {
        let url = `/salary/all`;
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

export const getSingleSalary = createAsyncThunk(
  "salary/singleSalary",
  async (salaryId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/salary/${salaryId}`, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addSalary = createAsyncThunk(
  "salary/addSalary",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/salary/add`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editSalary = createAsyncThunk(
  "salary/editSalary",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post(`/salary/edit`, payload, {
        headers: authHeader(),
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSalary = createAsyncThunk(
  "salary/deleteSalary",
  async (selectedId, { rejectWithValue }) => {
    try {
      const response = await apiInstance.delete(
        `/salary/delete/${selectedId}`,
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
  salaryData: [],
  singleSalaryData: [],
};

const salarySlice = createSlice({
  name: "salarySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSalaries.fulfilled, (state, action) => {
      state.salaryData = action.payload.data;
    });
    builder.addCase(getSingleSalary.fulfilled, (state, action) => {
      state.singleSalaryData = action.payload.data;
    });
  },
});

export default salarySlice.reducer;
